# MAIN PYTHON FILE

# imports
from flask import Flask, render_template
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from dotenv import load_dotenv # secure mongoDB uri
from user_routes import user_routes
from itinerary_routes import itinerary_routes
import os

# load env variable from .env
load_dotenv() 

# flask app, CORS, and PyMongo init
app = Flask(__name__) # create instance of flask
app.secret_key = "your_secret_key"                  #### probably need to come back and fix this
app.config["MONGO_URI"] = os.getenv("MONGO_URI") # configure mongoDB connection
mongo = PyMongo(app)
CORS(app)

# assign mongo to route files
user_routes.mongo = mongo
itinerary_routes.mongo = mongo

# blueprints
app.register_blueprint(user_routes)
app.register_blueprint(itinerary_routes)




# route definition
@app.route("/")
def home():
    return render_template("index.html")

# run flask app
if __name__ == "__main__":
    app.run(debug=True)
