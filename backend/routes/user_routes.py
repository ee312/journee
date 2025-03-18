

from flask import Blueprint, request, jsonify
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

        return jsonify({"message": "login successful", "user": username, "token": token}), 200
    else:
        return jsonify({"message": "invalid username or password"}), 401


@user_routes.route("/logout", methods=["POST"])
def logout(): # handled in front end
    return jsonify({"message": "logged out"}), 200


@user_routes.route("/userpage", methods=["GET"])
def userpage():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "unauthorized."}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = ObjectId(decoded["user_id"])
        userData = mongo.db.users.find_one({"_id": user_id}, {"password": 0})
        if userData:
            return jsonify(userData), 200
        else:
            return jsonify({"message": "User not found"}), 404
    
    # error message for expired or invalid token 
    except jwt.ExpiredSignatureError: 
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401