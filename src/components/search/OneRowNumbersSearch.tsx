
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';

// Define types for search logic
type SearchLogicType = 'both' | 'success' | 'machine' | 'position';
type MatchLogicType = 'any' | 'one' | 'two' | 'three' | 'four' | 'five';

export function OneRowNumbersSearch() {
  const [successNumbers, setSuccessNumbers] = useState<string[]>(Array(5).fill(''));
  const [machineNumbers, setMachineNumbers] = useState<string[]>(Array(5).fill(''));
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [searchLogic, setSearchLogic] = useState<SearchLogicType>('both');
  const [matchLogic, setMatchLogic] = useState<MatchLogicType>('any');
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [gamesByType, setGamesByType] = useState<{[key: string]: LottoGame[]}>({});
  const [results, setResults] = useState<any[]>([]);
  const { lottoTypes } = useLottoTypes();
  
  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('lotto_games')
          .select(`
            *,
            countries (id, name),
            lotto_type:lotto_type_id (id, name)
          `)
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        const gamesData = data || [];
        setGames(gamesData);
        
        // Group games by lotto type
        const groupedGames: {[key: string]: LottoGame[]} = {};
        gamesData.forEach(game => {
          if (game.lotto_type?.id) {
            if (!groupedGames[game.lotto_type.id]) {
              groupedGames[game.lotto_type.id] = [];
            }
            groupedGames[game.lotto_type.id].push(game);
          }
        });
        
        setGamesByType(groupedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  // Filter games based on selected type
  const filteredGames = gameType === 'all' 
    ? games 
    : gamesByType[gameType] || [];

  const handleSuccessNumberChange = (index: number, value: string) => {
    const newNumbers = [...successNumbers];
    newNumbers[index] = value;
    setSuccessNumbers(newNumbers);
  };

  const handleMachineNumberChange = (index: number, value: string) => {
    const newNumbers = [...machineNumbers];
    newNumbers[index] = value;
    setMachineNumbers(newNumbers);
  };

  const handleSearch = async () => {
    // Validate at least one number is entered
    if ([...successNumbers, ...machineNumbers].every(n => !n)) {
      alert('Please enter at least one number');
      return;
    }

    // Validate numbers are within range 1-99
    const allNumbers = [...successNumbers, ...machineNumbers].filter(Boolean);
    const invalidNumbers = allNumbers.some(n => {
      const num = parseInt(n, 10);
      return isNaN(num) || num < 1 || num > 99;
    });

    if (invalidNumbers) {
      alert('All numbers must be between 1 and 99');
      return;
    }

    setSearching(true);
    
    try {
      // In a real implementation, we would fetch one row search results from the backend
      // For now, we'll just simulate a search delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder for one row search logic
      setResults([]);
      
    } catch (error) {
      console.error('Error performing one row search:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSuccessNumbers(Array(5).fill(''));
    setMachineNumbers(Array(5).fill(''));
    setGameType('all');
    setSpecificGame('all');
    setSearchLogic('both');
    setMatchLogic('any');
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Number input boxes */}
        <div className="space-y-2">
          <Label>Success and Machine Numbers</Label>
          <div className="grid grid-cols-5 gap-2">
            {successNumbers.map((num, index) => (
              <Input
                key={`success-${index}`}
                type="number"
                min="1"
                max="99"
                placeholder={`S${index + 1}`}
                value={num}
                onChange={(e) => handleSuccessNumberChange(index, e.target.value)}
                className="bg-blue-50 border-blue-200"
              />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {machineNumbers.map((num, index) => (
              <Input
                key={`machine-${index}`}
                type="number"
                min="1"
                max="99"
                placeholder={`M${index + 1}`}
                value={num}
                onChange={(e) => handleMachineNumberChange(index, e.target.value)}
                className="bg-red-50 border-red-200"
              />
            ))}
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Game franchise/operator selector */}
          <div className="space-y-2">
            <Label htmlFor="gameType">Game Franchise</Label>
            <Select value={gameType} onValueChange={(value) => {
              setGameType(value);
              setSpecificGame('all');
            }}>
              <SelectTrigger id="gameType">
                <SelectValue placeholder="Select game franchise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                {lottoTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Specific game selector */}
          <div className="space-y-2">
            <Label htmlFor="specificGame">Narrow Down to Game</Label>
            <Select value={specificGame} onValueChange={setSpecificGame} disabled={filteredGames.length === 0}>
              <SelectTrigger id="specificGame">
                <SelectValue placeholder="Select specific game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games in Franchise</SelectItem>
                {filteredGames.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* First logical part - Search logic */}
          <div className="space-y-2">
            <Label htmlFor="searchLogic">Search Logic</Label>
            <Select 
              value={searchLogic} 
              onValueChange={(value: SearchLogicType) => setSearchLogic(value)}>
              <SelectTrigger id="searchLogic">
                <SelectValue placeholder="Select search logic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Search in Both Success and Machine</SelectItem>
                <SelectItem value="success">Search in Success Numbers Only</SelectItem>
                <SelectItem value="machine">Search in Machine Numbers Only</SelectItem>
                <SelectItem value="position">Search by Position</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Second logical part - Match logic */}
          <div className="space-y-2">
            <Label htmlFor="matchLogic">Match Count Logic</Label>
            <Select 
              value={matchLogic} 
              onValueChange={(value: MatchLogicType) => setMatchLogic(value)}>
              <SelectTrigger id="matchLogic">
                <SelectValue placeholder="Select match logic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Match Any Number</SelectItem>
                <SelectItem value="one">Match At Least One Number</SelectItem>
                <SelectItem value="two">Match At Least Two Numbers</SelectItem>
                <SelectItem value="three">Match At Least Three Numbers</SelectItem>
                <SelectItem value="four">Match At Least Four Numbers</SelectItem>
                <SelectItem value="five">Match All Five Numbers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
      
      {/* Results display */}
      {results.length === 0 && !searching ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Enter numbers and search parameters to find one row matches.
          </p>
        </Card>
      ) : results.length === 0 && searching ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <p className="p-4">Results placeholder: One row search results will appear here</p>
        </Card>
      )}
    </div>
  );
}
