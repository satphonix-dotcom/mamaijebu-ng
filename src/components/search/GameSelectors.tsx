
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LottoType, LottoGame } from '@/types/supabase';

interface GameSelectorsProps {
  lottoTypes: LottoType[];
  availableGames: LottoGame[];
  gameTypeId: string | null;
  gameId: string | null;
  onGameTypeChange: (value: string) => void;
  onGameIdChange: (value: string) => void;
  isMobile?: boolean;
}

export function GameSelectors({
  lottoTypes,
  availableGames,
  gameTypeId,
  gameId,
  onGameTypeChange,
  onGameIdChange,
  isMobile = false
}: GameSelectorsProps) {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Game Type
        </label>
        <Select
          value={gameTypeId || ""}
          onValueChange={(value) => onGameTypeChange(value)}
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

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Narrow Down to Game (Optional)
        </label>
        <Select
          value={gameId || ""}
          onValueChange={(value) => onGameIdChange(value)}
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
  );
}
