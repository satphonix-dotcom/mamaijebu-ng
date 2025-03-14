
import { LottoGame } from '@/types/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameSelectorProps {
  games: LottoGame[];
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
  selectedCountry?: string;
  disabled?: boolean;
}

export const GameSelector = ({ 
  games, 
  selectedGame, 
  onSelectGame, 
  selectedCountry,
  disabled = false 
}: GameSelectorProps) => {
  // Filter games by country if a country is selected
  const filteredGames = selectedCountry 
    ? games.filter(game => game.country_id === selectedCountry)
    : games;

  return (
    <Select 
      value={selectedGame} 
      onValueChange={onSelectGame}
      disabled={disabled || filteredGames.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder={filteredGames.length === 0 ? "No games for selected country" : "Select a game"} />
      </SelectTrigger>
      <SelectContent>
        {filteredGames.map(game => (
          <SelectItem key={game.id} value={game.id}>
            {game.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
