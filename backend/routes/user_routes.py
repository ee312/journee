
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
import jwt
from datetime import datetime, timedelta, UTC
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv

# load key from .env file
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "key") 

# use blueprint to make routes modular
user_routes = Blueprint("user_routes", __name__)

# mongo is initialized in app.py
mongo = None



@user_routes.route("/register", methods =["POST"])
def register():

    mongo = current_app.extensions["pymongo"]

    ## TESTER

    #print("Mongo in user_routes:", mongo)  # Debugging line
    if mongo is None:  
        return jsonify({"message": "MongoDB is not initialized in user_routes"}), 500  
    ##
    
    data = request.json # get frontend data (JSON format)
    username = data.get("user")
    password = data.get("password")

    if not (username and password): # error, not all fields inputted
        return jsonify({"message": "not all fields inputted"}), 400
    
    protect_pass = generate_password_hash(password)

    # check to see if username is already taken in mongoDB
    existingUser = mongo.db.users.find_one({"username": username})

    # if user exists already, find another
    if existingUser:
        return jsonify({"message": "user exists, find another"}), 409
    # otherwise, put user into the database
    mongo.db.users.insert_one({"username": username, "password": protect_pass})
    return jsonify({"message": "new user registered"}), 201



@user_routes.route("/login", methods =["POST"])
def login():

    mongo = current_app.extensions["pymongo"]

    data = request.json
    username = data.get("user")
    password = data.get("password")

    # retrieve user data from database
    userData = mongo.db.users.find_one({"username": username})

    # check if user and pass exists
    if userData and check_password_hash(userData["password"], password):
        token_payload = { #token expires in
            "user_id": str(userData["_id"]),"exp": datetime.now(UTC) + timedelta(hours=1)
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
        #print("SECRET_KEY Used in Login:", SECRET_KEY) ## debug!

        return jsonify({"message": "login successful", "user": username, "token": token}), 200
    else:
        return jsonify({"message": "invalid username or password"}), 401


@user_routes.route("/logout", methods=["POST"])
def logout(): # handled in front end

    return jsonify({"message": "logged out"}), 200


@user_routes.route("/userpage", methods=["GET"])
def userpage():

    mongo = current_app.extensions["pymongo"]

    #print("Mongo in user_routes (userpage):", mongo)

    token = request.headers.get("Authorization")

    # user_id, error_response = authenticate_user(request) # use helper function defined above!
    # if error_response:
    #     return error_response

    # userData = mongo.db.users.find_one({"_id": user_id}, {"password": 0})
    # if userData:
    #     return jsonify(userData), 200
    # else:
    #     return jsonify({"message": "User not found"}), 404

    if not token:
        return jsonify({"message": "unauthorized."}), 401
    try:
        extracted = token.split(" ")[1] # take the "Bearer" keyword out of the token 
        print("extracted token:", extracted) ## debug
        print("SECRET_KEY Used in /userpage:", SECRET_KEY)
        decoded = jwt.decode(extracted, SECRET_KEY, algorithms=["HS256"])

        #print("decoded token:", decoded) ## debug

        user_id = ObjectId(decoded["user_id"])
        #print("user id from token:", user_id)

        userData = mongo.db.users.find_one({"_id": user_id}, {"password": 0})
        if userData:
            return jsonify(userData), 200
        else:
            return jsonify({"message": "User not found"}), 404
    
    # error message for expired or invalid token 
    except jwt.ExpiredSignatureError: 
        print("Error: Token has expired")
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        print("Error: Token is invalid")
        return jsonify({"message": "Invalid token"}), 401