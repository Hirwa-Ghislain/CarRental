
import axios from 'axios';

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types
export interface PredictionParams {
  carType: string;
  days: number;
  location: string;
  season: string;
}

export interface PredictionResult {
  price: number;
  range: [number, number];
  confidence: number;
  timestamp: string;
}

// API functions
export const getPrediction = async (params: PredictionParams): Promise<PredictionResult> => {
  try {
    const response = await api.post<PredictionResult>('/predict', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const getCarOptions = async () => {
  try {
    const response = await api.get('/cars');
    return response.data;
  } catch (error) {
    console.error('Error fetching car options:', error);
    throw error;
  }
};

export default api;
