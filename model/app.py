
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In a real application, we would load a trained model here
# For now, we'll use a simple prediction function
def predict_rental_price(car_type, days, location, season):
    # Base prices for different car types
    base_prices = {
        "economy": 40,
        "compact": 55,
        "midsize": 70,
        "fullsize": 90,
        "suv": 110,
        "luxury": 170
    }
    
    # Location multipliers
    location_multipliers = {
        "New York": 1.3,
        "Los Angeles": 1.2,
        "Chicago": 1.1,
        "Miami": 1.4,
        "Dallas": 1.0,
        "San Francisco": 1.5
    }
    
    # Season multipliers
    season_multipliers = {
        "Summer": 1.3,
        "Winter": 0.9,
        "Spring": 1.1,
        "Fall": 1.0
    }
    
    # Calculate the base price
    base_price = base_prices.get(car_type, 50)
    
    # Apply multipliers
    location_multiplier = location_multipliers.get(location, 1.0)
    season_multiplier = season_multipliers.get(season, 1.0)
    
    # Calculate rental days factor (longer rentals get discounts)
    days_factor = 1.0
    if days > 7:
        days_factor = 0.9
    elif days > 14:
        days_factor = 0.85
    elif days > 30:
        days_factor = 0.8
    
    # Calculate final price
    price = base_price * days * location_multiplier * season_multiplier * days_factor
    
    # Add some randomness to mimic a machine learning model
    price = price * np.random.uniform(0.95, 1.05)
    
    # Round to nearest dollar
    price = round(price)
    
    # Calculate price range
    lower_bound = round(price * 0.9)
    upper_bound = round(price * 1.1)
    
    # Calculate confidence
    confidence = np.random.uniform(0.85, 0.98)
    
    return {
        "price": price,
        "range": [lower_bound, upper_bound],
        "confidence": confidence
    }

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract prediction parameters
        car_type = data.get('carType', 'economy')
        days = data.get('days', 1)
        location = data.get('location', 'New York')
        season = data.get('season', 'Summer')
        
        # Generate prediction
        prediction = predict_rental_price(car_type, days, location, season)
        
        # Add timestamp
        prediction['timestamp'] = datetime.now().isoformat()
        
        return jsonify(prediction)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
