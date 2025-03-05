from flask import Blueprint, request, render_template, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo

# use blueprint to make routes modular
user_routes = Blueprint("user_routes", __name__)

# mongo is initialized in app.py
mongo = None


@user_routes.route("/register", methods =["GET", "POST"])
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



@user_routes.route("/login", methods =["GET", "POST"])
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


@user_routes.route("/logout")
def logout():
    # clear session
    session.clear()
    return redirect("/")

