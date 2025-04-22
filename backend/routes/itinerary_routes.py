
from flask import Blueprint, request, jsonify, current_app
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from surprise import SVD, Dataset, Reader
from dotenv import load_dotenv
from datetime import datetime
import jwt
import os
import pandas as pd
from services.placesAPI import findNearbyPlacesByName, prepareSurpriseData
from services.itinerary import trainModel, rankPlaces
from routes.user_routes import authenticateUser # import from user_routes because we need it here

# load key from .env file
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "key") 

# use blueprint to make routes modular
itinerary_routes = Blueprint("itinerary_routes", __name__)



#####################################################    
#HELPER FUNCTION!

# helper function to save rating for surprise library things (in user_ratings database collection!)
def mongoStoreRatings(user_id, selected_places):

    mongo = current_app.extensions["pymongo"]
    if mongo is None:  
        return jsonify({"message": "mongo  not initialized"}), 500  
    
    col = mongo.db.user_ratings # user ratings collection pbject

    for place in selected_places:
        place_id = place["displayName"]["text"] # compress format for mongoDB
        col.insert_one({
            "user_id": user_id,
            "place_id": place_id,
            "rating": 5.0,
            "source": "generatedItin"
        })

# helper function to calculate number of days in trip
def totalDays(startDate, endDate):
    dateFormat = "%Y-%m-%d" # calculate total number of days for itinerary generation
    firstDay = datetime.strptime(startDate, dateFormat)
    lastDay = datetime.strptime(endDate, dateFormat)
    return (lastDay - firstDay).days + 1


# helper function to format itinerary
def itineraryFormatter(topPlaces, days):

    itinerary = [] # create itinerary and store daily
    if len(topPlaces["hotel"]) > 0:
        hotel = topPlaces["hotel"][0]
    else:
        hotel = None

    for d in range(days): # loop through days for daily plan
        dailyPlan = {}
        dailyPlan["day"] = d+1

        #breakfast
        if len(topPlaces["breakfast"]) > 0: # pick breakfast place
            index = d % len(topPlaces["breakfast"]) # avoid out of bounds problem, had to add this in so it wraps around
            dailyPlan["breakfast"] = topPlaces["breakfast"][index]
        else:
            dailyPlan["breakfast"] = None
        #lunch
        if len(topPlaces["lunch"]) > 0: 
            index = d % len(topPlaces["lunch"]) 
            dailyPlan["lunch"] = topPlaces["lunch"][index]
        else:
            dailyPlan["lunch"] = None
        # dinner
        if len(topPlaces["dinner"]) > 0:  
            index = d % len(topPlaces["dinner"]) 
            dailyPlan["dinner"] = topPlaces["dinner"][index]
        else:
            dailyPlan["dinner"] = None
        # activity
        if len(topPlaces["activity"]) > 0:  
            index = d % len(topPlaces["activity"]) 
            dailyPlan["activity"] = topPlaces["activity"][index]
        else:
            dailyPlan["activity"] = None

        itinerary.append(dailyPlan)
    
    return { # returns the one hotel and the daily itinerary
        "hotel": hotel,
        "days": itinerary
    }


# helper function to convert interests
def convertInterests(interests):

    interestType = { # conversion
        "Amusement Parks": "amusement_park",
        "Outdoors": "park",
        "Spa Day": "spa",
        "Art": "art_gallery",
        "Museum": "museum",
        "Bowling": "bowling_alley",
        "Shopping": "shopping_mall",
        "Working Out": "gym",
        "Zoo": "zoo",
        "History Buff": "historical_place",
        "going out for drinks": "bar",
        "Touristy": "tourist_attraction",
        "Gamble": "casino",
        "Books": "book_store",
        "Sports": "stadium",
        "Aquariums": "aquarium",
        "Movies": "movie_theater",
        "Hotel": "hotel",
        "Inn": "inn",
        "Cottage": "cottage",
        "Bed and Breakfast": "bed_and_breakfast",
        "Motel": "motel",
        "Resort": "resort_hotel"
    }

    placeTypes = []
    for i in interests:
        if i in interestType:
            val = interestType[i]
            if isinstance(val, list): # this was added to avoid an error where interests map to multiple types
                placeTypes.extend(val)
            else:
                placeTypes.append(val)
                
    return list(set(placeTypes))

        
#####################################################    
#ROUTES!


