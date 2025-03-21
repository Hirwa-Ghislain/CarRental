
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import CarComparison from '@/components/CarComparison';
import { carOptions, generateMockPrediction, PredictionResult } from '@/lib/mockData';
import { useAnimateIn } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Car, TrendingUp, BarChart, Shield } from 'lucide-react';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [carType, setCarType] = useState<string>('');
  const [days, setDays] = useState<number>(0);
  const [location, setLocation] = useState<string>('');
  const [season, setSeason] = useState<string>('');

  const { ref: heroRef, isVisible: heroVisible } = useAnimateIn({ threshold: 0.1 });
  const { ref: formRef, isVisible: formVisible } = useAnimateIn({ threshold: 0.1 });
  const { ref: featuresRef, isVisible: featuresVisible } = useAnimateIn({ threshold: 0.1 });
  const { ref: comparisonRef, isVisible: comparisonVisible } = useAnimateIn({ threshold: 0.1 });

  const handlePredict = (
    selectedCar: string, 
    rentalDays: number, 
    selectedLocation: string, 
    selectedSeason: string
  ) => {
    // Save the parameters
    setCarType(selectedCar);
    setDays(rentalDays);
    setLocation(selectedLocation);
    setSeason(selectedSeason);
    
    // Simulate API call with a slight delay
    setTimeout(() => {
      const result = generateMockPrediction(selectedCar, rentalDays, selectedLocation, selectedSeason);
      setPredictionResult(result);
      
      // Scroll to results
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="pt-28 pb-20 px-6 md:px-8 bg-gradient-to-b from-transparent to-muted/30"
        ref={heroRef as React.RefObject<HTMLElement>}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto text-center transition-all duration-700 transform",
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="inline-block mb-4">
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              AI-Powered Car Rental Predictions
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Forecast Your <span className="text-primary">Car Rental Costs</span> with Precision
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Get accurate price predictions based on historical data, location, season, and vehicle type to plan your budget with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="h-12 px-8 text-base font-medium shadow-subtle"
              onClick={() => {
                const predictionElement = document.getElementById('prediction');
                if (predictionElement) {
                  predictionElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Make a Prediction
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-12 px-8 text-base font-medium"
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-border transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Price Trends</h3>
              <p className="text-center text-muted-foreground">
                See historical price trends and future projections for better planning.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-border transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven</h3>
              <p className="text-center text-muted-foreground">
                Advanced algorithms analyze thousands of rental records for accurate predictions.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-border transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Confidence Levels</h3>
              <p className="text-center text-muted-foreground">
                Each prediction includes a confidence score so you know what to expect.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Prediction Form Section */}
      <section 
        id="prediction" 
        className="py-20 px-6 md:px-8 bg-white dark:bg-gray-900"
        ref={formRef as React.RefObject<HTMLElement>}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto transition-all duration-700 transform",
            formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Predict Your Rental Costs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enter your rental details below to get an accurate price forecast
            </p>
          </div>
          
          <PredictionForm onPredict={handlePredict} />
        </div>
      </section>
      
      {/* Results Section */}
      {predictionResult && (
        <section id="results" className="py-20 px-6 md:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Your Rental Cost Prediction
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Based on your selections, here's our forecast for your rental
              </p>
            </div>
            
            <ResultsDisplay 
              predictionResult={predictionResult}
              carType={carType}
              days={days}
              location={location}
              season={season}
            />
          </div>
        </section>
      )}
      
      {/* Features Section */}
      <section 
        id="features" 
        className="py-20 px-6 md:px-8 bg-white dark:bg-gray-900"
        ref={featuresRef as React.RefObject<HTMLElement>}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto transition-all duration-700 transform",
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why Choose RentalCast
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our prediction model is built on advanced machine learning algorithms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="rounded-2xl overflow-hidden border border-border">
              <div 
                className="h-72 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2944&auto=format&fit=crop')" }}
              ></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Data-Driven Accuracy</h3>
                <p className="text-muted-foreground mb-6">
                  Our prediction engine analyzes thousands of data points including seasonal trends, regional demand, and vehicle availability to provide highly accurate price forecasts.
                </p>
                <Button variant="ghost" className="flex items-center">
                  Learn more
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-border">
              <div 
                className="h-72 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop')" }}
              ></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Advanced AI Technology</h3>
                <p className="text-muted-foreground mb-6">
                  Our machine learning models continuously improve as they process more data, ensuring that predictions become more accurate over time and adapt to changing market conditions.
                </p>
                <Button variant="ghost" className="flex items-center">
                  Explore our technology
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-xl border border-border bg-white/50 dark:bg-black/20 transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">95% Accuracy</h3>
              <p className="text-muted-foreground">
                Our predictions have been tested to be accurate within 5% of actual rental prices.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border bg-white/50 dark:bg-black/20 transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Our system constantly updates with new data to ensure the most current predictions.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-border bg-white/50 dark:bg-black/20 transition-all duration-300 hover:shadow-subtle hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Coverage</h3>
              <p className="text-muted-foreground">
                Access predictions for rental locations across major cities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section 
        id="comparison" 
        className="py-20 px-6 md:px-8 bg-muted/30"
        ref={comparisonRef as React.RefObject<HTMLElement>}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto transition-all duration-700 transform",
            comparisonVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Market Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore pricing trends and comparative data across vehicle categories
            </p>
          </div>
          
          <CarComparison />
          
          <div className="mt-16 text-center">
            <Button 
              size="lg"
              className="h-12 px-8 text-base font-medium shadow-subtle"
              onClick={() => {
                const predictionElement = document.getElementById('prediction');
                if (predictionElement) {
                  predictionElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Make Your Prediction Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 md:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to forecast your rental costs?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Start using our prediction tool today and never overpay for car rentals again.
          </p>
          
          <div className="glass-card p-10 shadow-strong">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-4">Sign up for free</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account to save your predictions, receive price alerts, and get personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="h-12 px-6 text-base font-medium shadow-subtle"
                  >
                    Create Account
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-12 px-6 text-base font-medium"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Car className="h-48 w-48 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
