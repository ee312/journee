# google places API service

# to find nearby activities: 

# find place from text request (w/ user inputted city): 
#   documentation: 
#       https://developers.google.com/maps/documentation/places/web-service/search-find-place 
# 
#   https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters
#   can request geometry details - includes lat/long

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
    
if __name__ == "__main__":
    print(prettyJSON(findNearbyPlacesByName("dallas", 5000.0)))
