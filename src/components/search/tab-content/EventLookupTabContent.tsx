
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { GameSelectors } from '@/components/search/GameSelectors';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { useGames } from '@/hooks/useGames';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DrawResult {
  id: string;
  draw_number: string;
  draw_date: string;
  numbers: number[];
  game_name: string;
}

export function EventLookupTabContent() {
  const [eventNumbers, setEventNumbers] = useState<string[]>(Array(10).fill(''));
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [lookupType, setLookupType] = useState<'consecutive' | 'non-consecutive'>('non-consecutive');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DrawResult[]>([]);
  
  const { lottoTypes, loading } = useLottoTypes();
  const { games } = useGames();
  
  const handleInputChange = (index: number, value: string) => {
    const newEventNumbers = [...eventNumbers];
    newEventNumbers[index] = value;
    setEventNumbers(newEventNumbers);
  };
  
  const filteredGames = gameTypeId 
    ? games.filter(game => game.lotto_type_id === gameTypeId)
    : [];
  
  const handleLookup = async () => {
    setSearching(true);
    try {
      // In a real app, we would fetch data from the database here
      // For now, we'll generate some sample data
      setTimeout(() => {
        const validEventNumbers = lookupType === 'consecutive' 
          ? [eventNumbers[0]] 
          : eventNumbers.filter(number => number.trim() !== '');
          
        if (validEventNumbers.length === 0) {
          setSearchResults([]);
          return;
        }
        
        const sampleResults: DrawResult[] = validEventNumbers.map((eventNum, index) => {
          // For consecutive lookups, create sequential draw numbers
          const drawNumber = lookupType === 'consecutive' 
            ? String(parseInt(eventNum) + index)
            : eventNum;
            
          return {
            id: `draw-${index}`,
            draw_number: drawNumber,
            draw_date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
            numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
            game_name: gameId 
              ? games.find(g => g.id === gameId)?.name || 'Unknown Game'
              : gameTypeId
                ? lottoTypes?.find(t => t.id === gameTypeId)?.name + ' Game' || 'Unknown Type'
                : 'All Games',
          };
        });
        
        setSearchResults(sampleResults);
        setSearching(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching draw data:', error);
      setSearching(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Look-up</CardTitle>
        <CardDescription>
          Look up specific lottery draws by event numbers. Enter event numbers, select a game franchise, and optionally narrow down to a specific game.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Event number inputs */}
          <div className="space-y-2">
            <Label htmlFor="events">Enter event numbers to look up</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {eventNumbers.map((value, index) => (
                <Input
                  key={index}
                  id={`event-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Event ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>
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
          
          {/* Lookup type selector */}
          <div className="space-y-2">
            <Label htmlFor="lookupType">Lookup Type</Label>
            <Select
              value={lookupType}
              onValueChange={(value: 'consecutive' | 'non-consecutive') => setLookupType(value)}
            >
              <SelectTrigger id="lookupType">
                <SelectValue placeholder="Select lookup type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consecutive">Consecutive Events</SelectItem>
                <SelectItem value="non-consecutive">Non-consecutive Events</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {lookupType === 'consecutive' 
                ? 'Only the first event number will be considered, and 10 consecutive events will be shown starting from that number.' 
                : 'Only the event numbers you entered will be looked up.'}
            </p>
          </div>
          
          <Button 
            onClick={handleLookup} 
            className="mt-4 w-full md:w-auto"
            disabled={loading || searching}
          >
            <Search className="mr-2 h-4 w-4" />
            Look Up Events
          </Button>
        </div>
        
        {/* Search results */}
        {searching ? (
          <div className="py-8 text-center">
            <p>Searching for events...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Event Look-up Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Game</th>
                    <th className="px-4 py-2 text-left">Numbers</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result) => (
                    <tr key={result.id} className="border-b">
                      <td className="px-4 py-2">{result.draw_number}</td>
                      <td className="px-4 py-2">{result.draw_date}</td>
                      <td className="px-4 py-2">{result.game_name}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {result.numbers.map((num, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : eventNumbers.some(event => event.trim() !== '') && !searching ? (
          <div className="py-8 text-center">
            <p>No results found for the specified event numbers.</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
