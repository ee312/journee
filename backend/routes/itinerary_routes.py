
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

    # need to do this or you get an error, idk why but it wouldn't work without it
    mongo = current_app.extensions["pymongo"]

    if mongo is None:  
        return jsonify({"message": "mongo  not initialized"}), 500  
    
    col = mongo.db.user_ratings

    for place in selected_places:
        print("place in mongoStoreRatings:", place) # debug for dict-string conversion

        place_id = place["displayName"]["text"]
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
        
#####################################################    
#ROUTES!


@itinerary_routes.route('/generate-itinerary', methods=['POST'])
def generateItinerary():
    print("Hit /generate-itinerary route!") #debugging
    user_id, error = authenticateUser(request) # authenticate user
    if error:
        print("authetication failed: ", error)
        return error

   # user_id = ObjectId("68065db471d4e9b655075bcf") # debug
    mongo = current_app.extensions["pymongo"]

    data = request.json # this is frontend data request
    destination = data.get("destination")
    interests = data.get("interests", [])
    dietary = data.get("dietary", [])
    budget = data.get("budget")
    startDate = data.get("startDate")
    endDate = data.get("endDate")

    days = totalDays(startDate, endDate) # get total number of days

    apiCall = findNearbyPlacesByName(destination, 5000.0, {"includedTypes": interests}).json() # get api places only based on user interest

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

    mongo.db.itineraries.insert_one({ # store itinerary in itineraries collection before returning it
        "user_id": user_id,
        "destination": destination,
        "startDate": startDate,
        "endDate": endDate,
        "itinerary": formattedItinerary
    })


    return jsonify(formattedItinerary), 200 # this sends back to frontend to be formatted correctly


