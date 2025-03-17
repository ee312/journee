from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo

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
        #return render_template("register.html", message = "fields not filled") ###register.html may need to be in frontend directory
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
    
    return render_template("register.html") ###register.html may need to be in frontend directory



@user_routes.route("/login", methods =["POST"])
def login():

    data = request.json
    username = request.form.get("user")
    password = request.form.get("password")

    # retrieve user data from database
    userData = mongo.db.users.find_one({"username": username})

    # check if user and pass exists
    if userData and check_password_hash(userData["password"], password):
        session["user_id"] = userData["_id"]
        return jsonify({"message": "login successful", "user": username, "token": str(userData["_id"])}), 200
    else:
        return jsonify({"message": "invalid username or password"}), 401


@user_routes.route("/logout", methods=["POST"])
def logout():
    # clear session
    session.clear()
    return jsonify({"message": "logged out"}), 200


