
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
import jwt
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv

load_dotenv() # load key from .env file
SECRET_KEY = os.getenv("SECRET_KEY", "key") 
user_routes = Blueprint("user_routes", __name__) # use blueprint to make routes modular
mongo = None # mongo is initialized in app.py


#####################################################    
# HELPER FUNCTION!

def authenticateUser(request): 
    #Extract user ID from the JWT token in headers
    token = request.headers.get("Authorization")
    if not token:
        return None, jsonify({"message": "Unauthorized"}), 400
    try:
        extracted = token.split(" ")[1]
        decoded = jwt.decode(extracted, SECRET_KEY, algorithms=["HS256"])
        return ObjectId(decoded["user_id"]), None
    except jwt.InvalidTokenError:
        return None, jsonify({"message": "Invalid token"}), 403
    


#####################################################    
# ROUTES!

@user_routes.route("/register", methods =["POST"])
def register():

    mongo = current_app.extensions["pymongo"] # have to add this in every route or it doesn't work
    if mongo is None:  
        return jsonify({"message": "MongoDB not initialized in user_routes"}), 500  # internal server error

    data = request.json # get frontend data (JSON format)
    username = data.get("user")
    password = data.get("password")

    if not (username and password): # error, not all fields inputted
        return jsonify({"message": "not all fields inputted"}), 400 # user error
    
    securePassword = generate_password_hash(password) # generate protection (extra security)
    existingUser = mongo.db.users.find_one({"username": username})  # check to see if username is already taken in mongoDB ("users" collection)

    if existingUser: # if user exists already, find another
        return jsonify({"message": "user exists, please login or find other user."}), 400 # username conflict
    mongo.db.users.insert_one({"username": username, "password": securePassword}) # otherwise, put user into database
    return jsonify({"message": "new user registered"}), 200 # all good




@user_routes.route("/login", methods =["POST"])
def login():
    mongo = current_app.extensions["pymongo"]

    frontend = request.json # request data from frontend using JSON
    username = frontend.get("user")
    password = frontend.get("password")

    userData = mongo.db.users.find_one({"username": username}) # retrieve user data from database
    if userData and check_password_hash(userData["password"], password): # check if user and pass exists
        token = jwt.encode({"user_id": str(userData["_id"])}, SECRET_KEY, algorithm="HS256") # encode token

        return jsonify({"message": "login successful", "user": username, "token": token}), 200 # all good
    else:
        return jsonify({"message": "invalid username or password"}), 401 # user error





@user_routes.route("/logout", methods=["POST"])
def logout(): # handled in front end
    return jsonify({"message": "logged out"}), 200





@user_routes.route("/userpage", methods=["GET"])
def userpage():
    mongo = current_app.extensions["pymongo"]

    user_id, error = authenticateUser(request)
    if error:
        return error
    
    userData = mongo.db.users.find_one({"_id": user_id}, {"password": 0})
    if not userData:
        return jsonify({"message": "User not found"}), 404
    
    trips = list(mongo.db.itineraries.find({"user_id": user_id})) # get user's trips
    for t in trips: # need to pull this from compressed form in mongoDB
        t["_id"] = str(t["_id"]) # extract mongodb's id field (ObjectId type)
        t["startDate"] = str(t.get("startDate", "")) 
        t["endDate"] = str(t.get("endDate", ""))

    userData["trips"] = trips
    
    return jsonify(userData), 200
