
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
import { LottoType, LottoGame } from '@/types/supabase';

interface PatternSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: {
    successNumbers: string[];
    machineNumbers: string[];
    gameTypeId: string | null;
    gameId: string | null;
    year: string;
  }) => void;
  isSearching: boolean;
}

export function PatternSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching 
}: PatternSearchFormProps) {
  const [successNumbers, setSuccessNumbers] = useState<string[]>(Array(5).fill(''));
  const [machineNumbers, setMachineNumbers] = useState<string[]>(Array(5).fill(''));
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Available years (last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 10}, (_, i) => (currentYear - i).toString());

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

  const handleSearch = () => {
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

    onSearch({
      successNumbers,
      machineNumbers,
      gameTypeId: gameType === 'all' ? null : gameType,
      gameId: specificGame === 'all' ? null : specificGame,
      year
    });
  };

  const handleClear = () => {
    setSuccessNumbers(Array(5).fill(''));
    setMachineNumbers(Array(5).fill(''));
    setGameType('all');
    setSpecificGame('all');
    setYear(new Date().getFullYear().toString());
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Number input boxes - displayed all on one line */}
        <div className="space-y-2">
          <Label>Success and Machine Numbers</Label>
          <div className="grid grid-cols-10 gap-2">
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
        
        <div className="grid gap-4 md:grid-cols-3">
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
          
          {/* Year selector */}
          <div className="space-y-2">
            <Label htmlFor="year">Select Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
    </div>
  );
}
