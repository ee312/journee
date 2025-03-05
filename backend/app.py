# MAIN PYTHON FILE

# imports
from flask import Flask, request, render_template, redirect, session
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from dotenv import load_dotenv # secure mongoDB uri
from werkzeug.security import generate_password_hash, check_password_hash # secure password handling
import os

# load env variable from .env
load_dotenv() 

# flask app, CORS, and PyMongo init
app = Flask(__name__) # create instance of flask
app.secret_key = "your_secret_key"                  #### probably need to come back and fix this
app.config["MONGO_URI"] = os.getenv("MONGO_URI") # configure mongoDB connection
mongo = PyMongo(app)
CORS(app)


# ROUTES DEFINITIONS
#########################################

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/register", methods =["GET", "POST"])
def register():
    if request.method == "POST":
        user = request.form.get("user")
        password = request.form.get("password")
    
        if not (user and password): # error, not all fields inputted
            return render_template("register.html", message = "fields not filled") ###register.html may need to be in frontend directory

        protect_pass = generate_password_hash(password)

        # check to see if username is already taken in mongoDB
        existingUser = mongo.db.users.find_one({"username": user})

        # if user exists already, find another
        if existingUser:
            return render_template("register.html", message="username taken.")
        # otherwise, put user into the database
        mongo.db.users.insert_one({"username": user, "password": protect_pass})
        # redirect to login
        return redirect("/login") 
    
    return render_template("register.html") ###register.html may need to be in frontend directory



@app.route("/login", methods =["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.get("user")
        password = request.form.get("password")

        # retrieve user data from database
        userData = mongo.db.users.find_one({"username": user})

        # check if user and pass exists
        if userData and check_password_hash(userData["password"], password):
            session["user_id"] = userData["_id"]
            return redirect("/userpage") # redirect to user home page
        else:
            return render_template("login.html", message="invalid username or password")

    return render_template("login.html")


@app.route("/logout")
def logout():
    # clear session
    session.clear()
    return redirect("/")

@app.route("/userpage")
def userpage():
    # if user not logged in, redirect to login page
    if "user_id" not in session:
        return redirect("/login")
    
    # get all of the user's data
    userData = mongo.db.users.find_one({"_id": session["user_id"]})
    return render_template("userpage.html", user = userData) ### check to see if mofe has userpage.html in, else replace

# run flask app
if __name__ == "__main__":
    app.run(debug=True)