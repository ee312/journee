# MAIN PYTHON FILE

# imports
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

# flask app, CORS, and PyMongo init
app = Flask(__name__)
CORS(app)


# routes definitions

# run flask app


## also need to init pymongo, and configure w mongoDB
