
import { LottoGame } from '@/types/supabase';
import { GameCard } from './GameCard';

interface GamesGridProps {
  games: Array<LottoGame & {
    countries?: { id: string; name: string; code: string };
    lotto_types?: { id: string; name: string; description: string };
  }>;
  loading: boolean;
}

export function GamesGrid({ games, loading }: GamesGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading games...</p>
      </div>
    );
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No games found. Create your first game!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
