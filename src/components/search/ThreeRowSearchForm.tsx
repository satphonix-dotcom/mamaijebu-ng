
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { MatchLogicType, ThreeRowSearchParams } from '@/hooks/useThreeRowSearch';

interface ThreeRowSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: ThreeRowSearchParams) => void;
  isSearching: boolean;
}

export function ThreeRowSearchForm({ lottoTypes, games, gamesByType, onSearch, isSearching }: ThreeRowSearchFormProps) {
  const [firstRowNumbers, setFirstRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [secondRowNumbers, setSecondRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [thirdRowNumbers, setThirdRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [availableGames, setAvailableGames] = useState<LottoGame[]>([]);
  const [firstRowMatchLogic, setFirstRowMatchLogic] = useState<MatchLogicType>('two');
  const [secondRowMatchLogic, setSecondRowMatchLogic] = useState<MatchLogicType>('two');
  const [thirdRowMatchLogic, setThirdRowMatchLogic] = useState<MatchLogicType>('two');

  // Update available games when game type changes
  useEffect(() => {
    if (gameTypeId && gamesByType[gameTypeId]) {
      setAvailableGames(gamesByType[gameTypeId]);
      setGameId(null); // Reset game selection when type changes
    } else {
      setAvailableGames([]);
      setGameId(null);
    }
  }, [gameTypeId, gamesByType]);

  const handleFirstRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...firstRowNumbers];
    newNumbers[index] = value;
    setFirstRowNumbers(newNumbers);
  };

  const handleSecondRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...secondRowNumbers];
    newNumbers[index] = value;
    setSecondRowNumbers(newNumbers);
  };

  const handleThirdRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...thirdRowNumbers];
    newNumbers[index] = value;
    setThirdRowNumbers(newNumbers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      firstRowNumbers,
      secondRowNumbers,
      thirdRowNumbers,
      gameTypeId,
      gameId,
      firstRowMatchLogic,
      secondRowMatchLogic,
      thirdRowMatchLogic
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row of Numbers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              First Row Numbers (Enter numbers for the first draw)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {firstRowNumbers.map((num, index) => (
                <Input
                  key={`first-row-${index}`}
                  className="w-full text-center"
                  value={num}
                  onChange={(e) => handleFirstRowNumberChange(index, e.target.value)}
                  type="number"
                  min="1"
                  placeholder={(index + 1).toString()}
                />
              ))}
            </div>
          </div>

          {/* Second Row of Numbers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Second Row Numbers (Enter numbers for the second draw)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {secondRowNumbers.map((num, index) => (
                <Input
                  key={`second-row-${index}`}
                  className="w-full text-center"
                  value={num}
                  onChange={(e) => handleSecondRowNumberChange(index, e.target.value)}
                  type="number"
                  min="1"
                  placeholder={(index + 1).toString()}
                />
              ))}
            </div>
          </div>

          {/* Third Row of Numbers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Third Row Numbers (Enter numbers for the third draw)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {thirdRowNumbers.map((num, index) => (
                <Input
                  key={`third-row-${index}`}
                  className="w-full text-center"
                  value={num}
                  onChange={(e) => handleThirdRowNumberChange(index, e.target.value)}
                  type="number"
                  min="1"
                  placeholder={(index + 1).toString()}
                />
              ))}
            </div>
          </div>

          {/* Game Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Game Type
              </label>
              <Select
                value={gameTypeId || ""}
                onValueChange={(value) => setGameTypeId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Game Type" />
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

            {/* Specific Game Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Narrow Down to Game (Optional)
              </label>
              <Select
                value={gameId || ""}
                onValueChange={(value) => setGameId(value || null)}
                disabled={!gameTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={gameTypeId ? "Select Game" : "Select Game Type First"} />
                </SelectTrigger>
                <SelectContent>
                  {availableGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Match Logic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                @row1 (Match in First Row)
              </label>
              <Select
                value={firstRowMatchLogic}
                onValueChange={(value) => setFirstRowMatchLogic(value as MatchLogicType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match logic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Match any number</SelectItem>
                  <SelectItem value="one">Match at least 1 number</SelectItem>
                  <SelectItem value="two">Match at least 2 numbers</SelectItem>
                  <SelectItem value="three">Match at least 3 numbers</SelectItem>
                  <SelectItem value="four">Match at least 4 numbers</SelectItem>
                  <SelectItem value="five">Match at least 5 numbers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                @row2 (Match in Second Row)
              </label>
              <Select
                value={secondRowMatchLogic}
                onValueChange={(value) => setSecondRowMatchLogic(value as MatchLogicType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match logic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Match any number</SelectItem>
                  <SelectItem value="one">Match at least 1 number</SelectItem>
                  <SelectItem value="two">Match at least 2 numbers</SelectItem>
                  <SelectItem value="three">Match at least 3 numbers</SelectItem>
                  <SelectItem value="four">Match at least 4 numbers</SelectItem>
                  <SelectItem value="five">Match at least 5 numbers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                @row3 (Match in Third Row)
              </label>
              <Select
                value={thirdRowMatchLogic}
                onValueChange={(value) => setThirdRowMatchLogic(value as MatchLogicType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match logic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Match any number</SelectItem>
                  <SelectItem value="one">Match at least 1 number</SelectItem>
                  <SelectItem value="two">Match at least 2 numbers</SelectItem>
                  <SelectItem value="three">Match at least 3 numbers</SelectItem>
                  <SelectItem value="four">Match at least 4 numbers</SelectItem>
                  <SelectItem value="five">Match at least 5 numbers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
