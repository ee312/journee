# ai itinerary generation
# install pip install scikit-surprise
from surprise import SVD, Dataset, Reader
import pandas as pd


def trainModel(user_id, surpriseData, pastData = None):
    combineData = (pastData or []) + surpriseData
    df = pd.DataFrame(combineData, columns=["user_id", "place_id", "rating"])

    # import dataset
    reader = Reader(rating_scale = (1, 5))
    dataset = Dataset.load_from_df(df, reader)

    # add logic for training the ai model
    model = SVD()
    trainset = dataset.build_full_trainset()
    model.fit(trainset)

    return model


def rankPlaces(model, user_id, googleFetch, top = 5): # may need to change top somehow to be adjustable.

    # once model is trained, select top places
    surprisePlaces = googleFetch.get("places", []) # getting places from google places api
    scorePlaces = []

    for p in surprisePlaces: # loop through place and ask surprise to predict how much user likes a place 
        place_id = p["displayName"]["text"]
        prediction = model.predict(str(user_id), place_id)
        p["predictedRating"] = prediction.est # est = estimated rating sent back from surprise
        scorePlaces.append(p)

    finalPlaces = sorted(scorePlaces, key=lambda x: x["predictedRating"], reverse=True) # sort high to low

    return finalPlaces[:top]