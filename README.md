# Car Rental Price Prediction Application

A full-stack application that predicts car rental prices based on various factors like car type, location, season, and rental duration.

## Project Overview

This application combines:
- React frontend with Tailwind CSS and shadcn UI components
- Node.js/Express backend API server
- Python Flask machine learning prediction service

The app provides users with accurate rental cost forecasts using a prediction model that takes into account historical pricing data and various market factors.

## Features

- Interactive prediction form with real-time validation
- Detailed results display with confidence levels and price ranges
- Car comparison tool to explore different rental options
- Responsive design that works on all devices

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for data fetching
- Recharts for data visualization

### Backend
- Node.js/Express server
- RESTful API architecture

### ML Model
- Python Flask API
- scikit-learn for prediction algorithm

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Python 3.8+ with pip

### Installation & Running the Application

1. **Clone the repository**
git clone <repo>

2. **Install frontend dependencies**
npm install


3. **Start the frontend development server**
npm run dev

The React app will be available at http://localhost:8080

4. **Install and start the Node.js backend**
cd server npm install npm run dev

The API server will run on http://localhost:5000

5. **Install and start the Python prediction model**
cd model pip install -r requirements.txt python app.py

The ML service will run on http://localhost:5001

## Project Structure

- `/src` - Frontend React application
- `/server` - Node.js backend API
- `/model` - Python prediction model

## Environment Variables

Create a `.env` file in the project root with:
VITE_API_URL=http://localhost:5000/api


## Deployment

The application is configured for easy deployment:
- Frontend can be built with `npm run build`
- Backend can be deployed to any Node.js hosting service
- ML model can be deployed as a separate microservice

