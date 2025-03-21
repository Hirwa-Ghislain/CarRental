
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { comparisonData, carOptions } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { useAnimateIn } from '@/lib/animations';
import { cn } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CarComparison: React.FC = () => {
  const { ref: cardRef1, isVisible: isVisible1 } = useAnimateIn({ threshold: 0.1 });
  const { ref: cardRef2, isVisible: isVisible2 } = useAnimateIn({ threshold: 0.1, delay: 100 });
  const { ref: cardRef3, isVisible: isVisible3 } = useAnimateIn({ threshold: 0.1, delay: 200 });
  const { ref: cardRef4, isVisible: isVisible4 } = useAnimateIn({ threshold: 0.1, delay: 300 });
  
  // Create seasonal data for comparing prices
  const seasonalData = [
    { season: 'Winter', economy: 35, midRange: 55, luxury: 85, suv: 70 },
    { season: 'Spring', economy: 40, midRange: 60, luxury: 95, suv: 80 },
    { season: 'Summer', economy: 50, midRange: 75, luxury: 130, suv: 110 },
    { season: 'Fall', economy: 38, midRange: 62, luxury: 90, suv: 75 }
  ];
  
  // Data for pie chart
  const pieData = [
    { name: 'Economy', value: 40 },
    { name: 'Mid-range', value: 25 },
    { name: 'Luxury', value: 15 },
    { name: 'SUV', value: 20 }
  ];
  
  // Data for radar chart
  const radarData = [
    { category: 'Affordability', Economy: 90, 'Mid-range': 70, Luxury: 30, SUV: 50 },
    { category: 'Comfort', Economy: 40, 'Mid-range': 60, Luxury: 95, SUV: 75 },
    { category: 'Fuel Efficiency', Economy: 85, 'Mid-range': 65, Luxury: 40, SUV: 30 },
    { category: 'Performance', Economy: 35, 'Mid-range': 60, Luxury: 90, SUV: 70 },
    { category: 'Space', Economy: 30, 'Mid-range': 55, Luxury: 70, SUV: 95 },
  ];
  
  // Custom tooltip for price comparison
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card 
        className={cn(
          "glass-card shadow-subtle transition-all duration-500 transform",
          isVisible1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        ref={cardRef1 as React.RefObject<HTMLDivElement>}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Price Comparison</h3>
              <p className="text-sm text-muted-foreground">Average rental prices by category</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Daily Rates
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                <Bar 
                  name="Average Price" 
                  dataKey="avgPrice" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "glass-card shadow-subtle transition-all duration-500 transform",
          isVisible2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        ref={cardRef2 as React.RefObject<HTMLDivElement>}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Seasonal Price Trends</h3>
              <p className="text-sm text-muted-foreground">How prices vary throughout the year</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Seasonal
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={seasonalData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="season" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="economy" 
                  name="Economy" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="midRange" 
                  name="Mid-range" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="luxury" 
                  name="Luxury" 
                  stroke="#FFBB28" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="suv" 
                  name="SUV" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "glass-card shadow-subtle transition-all duration-500 transform",
          isVisible3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        ref={cardRef3 as React.RefObject<HTMLDivElement>}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Market Share</h3>
              <p className="text-sm text-muted-foreground">Rental category distribution</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Distribution
            </Badge>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "glass-card shadow-subtle transition-all duration-500 transform",
          isVisible4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        ref={cardRef4 as React.RefObject<HTMLDivElement>}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Vehicle Attributes</h3>
              <p className="text-sm text-muted-foreground">Comparing key features by category</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Features
            </Badge>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={100} data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar 
                  name="Economy" 
                  dataKey="Economy" 
                  stroke="#0088FE" 
                  fill="#0088FE" 
                  fillOpacity={0.2} 
                />
                <Radar 
                  name="Mid-range" 
                  dataKey="Mid-range" 
                  stroke="#00C49F" 
                  fill="#00C49F" 
                  fillOpacity={0.2} 
                />
                <Radar 
                  name="Luxury" 
                  dataKey="Luxury" 
                  stroke="#FFBB28" 
                  fill="#FFBB28" 
                  fillOpacity={0.2} 
                />
                <Radar 
                  name="SUV" 
                  dataKey="SUV" 
                  stroke="#FF8042" 
                  fill="#FF8042" 
                  fillOpacity={0.2} 
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarComparison;
