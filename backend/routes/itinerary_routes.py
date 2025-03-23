
from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import jwt
import os
from datetime import datetime, UTC
from dotenv import load_dotenv




# load key from .env file
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "key") 

# use blueprint to make routes modular
itinerary_routes = Blueprint("itinerary_routes", __name__)

# mongo is initialized in app.py
mongo = None





def authenticate_user(request):
    #Extract user ID from the JWT token in headers
    token = request.headers.get("Authorization")
    if not token:
        return None, jsonify({"message": "Unauthorized"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return ObjectId(decoded["user_id"]), None
    except jwt.ExpiredSignatureError:
        return None, jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"message": "Invalid token"}), 401
    

# for frontend ItineraryView.js: get itineraries for user
@itinerary_routes.route("/itineraries", methods=["GET"])
def get_user_itineraries():
    user_id, error = authenticate_user(request)
    if error:
        return error
    
    itineraries = list(mongo.db.itineraries.find({"user_id": user_id}, {"_id": 1, "name": 1, "destination": 1, "startDate": 1, "endDate": 1}))

    for itinerary in itineraries:
        # convert ObjectId to string (JSON)
        itinerary["_id"] = str(itinerary["_id"])
    return jsonify(itineraries), 200


# for frontend ItineraryView.js: get itinerary by id
@itinerary_routes.route("/itinerary/<itinerary_id>", methods=["GET"])
def get_itinerary(itinerary_id):
    user_id, error = authenticate_user(request)
    if error:
        return error

    itinerary = mongo.db.itineraries.find_one({"_id": ObjectId(itinerary_id), "user_id": user_id})
    
    if not itinerary:
        return jsonify({"message": "could not find itinerary"}), 404

    itinerary["_id"] = str(itinerary["_id"])
    return jsonify(itinerary), 200


####################

# for frontend ItineraryView.js: create  itinerary 

    ## integrated later, once google places api done


# for frontend ItineraryView.js: edit existing itinerary 

    ## integrated later, once google places api done

#####################


# for frontend ItineraryView.js: delte existing itinerary 
@itinerary_routes.route("/itinerary/<itinerary_id>", methods=["DELETE"])
def delete_itinerary(itinerary_id):
    user_id, error = authenticate_user(request)
    if error:
        return error

    result = mongo.db.itineraries.delete_one({"_id": ObjectId(itinerary_id), "user_id": user_id})

    if result.deleted_count == 0:
        return jsonify({"message": "Itinerary not found or unauthorized"}), 404

    return jsonify({"message": "Itinerary deleted"}), 200