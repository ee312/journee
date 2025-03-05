
from Flask import Blueprint, request, render_template, redirect, session
from flask_pymongo import PyMongo

# use blueprint to make routes modular
itinerary_routes = Blueprint("itinerary_routes", __name__)

# mongo is initialized in app.py
mongo = None

@itinerary_routes.route("/userpage")
def userpage():
    # if user not logged in, redirect to login page
    if "user_id" not in session:
        return redirect("/login")
    
    # get all of the user's data
    userData = mongo.db.users.find_one({"_id": session["user_id"]})
    return render_template("userpage.html", user = userData) ### check to see if mofe has userpage.html in, else replace
