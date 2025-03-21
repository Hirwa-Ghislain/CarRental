
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// API routes
app.post('/api/predict', async (req, res) => {
  try {
    // Forward the prediction request to the Python model API
    const response = await axios.post('http://localhost:5001/predict', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding prediction request:', error);
    res.status(500).json({ 
      error: 'Failed to get prediction from model',
      details: error.message
    });
  }
});

// Car data endpoint
app.get('/api/cars', (req, res) => {
  // For now, we'll return mock data
  // In a production app, this would come from a database
  const cars = [
    {
      id: "economy",
      name: "Economy",
      basePrice: 40,
      image: "/cars/economy.png"
    },
    {
      id: "compact",
      name: "Compact",
      basePrice: 55,
      image: "/cars/compact.png"
    },
    {
      id: "midsize",
      name: "Midsize Sedan",
      basePrice: 70,
      image: "/cars/midsize.png"
    },
    {
      id: "fullsize",
      name: "Fullsize",
      basePrice: 90,
      image: "/cars/fullsize.png"
    },
    {
      id: "suv",
      name: "SUV",
      basePrice: 110,
      image: "/cars/suv.png"
    },
    {
      id: "luxury",
      name: "Luxury",
      basePrice: 170,
      image: "/cars/luxury.png"
    }
  ];
  
  res.json(cars);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
