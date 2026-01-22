from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Laptop Prediction API")

# CORS middleware to allow requests from the frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
spec_model = joblib.load("final_model_spec.pkl")
price_model = joblib.load("final_model_price.pkl")

# Define request body
class Features(BaseModel):
    features: list[float]

@app.post("/predict/spec_score")
def predict_spec_score(data: Features):
    features = np.array(data.features).reshape(1, -1)
    prediction = spec_model.predict(features)
    return {"spec_score": float(prediction[0])}

@app.post("/predict/price")
def predict_price(data: Features):
    features = np.array(data.features).reshape(1, -1)
    prediction = price_model.predict(features)
    return {"price": float(prediction[0])}
