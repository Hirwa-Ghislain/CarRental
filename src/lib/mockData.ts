
export interface CarOption {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
}

export interface PredictionResult {
  price: number;
  confidence: number;
  range: [number, number];
}

export interface ComparisonData {
  category: string;
  avgPrice: number;
  demand: number;
}

export const carOptions: CarOption[] = [
  {
    id: "eco-1",
    name: "Economy Sedan",
    category: "Economy",
    basePrice: 35,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2787&auto=format&fit=crop"
  },
  {
    id: "eco-2",
    name: "Compact Hatchback",
    category: "Economy",
    basePrice: 38,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "mid-1",
    name: "Mid-size Sedan",
    category: "Mid-range",
    basePrice: 55,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2942&auto=format&fit=crop"
  },
  {
    id: "mid-2",
    name: "Crossover SUV",
    category: "Mid-range",
    basePrice: 65,
    image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=2865&auto=format&fit=crop"
  },
  {
    id: "lux-1",
    name: "Luxury Sedan",
    category: "Luxury",
    basePrice: 95,
    image: "https://images.unsplash.com/photo-1534093607318-f025413f49cb?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "lux-2",
    name: "Premium SUV",
    category: "Luxury",
    basePrice: 110,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2942&auto=format&fit=crop"
  }
];

export const comparisonData: ComparisonData[] = [
  { category: "Economy", avgPrice: 40, demand: 75 },
  { category: "Mid-range", avgPrice: 65, demand: 60 },
  { category: "Luxury", avgPrice: 105, demand: 40 },
  { category: "SUV", avgPrice: 85, demand: 65 },
  { category: "Sports", avgPrice: 120, demand: 30 },
  { category: "Electric", avgPrice: 90, demand: 55 }
];

export function generateMockPrediction(
  carType: string,
  days: number,
  location: string,
  season: string
): PredictionResult {
  // Find the selected car
  const car = carOptions.find(c => c.id === carType) || carOptions[0];
  
  // Base multipliers
  const locationMultiplier = {
    "New York": 1.4,
    "Los Angeles": 1.3,
    "Chicago": 1.1,
    "Miami": 1.5,
    "Dallas": 1.0,
    "San Francisco": 1.35
  }[location] || 1.2;
  
  const seasonMultiplier = {
    "Summer": 1.3,
    "Winter": 0.9,
    "Spring": 1.1,
    "Fall": 1.0
  }[season] || 1.1;
  
  // Calculate base price with some randomness
  const baseCalculation = car.basePrice * days * locationMultiplier * seasonMultiplier;
  const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1 randomness
  
  const predictedPrice = Math.round(baseCalculation * randomFactor);
  const confidence = 0.7 + (Math.random() * 0.25); // 70-95% confidence
  
  // Calculate the range based on confidence
  const rangeSpread = (1 - confidence) * 0.5 * predictedPrice;
  const lowerBound = Math.round(predictedPrice - rangeSpread);
  const upperBound = Math.round(predictedPrice + rangeSpread);
  
  return {
    price: predictedPrice,
    confidence: parseFloat(confidence.toFixed(2)),
    range: [lowerBound, upperBound]
  };
}

export function generateHistoricalPrices(
  basePrice: number, 
  days: number = 60
): {date: string; price: number}[] {
  const today = new Date();
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create some seasonal patterns and small random variations
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const seasonalFactor = 1 + 0.2 * Math.sin(dayOfYear / 365 * 2 * Math.PI);
    const randomFactor = 0.95 + (Math.random() * 0.1); // Small random variations
    
    const price = Math.round(basePrice * seasonalFactor * randomFactor);
    data.push({
      date: date.toISOString().split('T')[0],
      price
    });
  }
  
  return data;
}
