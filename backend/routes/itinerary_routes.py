
from flask import Blueprint, request, jsonify, current_app
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from surprise import SVD, Dataset, Reader
from dotenv import load_dotenv
import jwt
import os
import pandas as pd
from services.placesAPI import findNearbyPlacesByName, prepareSurpriseData
from services.itinerary import trainModel, rankPlaces


# load key from .env file
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "key") 

# use blueprint to make routes modular
itinerary_routes = Blueprint("itinerary_routes", __name__)

# mongo is initialized in app.py
mongo = None




#####################################################    
#HELPER FUNCTIONS!!!

# helper authentication function
def authenticate_user(request): 
    #Extract user ID from the JWT token in headers
    token = request.headers.get("Authorization")
    if not token:
        return None, jsonify({"message": "Unauthorized"}), 401

    extracted = token.split(" ")[1]
    try:
        decoded = jwt.decode(extracted, SECRET_KEY, algorithms=["HS256"])
        return ObjectId(decoded["user_id"]), None
    except jwt.InvalidTokenError:
        return None, jsonify({"message": "Invalid token"}), 401
    

# helper function to save rating for surprise library things (in user_ratings database collection!)
def mongo_storeRatings(user_id, selected_places):

    # need to do this or you get an error, idk why but it wouldn't work without it
    mongo = current_app.extensions["pymongo"]

    if mongo is None:  
        return jsonify({"message": "MongoDB is not initialized in itinerary_routes"}), 500  
    
    col = mongo.db.user_ratings

    for place in selected_places:

        place_id = place["displayName"]["text"]
        col.insert_one({
            "user_id": user_id,
            "place_id": place_id,
            "rating": 5.0,
            "source": "generatedItin"
        })

#####################################################
# ROUTES!!


# # for frontend ItineraryView.js: get itineraries for user
# @itinerary_routes.route("/itineraries", methods=["GET"])
# def get_user_itineraries():
#     user_id, error = authenticate_user(request)
#     if error:
#         return error
    
#     itineraries = list(mongo.db.itineraries.find({"user_id": user_id}, {"_id": 1, "name": 1, "destination": 1, "startDate": 1, "endDate": 1}))

#     for itinerary in itineraries:
#         # convert ObjectId to string (JSON)
#         itinerary["_id"] = str(itinerary["_id"])
#     return jsonify(itineraries), 200


# # for frontend ItineraryView.js: get itinerary by id
# @itinerary_routes.route("/itinerary/<itinerary_id>", methods=["GET"])
# def get_itinerary(itinerary_id):
#     user_id, error = authenticate_user(request)
#     if error:
#         return error

#     itinerary = mongo.db.itineraries.find_one({"_id": ObjectId(itinerary_id), "user_id": user_id})
    
#     if not itinerary:
#         return jsonify({"message": "could not find itinerary"}), 404

#     itinerary["_id"] = str(itinerary["_id"])
#     return jsonify(itinerary), 200


# ####################

# # for frontend ItineraryView.js: create  itinerary 

#     ## integrated later, once google places api done
@itinerary_routes.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():

    user_id, error = authenticate_user(request)
    if error:
        return error
    
    mongo = current_app.extensions["pymongo"]

    data = request.json
    destination = data.get("destination")
    interests = data.get("interests", [])
    dietary = data.get("dietary", [])
    budget = data.get("budget")
    startDate = data.get("startDate")
    endDate = data.get("endDate")
    numTravelers = data.get("travelers")

    # add logic for grabbing places (google places api call)
    googleFetch = findNearbyPlacesByName(destination, 5000.0, {"includedTypes": interests}).json()

    # get surprise ready
    userPref = {
        "interest": interests,
        "budget": budget,
        "dietary": dietary
    }
    surpriseData = prepareSurpriseData(googleFetch, userPref, str(user_id))


    # add logic for combining with user_ratings database
    col = mongo.db.user_ratings
    pastUserData = list(col.find({"user_id": user_id}))
    pastData = [(str(x["user_id"]), x["place_id"], x["rating"]) for x in pastUserData]

    currData = pastData + surpriseData # combine old and current data

    df = pd.DataFrame(currData, columns = ["user_id", "place_id", "rating"])
    reader = Reader(rating_scale = (1,5))
    dataset = Dataset.load_from_df(df, reader)

    # add logic for training the ai model
    model = trainModel(user_id, surpriseData, pastData)

    # once model is trained, select top places
    topPlaces = rankPlaces(model, user_id, googleFetch, top=5) # adjust top number!!

    # store feedback into mongoDB
    mongo_storeRatings(user_id, topPlaces)
    mongo.db.itineraries.insert_one({
        "user_id": user_id,
        "destination": destination,
        "startDate": startDate,
        "endDate": endDate,
        "travelers": numTravelers,
        "places": topPlaces
    })

    return jsonify({"places": topPlaces}), 200




# # for frontend ItineraryView.js: edit existing itinerary 

#     ## integrated later, once google places api done

# #####################


# # for frontend ItineraryView.js: delte existing itinerary 
# @itinerary_routes.route("/itinerary/<itinerary_id>", methods=["DELETE"])
# def delete_itinerary(itinerary_id):
#     user_id, error = authenticate_user(request)
#     if error:
#         return error

#     result = mongo.db.itineraries.delete_one({"_id": ObjectId(itinerary_id), "user_id": user_id})

#     if result.deleted_count == 0:
#         return jsonify({"message": "Itinerary not found or unauthorized"}), 404

#     return jsonify({"message": "Itinerary deleted"}), 200



