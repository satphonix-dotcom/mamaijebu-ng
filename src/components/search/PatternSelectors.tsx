
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LottoType, LottoGame } from '@/types/supabase';

interface PatternSelectorsProps {
  lottoTypes: LottoType[];
  filteredGames: LottoGame[];
  gameType: string;
  specificGame: string;
  year: string;
  years: string[];
  onGameTypeChange: (value: string) => void;
  onSpecificGameChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function PatternSelectors({
  lottoTypes,
  filteredGames,
  gameType,
  specificGame,
  year,
  years,
  onGameTypeChange,
  onSpecificGameChange,
  onYearChange
}: PatternSelectorsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Game franchise/operator selector */}
      <div className="space-y-2">
        <Label htmlFor="gameType">Game Franchise</Label>
        <Select value={gameType} onValueChange={(value) => onGameTypeChange(value)}>
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
        <Select value={specificGame} onValueChange={onSpecificGameChange} disabled={filteredGames.length === 0}>
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
        <Select value={year} onValueChange={onYearChange}>
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
  );
}