@itinerary_routes.route('/generate-itinerary', methods=['POST', 'OPTIONS'])
def generateItinerary():

    if request.method == 'OPTIONS': # ddebugging
        return jsonify({'message': 'CORS preflight okay'}), 200

    user_id, error = authenticateUser(request) # authenticate user
    if error:
        return error
    mongo = current_app.extensions["pymongo"]


    data = request.json # this is frontend data request
    destination = data.get("destination")
    interests = data.get("interests", [])
    dietary = data.get("dietary", [])
    budget = data.get("budget")
    startDate = data.get("startDate")
    endDate = data.get("endDate")

    days = totalDays(startDate, endDate) # get total number of days
    convertedInterests = convertInterests(interests) # need to get interests convered from frontend to compatible google places API format
    apiCall = findNearbyPlacesByName(destination, 5000.0, {"includedTypes": convertedInterests}).json() # get api places only based on user interest
    
    userPref = {  # get surprise ready
        "interest": interests,
        "budget": budget,
        "dietary": dietary
    }
    surpriseData = prepareSurpriseData(apiCall, userPref, str(user_id))

    datab = mongo.db.user_ratings # combine with user_ratings database
    pastUserData = list(datab.find({"user_id": user_id}))
    pastData = [(str(x["user_id"]), x["place_id"], x["rating"]) for x in pastUserData]

    currData = pastData + surpriseData # combine old and current data
    df = pd.DataFrame(currData, columns = ["user_id", "place_id", "rating"])
    reader = Reader(rating_scale = (1,5))
    dataset = Dataset.load_from_df(df, reader)

    model = trainModel(user_id, surpriseData, pastData) # train ai model
    topPlaces = rankPlaces(model, user_id, apiCall) # gives me places and categories

    formatPlacesStorage = [] # need to change to storage format or else it won't store in mongo
    for s in topPlaces.values():
        formatPlacesStorage.extend(s)
    mongoStoreRatings(user_id, formatPlacesStorage) # store feedback into mongoDB
    formattedItinerary = itineraryFormatter(topPlaces, days) # format itinerary

    compatWithFrontend = []
    for d in formattedItinerary["days"]:
        activities = []

        if d.get("activity"):
            activities.append({
                "id": f"{d['day']}-activity",
                "name": d["activity"]["displayName"]["text"],
                "type": "attraction/activity"
            })

        for mealType in ["breakfast", "lunch", "dinner"]:
            meal = d.get(mealType)
            if meal:
                activities.append({
                    "id": f"{d['day']}-{mealType}",
                    "name": meal["displayName"]["text"],
                    "type": "restaurant"
                })

        compatWithFrontend.append({
            "day": d["day"],
            "activities": activities
        })
    
    finalItinerary = {
    "destination": destination,
    "accommodation": formattedItinerary["hotel"]["displayName"]["text"] if formattedItinerary["hotel"] else None,
    "days": compatWithFrontend
    }   

    result = mongo.db.itineraries.insert_one({
    "user_id": user_id,
    "destination": destination,
    "startDate": startDate,
    "endDate": endDate,
    "itinerary": formattedItinerary
    })
    itinerary_id = str(result.inserted_id)
    finalItinerary["id"] = itinerary_id

    return jsonify(finalItinerary), 200 # this sends back to frontend to be formatted correctly



@itinerary_routes.route('/itinerary/<id>', methods=['GET'])
def getItineraryById(id):
    mongo = current_app.extensions["pymongo"]
    try:
        itin = mongo.db.itineraries.find_one({"_id": ObjectId(id)})
    except Exception as e:
        print("error during itinerary lookup:", str(e))
        return jsonify({"message": "Invalid itinerary ID"}), 400

    if not itin:
        return jsonify({"message": "Itinerary not found"}), 404

    itinerary = itin.get("itinerary", {})

    compatWithFrontend = []
    for d in itinerary.get("days", []):
        activities = []

        if d.get("activity"):
            activities.append({
                "id": f"{d['day']}-activity",
                "name": d["activity"]["displayName"]["text"],
                "type": "attraction/activity"
            })

        for mealType in ["breakfast", "lunch", "dinner"]:
            meal = d.get(mealType)
            if meal:
                activities.append({
                    "id": f"{d['day']}-{mealType}",
                    "name": meal["displayName"]["text"],
                    "type": "restaurant"
                })

        compatWithFrontend.append({
            "day": d["day"],
            "activities": activities
        })
    
    result = {
    "id": str(itin["_id"]),   
    "destination": itin["destination"],
    "accommodation": (
        itinerary.get("hotel", {}).get("displayName", {}).get("text")
        if itinerary.get("hotel") else None
    ),
    "days": compatWithFrontend
    }  

    return jsonify(result), 200

@itinerary_routes.route("/debug-itinerary/<id>", methods=["GET"]) ### debugging!!!
def debug_itin(id):
    mongo = current_app.extensions["pymongo"]
    doc = mongo.db.itineraries.find_one({"_id": ObjectId(id)})
    return jsonify(doc), 200


