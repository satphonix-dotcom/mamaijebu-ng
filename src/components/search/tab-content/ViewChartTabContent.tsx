
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChartBar } from 'lucide-react';
import { GameSelectors } from '@/components/search/GameSelectors';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { useGames } from '@/hooks/useGames';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

export function ViewChartTabContent() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { lottoTypes, isLoading: isLoadingTypes } = useLottoTypes();
  const { games } = useGames();
  
  const availableYears = Array.from(
    { length: 10 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );
  
  const filteredGames = gameTypeId 
    ? games.filter(game => game.lotto_type_id === gameTypeId)
    : [];
  
  const handleGenerateChart = async () => {
    // In a real app, we would fetch data from the database here
    // For now, we'll generate some sample data
    const sampleData = Array.from({ length: 12 }, (_, i) => ({
      month: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ][i],
      draws: Math.floor(Math.random() * 30) + 5,
    }));
    
    setChartData(sampleData);
    setShowChart(true);
  };
  
  const chartConfig = {
    draws: { color: '#3498db', label: 'Number of Draws' },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>View Chart</CardTitle>
        <CardDescription>
          View statistical charts of lottery games by year. Select a year, game franchise, and optionally a specific game.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Year selector */}
          <div className="space-y-2">
            <Label htmlFor="year">Enter the year you want to view its chart</Label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          {/* Game type and specific game selectors */}
          <GameSelectors
            lottoTypes={lottoTypes || []}
            availableGames={filteredGames}
            gameTypeId={gameTypeId}
            gameId={gameId}
            onGameTypeChange={(value) => {
              setGameTypeId(value);
              setGameId(null);
            }}
            onGameIdChange={(value) => setGameId(value)}
          />
          
          <Button 
            onClick={handleGenerateChart} 
            className="mt-4 w-full md:w-auto"
            disabled={isLoadingTypes}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            Generate Chart
          </Button>
        </div>
        
        {showChart && chartData.length > 0 && (
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">
              {`${year} Chart: ${gameId 
                ? games.find(g => g.id === gameId)?.name 
                : gameTypeId
                  ? lottoTypes?.find(t => t.id === gameTypeId)?.name + ' Games'
                  : 'All Games'
              }`}
            </h3>
            
            <div className="h-80 w-full">
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="draws" name="draws" fill="var(--color-draws, #3498db)" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
