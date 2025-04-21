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
    
    included_types = ["amusement_park", "aquarium", "art_gallery", "bar", "book_store", 
                          "bowling_alley", "casino", "historical_place"
                          "clothing_store", "gym", "movie_theater", "museum", "park", 
                          "shopping_mall", "spa", "stadium", "tourist_attraction", "zoo", "restaurant", "cafe", "bakery", "lodging", "hotel", "inn", "cottage", "bed_and_breakfast", "motel", "resort_hotel"]
    
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


def placeClassification(placeTypes):
    print("types for place:", placeTypes)
    if any(x in placeTypes for x in ["bakery", "cafe"]):
        return "breakfast"
    elif any (x in placeTypes for x in ["restaurant"]):
        return "restaurant"
    elif any (x in placeTypes for x in ["lodging", "hotel", "bed_and_breakfast", "inn", "motel", "resort_hotel"]):
        return "hotel"
    else:
        return "activity"


def prepareSurpriseData(response_json, user_preferences= "None", user_id = "newUser"): # default to new user or none if pref and user are n/a

    data = []
    preferences = user_preferences or {} # either user pref array or empty array
    interest = preferences.get("interest", []) # either interests or empty  
    budget = preferences.get("budget", "$$") # defaults to mid budget if none is inputted
    dietary = preferences.get("dietary", []) # either diet restriction or empty

    budgetNum = {"$": 1, "$$": 2, "$$$": 3, "$$$$": 4} #  string budget to integer conversion
    budgetLev = budgetNum.get(budget, 2) # convert
   
    places = response_json.get("places", []) 
    for x in places: # from api search
        placeID = x["displayName"]["text"]
        placeTypes = x.get("types", [])
        rating = x.get("rating", random.uniform(3.0,4.5)) # random rating if there's none
        
        priceDict = x.get("priceRange", {"value": "$$"}) # had to add this bc of incompatibility w dict
        priceRange = priceDict.get("value", "$$")
        priceLevel = budgetNum.get(priceRange, 2)

        if any(p in placeTypes for p in interest): # try to boost rating to bias surprise
            rating += 0.5
        if priceLevel <= budgetLev: # try to boost rating to bias surprise
            rating += 0.2
        rating = min(rating, 5.0)

        category = placeClassification(placeTypes)
        x["category"] = category # this will be used in surprise when we want to pick things for every day
        data.append((user_id, placeID, rating)) # put it in surprise library format into the data array

    return data

if __name__ == "__main__":
    print(prettyJSON(findNearbyPlacesByName("dallas", 5000.0))) # get rid of this after debugging...
