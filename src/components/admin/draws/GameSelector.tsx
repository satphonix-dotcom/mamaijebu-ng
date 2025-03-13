
import { LottoGame } from '@/types/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameSelectorProps {
  games: LottoGame[];
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
}

export const GameSelector = ({ games, selectedGame, onSelectGame }: GameSelectorProps) => {
  return (
    <Select 
      value={selectedGame} 
      onValueChange={onSelectGame}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a game" />
      </SelectTrigger>
      <SelectContent>
        {games.map(game => (
          <SelectItem key={game.id} value={game.id}>
            {game.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
