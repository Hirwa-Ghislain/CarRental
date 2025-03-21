
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, TooltipProps
} from 'recharts';
import { carOptions, PredictionResult, generateHistoricalPrices } from '@/lib/mockData';
import { DollarSign, TrendingUp, Zap, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  predictionResult: PredictionResult | null;
  carType: string;
  days: number;
  location: string;
  season: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  predictionResult, carType, days, location, season 
}) => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (predictionResult) {
      const selectedCar = carOptions.find(c => c.id === carType);
      if (selectedCar) {
        setHistoricalData(generateHistoricalPrices(selectedCar.basePrice));
      }
      
      // Animate in
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [predictionResult, carType]);

  if (!predictionResult) return null;

  // Format the confidence percentage
  const confidencePercent = Math.round(predictionResult.confidence * 100);
  
  // Create projected price data
  const projectedData = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    let projectedPrice;
    if (i < 7) {
      // Gradually transition from current price to predicted
      const factor = i / 7;
      projectedPrice = Math.round(historicalData[historicalData.length - 1]?.price * (1 - factor) + predictionResult.price * factor);
    } else {
      // Random fluctuation around prediction
      const fluctuation = 0.95 + (Math.random() * 0.1);
      projectedPrice = Math.round(predictionResult.price * fluctuation);
    }
    
    projectedData.push({
      date: date.toISOString().split('T')[0],
      price: projectedPrice,
    });
  }

  // Create combined data for the chart
  const combinedData = [
    ...historicalData.slice(-30), // Last 30 days of historical data
    ...projectedData
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const isProjected = new Date(label) > new Date();
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm font-semibold text-primary">
            ${payload[0].value}
          </p>
          {isProjected && (
            <p className="text-xs text-muted-foreground mt-1">
              Projected Price
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "transition-all duration-500 transform",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predicted Cost</p>
                <h3 className="text-3xl font-bold">${predictionResult.price}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                For {days} days at ${Math.round(predictionResult.price / days)}/day
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price Range</p>
                <h3 className="text-xl font-bold">${predictionResult.range[0]} - ${predictionResult.range[1]}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Range based on market fluctuations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                <h3 className="text-3xl font-bold">{confidencePercent}%</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Based on {location} in {season}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card shadow-subtle mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Price Trend</h3>
          <p className="text-sm text-muted-foreground mb-6">Historical prices and 30-day projection</p>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={combinedData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span className="text-muted-foreground">Historical Prices</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary/40 mr-2"></div>
              <span className="text-muted-foreground">Projected Prices</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Last updated: Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-subtle">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Rental Cost Breakdown</h3>
          <p className="text-sm text-muted-foreground mb-6">Estimated cost distribution for your rental</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Base Rate', value: Math.round(predictionResult.price * 0.7) },
                  { name: 'Insurance', value: Math.round(predictionResult.price * 0.15) },
                  { name: 'Taxes', value: Math.round(predictionResult.price * 0.1) },
                  { name: 'Fees', value: Math.round(predictionResult.price * 0.05) },
                ]}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-xl font-semibold">${predictionResult.price}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-xl font-semibold">${Math.round(predictionResult.price / days)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
