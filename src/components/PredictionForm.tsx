
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarOption } from '@/lib/mockData';
import { getCarOptions } from '@/services/api';
import { CalendarIcon, Car, MapPin, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PredictionFormProps {
  onPredict: (carType: string, days: number, location: string, season: string) => void;
  isLoading?: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, isLoading = false }) => {
  const [selectedCar, setSelectedCar] = useState<string>("economy");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [location, setLocation] = useState<string>("New York");
  const [season, setSeason] = useState<string>("Summer");
  const [selectedCarObject, setSelectedCarObject] = useState<CarOption | null>(null);
  const [carOptions, setCarOptions] = useState<CarOption[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  useEffect(() => {
    // Fetch car options from backend
    const fetchCarOptions = async () => {
      try {
        setIsLoadingCars(true);
        const cars = await getCarOptions();
        setCarOptions(cars);
        if (cars.length > 0) {
          setSelectedCar(cars[0].id);
          setSelectedCarObject(cars[0]);
        }
      } catch (error) {
        console.error('Error fetching car options:', error);
        // Fallback to default car options from mockData if API fails
        import('@/lib/mockData').then(({ carOptions }) => {
          setCarOptions(carOptions);
          setSelectedCar(carOptions[0].id);
          setSelectedCarObject(carOptions[0]);
        });
      } finally {
        setIsLoadingCars(false);
      }
    };

    fetchCarOptions();
  }, []);

  const days = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleCarSelect = (carId: string) => {
    setSelectedCar(carId);
    const car = carOptions.find(c => c.id === carId);
    if (car) {
      setSelectedCarObject(car);
    }
  };

  const handlePredict = () => {
    if (selectedCar && startDate && endDate && location && season) {
      onPredict(selectedCar, days, location, season);
    }
  };

  if (isLoadingCars) {
    return (
      <Card className="w-full max-w-4xl mx-auto glass-card overflow-hidden animate-slide-up">
        <CardContent className="p-6 md:p-8 flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading vehicle options...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto glass-card overflow-hidden animate-slide-up">
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Select Your Vehicle</h3>
            <div className="grid grid-cols-1 gap-4">
              {carOptions.map((car) => (
                <div
                  key={car.id}
                  className={cn(
                    "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                    "border-2 h-24 flex items-center p-3 interactive",
                    selectedCar === car.id
                      ? "border-primary shadow-md"
                      : "border-transparent hover:border-gray-200"
                  )}
                  onClick={() => handleCarSelect(car.id)}
                >
                  <div 
                    className="w-20 h-16 rounded-md bg-cover bg-center mr-4"
                    style={{ backgroundImage: `url(${car.image})` }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="font-medium">{car.name}</span>
                    <span className="text-sm text-muted-foreground">${car.basePrice}/day</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold mb-6">Rental Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start-date">Pick-up Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full" id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Miami">Miami</SelectItem>
                    <SelectItem value="Dallas">Dallas</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger className="w-full" id="season">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              {selectedCarObject && (
                <div className="rounded-xl bg-secondary/50 p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">{selectedCarObject.name}</span>
                    </div>
                    <span className="font-semibold">${selectedCarObject.basePrice}/day</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{days} days</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{season} season</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                className="w-full h-12 text-base font-medium shadow-subtle"
                onClick={handlePredict}
                disabled={!selectedCar || !startDate || !endDate || !location || !season || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Predict Rental Cost"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
