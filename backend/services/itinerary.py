# ai itinerary generation
# install pip install scikit-surprise
from surprise import SVD, Dataset, Reader, KNNBasic
import pandas as pd

# train ai model
def trainModel(user_id, surpriseData, pastData = None):
    combineData = (pastData or []) + surpriseData # combine past and current data
    df = pd.DataFrame(combineData, columns=["user_id", "place_id", "rating"]) # create a pandas dataframe for training
    reader = Reader(rating_scale = (1, 5)) # retrieve the dataset
    data = Dataset.load_from_df(df, reader)

    model = SVD() # logic for training the ai model
    trainset = data.build_full_trainset()
    model.fit(trainset)

    return model


def rankPlaces(model, user_id, apiCall):

    # once model is trained, select top places
    surprisePlaces = apiCall.get("places", []) # getting places from previous api call
    scorePlaces = []

    category = { # create categories so it's easier later
        "hotel": [],
        "breakfast": [],
        "lunch": [],
        "dinner": [],
        "activity": []
    }

    for p in surprisePlaces: # loop through place and ask surprise to predict how much user likes a place 
        
        place_id = p.get("place_id")
        categoryClass = p.get("category")

        prediction = model.predict(str(user_id), place_id)
        p["predictedRating"] = prediction.est # est = estimated rating sent back from surprise
        
        if categoryClass == "hotel": # using stuff from getting surprise ready function in placesAPI, append to categories
            category["hotel"].append(p)
        elif categoryClass == "breakfast":
            category["breakfast"].append(p)
        elif categoryClass == "restaurant":
            category["lunch"].append(p)
            category["dinner"].append(p)
        else:
            category["activity"].append(p)

    for c in category:
        category[c] = sorted(category[c], key=lambda x: x["predictedRating"], reverse=True) # sort high to low

    return category