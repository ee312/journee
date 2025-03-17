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
#       https://developers.google.com/maps/documentation/places/web-service/search-nearby
# 
#   https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters 
#   must specify location (lat/long), radius
#   

import json
import requests # type: ignore
import urllib.parse

api_key = "AIzaSyCfS2LH0L2Phby2jXEwwnh57PRjWATdYR0"
base_url = "https://maps.googleapis.com/maps/api/place"

def findNearbyPlacesByCoor(lat, long, radius, kwargs = {}): 
    coor = ','.join([lat.decode(), long.decode()])
    # print(coor)
    # required input
    fields = {'location' : coor, 'radius' : radius, 'inputtype' : 'textquery', 'key' : api_key}

    # optional input
    if kwargs.get('maxprice') != None:
        fields['maxprice'] = kwargs.get('maxprice')
    if kwargs.get('minprice') != None:
        fields['minprice'] = kwargs.get('minprice')
    if kwargs.get('keyword') != None:
        fields['keyword'] = kwargs.get('keyword')
    if kwargs.get('rankby') != None:
        fields['rankby'] = kwargs.get('rankby')
    if kwargs.get('type') != None:
        if kwargs.get('type') != kwargs.get('keyword'):
            fields['type'] = kwargs.get('type')
    if kwargs.get('opennow') != None:
        fields['opennow'] = kwargs.get('opennow')
        
    req_url = "/nearbysearch/json?" + urllib.parse.urlencode(fields) 
    print(base_url + req_url)
    nearby = requests.get(base_url + req_url)
    return nearby

def findNearbyPlacesByName(place, radius, kwargs = {}): 
    geo = _getGeoDetails(place).json()
    print(geo)
    # TODO: test getting lat/long
    [lat, long] = geo['candidates'][0]['geometry']['location']['lat'], geo['candidates'][0]['geometry']['location']['lng']
    return findNearbyPlacesByCoor(lat, long, radius, kwargs)

def _getGeoDetails(place):
    fields = {'fields' : 'geometry', 'input' : place, 'inputtype' : 'textquery', 'key' : api_key}
    req_url = "/findplacefromtext/json?" + urllib.parse.urlencode(fields)
    # print(base_url + req_url)
    geo = requests.get(base_url + req_url)
    return geo

def prettyJSON(response):
    return json.dumps(response.json(), indent=4)
    
if __name__ == "__main__":
    # print(prettyJSON(_getGeoDetails("paris")))
    print(prettyJSON(findNearbyPlacesByName("paris", 50)))
