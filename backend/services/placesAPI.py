# google places API service

# find nearby places:
#   documentation: 
#       https://developers.google.com/maps/documentation/places/web-service/nearby-search
# 
#   https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters 
#   must specify location (lat/long), radius
#   

import json
import requests # type: ignore
import os
import random
from geopy.geocoders import Nominatim # type: ignore
from dotenv import load_dotenv # type: ignore

load_dotenv()

api_key = os.getenv("GOOGLE_MAPS_API_KEY")
places_url = "https://places.googleapis.com/v1/places:searchNearby"
    
def findNearbyPlacesByCoor(lat, long, radius, kwargs = {}): 
    
    included_types = ["amusement_park", "aquarium", "art_gallery", "bakery", "bar", "book_store", 
                          "bowling_alley", "cafe", "campground", "casino", "church", "city_hall", 
                          "clothing_store", "electronics_store", "gym", "hindu_temple", "library", 
                          "mosque", "movie_theater", "museum", "night_club", "park", 
                          "shopping_mall", "spa", "stadium", "synagogue", "tourist_attraction", 
                          "train_station", "university", "zoo"]
    
    # excluded_types = ["hospital", "car_dealer", "car_wash", "lawyer", "bank", "accounting", 
    #                       "dentist", "insurance_agency", "moving_company", "physiotherapist", "primary_school", 
    #                       "roofing_contractor"]
    
    if kwargs.get("includedTypes") != None:
        included_types = kwargs.get("includedTypes")
    
    header = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key, 
        "X-Goog-FieldMask": "places.displayName,places.rating,places.priceRange,places.types",
    }
    
    req = {
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": long
                }, 
                "radius": radius,
            }
        }, 
        "includedTypes": included_types
    }
        
    nearby = requests.post(places_url, headers=header, json=req)
    return nearby

def findNearbyPlacesByName(place, radius, kwargs = {}): 
    [lat, long] = _getGeoDetails(place)
    return findNearbyPlacesByCoor(str(lat), str(long), radius, kwargs)

def _getGeoDetails(place):
    geoloc = Nominatim(user_agent="journee")
    loc = geoloc.geocode(place)
    return loc.latitude, loc.longitude

def prettyJSON(response):
    return json.dumps(response.json(), indent=4)

def prepareSurpriseData(response_json, user_preferences=None, user_id = "cold_user"):
    """
        convert api response to format compatible for AI
        if user hasn't been registered before, let's "cold start" and work from there
            fall back on content-based filtering (user google places & preferences)
            then, in the future, as they interact more, train with specific user ids!
    
    surprise library input: (user_id, item_id, rating)
    """
    data = []
    preferences = user_preferences or {}
    interest = preferences.get("interest", [])
    budget = preferences.get("budget", "$$")
    dietary = preferences.get("dietary", [])

    # converting $$ levels
    budgetNum = {"$": 1, "$$": 2, "$$$": 3, "$$$$": 4}
    budgetLev = budgetNum.get(budget, 2)
    
    places = response_json.get("places", [])
    for x in places:
        placeID = x["displayName"]["text"]
        placeTypes = x.get("types", [])
        rating = x.get("rating", random.uniform(3.0,4.5))
        priceLevel = budgetNum.get(x.get("priceRange", "$$"), 2)

        if any(item in placeTypes for item in interest):
            rating += 0.5

        if priceLevel <= budgetLev:
            rating += 0.2

        rating = min(rating, 5.0)
        data.append((user_id, placeID, rating)) # surprise library format

    return data

if __name__ == "__main__":
    print(prettyJSON(findNearbyPlacesByName("dallas", 5000.0)))
