
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { useGames } from '@/hooks/useGames';
import { GitCompare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CompareChartsTabContent() {
  const { lottoTypes, loading: typesLoading } = useLottoTypes();
  const { games, loading: gamesLoading } = useGames();

  // First chart state
  const [firstEvent, setFirstEvent] = useState('');
  const [firstGameType, setFirstGameType] = useState('');
  const [firstGameId, setFirstGameId] = useState('');

  // Second chart state
  const [secondEvent, setSecondEvent] = useState('');
  const [secondGameType, setSecondGameType] = useState('');
  const [secondGameId, setSecondGameId] = useState('');

  // Results state
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Filter games by selected game type
  const firstFilteredGames = firstGameType
    ? games.filter(game => game.lotto_type_id === firstGameType)
    : [];

  const secondFilteredGames = secondGameType
    ? games.filter(game => game.lotto_type_id === secondGameType)
    : [];

  const handleCompare = () => {
    setComparing(true);
    
    // Simulate comparison results - in a real app, this would fetch from the backend
    setTimeout(() => {
      // Mocked comparison results
      const mockResults = [
        { event1: firstEvent, event2: secondEvent, matchingNumbers: [5, 12, 23] },
        { event1: (parseInt(firstEvent) + 1).toString(), event2: (parseInt(secondEvent) + 1).toString(), matchingNumbers: [7, 19] },
        { event1: (parseInt(firstEvent) + 2).toString(), event2: (parseInt(secondEvent) + 2).toString(), matchingNumbers: [14, 31, 42] },
      ];
      
      setResults(mockResults);
      setComparing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* First Chart Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">First Chart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Starting Event Number</label>
              <Input
                type="text"
                value={firstEvent}
                onChange={(e) => setFirstEvent(e.target.value)}
                placeholder="Enter event number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Game Franchise</label>
              <Select 
                value={firstGameType} 
                onValueChange={(value) => {
                  setFirstGameType(value);
                  setFirstGameId(''); // Reset game selection when type changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game franchise" />
                </SelectTrigger>
                <SelectContent>
                  {lottoTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Specific Game</label>
              <Select 
                value={firstGameId} 
                onValueChange={setFirstGameId}
                disabled={!firstGameType || firstFilteredGames.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={firstGameType ? "Select specific game" : "Select franchise first"} />
                </SelectTrigger>
                <SelectContent>
                  {firstFilteredGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Second Chart Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Second Chart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Starting Event Number</label>
              <Input
                type="text"
                value={secondEvent}
                onChange={(e) => setSecondEvent(e.target.value)}
                placeholder="Enter event number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Game Franchise</label>
              <Select 
                value={secondGameType} 
                onValueChange={(value) => {
                  setSecondGameType(value);
                  setSecondGameId(''); // Reset game selection when type changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game franchise" />
                </SelectTrigger>
                <SelectContent>
                  {lottoTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Specific Game</label>
              <Select 
                value={secondGameId} 
                onValueChange={setSecondGameId}
                disabled={!secondGameType || secondFilteredGames.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={secondGameType ? "Select specific game" : "Select franchise first"} />
                </SelectTrigger>
                <SelectContent>
                  {secondFilteredGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleCompare} 
          disabled={comparing || !firstEvent || !firstGameId || !secondEvent || !secondGameId}
          className="px-8"
        >
          <GitCompare className="mr-2 h-4 w-4" /> Compare Charts
        </Button>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">First Chart Event</th>
                    <th className="border p-2 text-left">Second Chart Event</th>
                    <th className="border p-2 text-left">Matching Numbers</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="border p-2">{row.event1}</td>
                      <td className="border p-2">{row.event2}</td>
                      <td className="border p-2">
                        {row.matchingNumbers.map((num: number) => (
                          <span key={num} className="inline-block bg-primary/10 text-primary rounded-full px-2 py-1 text-xs mr-1 mb-1">
                            {num}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
