# MAIN PYTHON FILE

# make sure you install pyjwt: pip install pyjwt

# imports
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv # secure mongoDB uri
from routes.user_routes import user_routes
from routes.itinerary_routes import itinerary_routes
import os

# load env variable from .env
load_dotenv() 
print("MONGO_URI from .env:", os.getenv("MONGO_URI"))  # Debugging

# flask app, CORS, and PyMongo init
app = Flask(__name__) # create instance of flask
app.config["MONGO_URI"] = os.getenv("MONGO_URI") # configure mongoDB connection (key in .env)
mongo = PyMongo(app) 
app.extensions["pymongo"] = mongo # mongoDB initialization
CORS(app) # cross-origin resource sharing, for js frontend + py backend

# assign mongo to route files
user_routes.mongo = mongo
itinerary_routes.mongo = mongo

# registers blueprints for modularity
app.register_blueprint(user_routes)
app.register_blueprint(itinerary_routes)



### test!!

print("MongoDB URI:", os.getenv("MONGO_URI"))  # Debugging
print("Connected to MongoDB Database:", mongo.db.name if mongo else "Mongo is None")

# run flask app
if __name__ == "__main__":
    app.run(debug=True)
