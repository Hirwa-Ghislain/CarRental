
import React, { useState } from 'react';
import Header from '@/components/Header';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import CarComparison from '@/components/CarComparison';
import Footer from '@/components/Footer';
import { getPrediction, PredictionResult } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionParams, setPredictionParams] = useState({
    carType: '',
    days: 0,
    location: '',
    season: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async (carType: string, days: number, location: string, season: string) => {
    setIsLoading(true);
    
    try {
      // Save prediction parameters
      setPredictionParams({
        carType,
        days,
        location,
        season
      });
      
      // Make API call to backend
      const result = await getPrediction({
        carType,
        days,
        location,
        season
      });
      
      // Set prediction result
      setPredictionResult(result);
      
      // Scroll to results section
      document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });
      
      toast({
        title: "Prediction Complete",
        description: `Your rental cost prediction for ${days} days is $${result.price}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: "There was an error getting your prediction. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="gradient-bg"></div>
      
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <section className="py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Predict Your Car Rental Costs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Leverage our AI-powered prediction engine to forecast your car rental expenses
              with confidence based on historical pricing data.
            </p>
          </div>
          
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
        </section>
        
        <section id="prediction" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Your Prediction Results</h2>
          
          {predictionResult ? (
            <ResultsDisplay 
              predictionResult={predictionResult} 
              carType={predictionParams.carType}
              days={predictionParams.days}
              location={predictionParams.location}
              season={predictionParams.season}
            />
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>Fill out the form above to get your personalized rental cost prediction.</p>
            </div>
          )}
        </section>
        
        <section id="comparison" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Rental Options</h2>
          <CarComparison />
        </section>
        
        <section id="about" className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About RentalCast</h2>
            <p className="text-lg text-muted-foreground mb-8">
              RentalCast is an advanced car rental price prediction platform that uses
              machine learning to help customers plan their budget for car rentals.
              Our AI-powered algorithms analyze historical pricing data, seasonal trends,
              location-specific patterns, and vehicle type to provide accurate forecasts.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
