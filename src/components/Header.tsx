
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/lib/animations';
import { Car } from 'lucide-react';

const Header: React.FC = () => {
  const scrollPosition = useScrollPosition();
  const [isCompact, setIsCompact] = useState(false);
  
  useEffect(() => {
    setIsCompact(scrollPosition > 50);
  }, [scrollPosition]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 px-8 flex items-center justify-between",
        isCompact 
          ? "h-16 glass shadow-subtle" 
          : "h-24 bg-transparent"
      )}
    >
      <div className="flex items-center">
        <Car className="h-6 w-6 text-primary mr-2" />
        <h1 className={cn(
          "font-semibold tracking-tight transition-all duration-500",
          isCompact ? "text-lg" : "text-xl"
        )}>
          RentalCast
        </h1>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-sm font-medium hover:text-primary transition-colors duration-200">Home</a>
        <a href="#prediction" className="text-sm font-medium hover:text-primary transition-colors duration-200">Prediction</a>
        <a href="#comparison" className="text-sm font-medium hover:text-primary transition-colors duration-200">Comparison</a>
        <a href="#about" className="text-sm font-medium hover:text-primary transition-colors duration-200">About</a>
      </nav>

      <div className="flex items-center space-x-4">
        <button className="text-sm font-medium hover:text-primary transition-colors duration-200">
          Sign In
        </button>
        <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
