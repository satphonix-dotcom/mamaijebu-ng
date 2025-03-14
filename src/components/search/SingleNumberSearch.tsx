
import React, { useState, useEffect } from 'react';
import { useSearchResults } from '@/hooks/useSearchResults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchResults } from '@/components/search/SearchResults';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';

// Define a type for the search logic options
type SearchLogicType = 'both' | 'success' | 'machine' | 'position';

export function SingleNumberSearch() {
  const [number, setNumber] = useState('');
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [searchLogic, setSearchLogic] = useState<SearchLogicType>('both');
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesByType, setGamesByType] = useState<{[key: string]: LottoGame[]}>({});
  const { lottoTypes } = useLottoTypes();
  
  const { searchResults, performSearch, isSearching } = useSearchResults();

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

  const handleSearch = () => {
    if (!number.trim()) return;
    
    const numberInt = parseInt(number, 10);
    if (isNaN(numberInt) || numberInt < 1 || numberInt > 99) {
      alert('Please enter a valid number between 1 and 99');
      return;
    }
    
    performSearch({
      number: numberInt,
      gameTypeId: gameType === 'all' ? null : gameType,
      gameId: specificGame === 'all' ? null : specificGame,
      searchLogic
    });
  };

  const handleClear = () => {
    setNumber('');
    setGameType('all');
    setSpecificGame('all');
    setSearchLogic('both');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Number input */}
        <div className="space-y-2">
          <Label htmlFor="number">Number to Search</Label>
          <Input
            id="number"
            type="number"
            min="1"
            max="99"
            placeholder="Enter number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        
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
        
        {/* Search logic selector */}
        <div className="space-y-2">
          <Label htmlFor="searchLogic">Search Logic</Label>
          <Select 
            value={searchLogic} 
            onValueChange={(value: SearchLogicType) => setSearchLogic(value)}>
            <SelectTrigger id="searchLogic">
              <SelectValue placeholder="Select search logic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Success and Machine Numbers</SelectItem>
              <SelectItem value="success">Success Numbers Only</SelectItem>
              <SelectItem value="machine">Machine Numbers Only</SelectItem>
              <SelectItem value="position">Search by Position</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
      
      {/* Results display */}
      <SearchResults results={searchResults} isLoading={isSearching} />
    </div>
  );
}
