# MAIN PYTHON FILE

# make sure you install pyjwt: pip install pyjwt

# imports
from flask import Flask, render_template
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from dotenv import load_dotenv # secure mongoDB uri
from routes.user_routes import user_routes
from routes.itinerary_routes import itinerary_routes
import os

# load env variable from .env
load_dotenv() 
print("MONGO_URI from .env:", os.getenv("MONGO_URI"))  # Debugging

# flask app, CORS, and PyMongo init
app = Flask(__name__) # create instance of flask
#app.secret_key = "your_secret_key"                  #### probably need to come back and fix this
app.config["MONGO_URI"] = os.getenv("MONGO_URI") # configure mongoDB connection
mongo = PyMongo(app)
app.extensions["pymongo"] = mongo ## mongoDB initialization!
CORS(app)

# assign mongo to route files
user_routes.mongo = mongo
itinerary_routes.mongo = mongo

# blueprints
app.register_blueprint(user_routes)
app.register_blueprint(itinerary_routes)



### test!!

print("MongoDB URI:", os.getenv("MONGO_URI"))  # Debugging
print("Connected to MongoDB Database:", mongo.db.name if mongo else "Mongo is None")

######

# route definition
@app.route("/")
def home():
    return render_template("index.html")

# run flask app
if __name__ == "__main__":
    app.run(debug=True)
