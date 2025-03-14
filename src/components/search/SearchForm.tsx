
import React, { useState } from 'react';
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
import { 
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { LottoType, LottoGame } from '@/types/supabase';

// Define a type for the search logic options
type SearchLogicType = 'both' | 'success' | 'machine' | 'position';

interface SearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: {
    number: number;
    gameTypeId: string | null;
    gameId: string | null;
    searchLogic: SearchLogicType;
    position?: number;
  }) => void;
  isSearching: boolean;
}

export function SearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching 
}: SearchFormProps) {
  const [number, setNumber] = useState('');
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [searchLogic, setSearchLogic] = useState<SearchLogicType>('both');
  const [position, setPosition] = useState<number>(0);

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
    
    onSearch({
      number: numberInt,
      gameTypeId: gameType === 'all' ? null : gameType,
      gameId: specificGame === 'all' ? null : specificGame,
      searchLogic,
      position: searchLogic === 'position' ? position : undefined
    });
  };

  const handleClear = () => {
    setNumber('');
    setGameType('all');
    setSpecificGame('all');
    setSearchLogic('both');
    setPosition(0);
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
      
      {/* Position selector - only visible when 'position' search logic is selected */}
      {searchLogic === 'position' && (
        <div className="space-y-2">
          <Label htmlFor="position">Select Position</Label>
          <RadioGroup 
            id="position" 
            className="flex flex-wrap gap-4"
            value={position.toString()}
            onValueChange={(value) => setPosition(parseInt(value, 10))}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
              <div key={pos} className="flex items-center space-x-2">
                <RadioGroupItem value={pos.toString()} id={`position-${pos}`} />
                <Label htmlFor={`position-${pos}`} className="cursor-pointer">
                  Position {pos + 1}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
