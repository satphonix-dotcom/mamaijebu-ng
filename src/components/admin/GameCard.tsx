
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LottoGame } from '@/types/supabase';

interface GameCardProps {
  game: LottoGame & {
    countries?: { id: string; name: string; code: string };
    lotto_types?: { id: string; name: string; description: string };
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
        <CardDescription>
          {game.countries?.name} - {game.lotto_types?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{game.description || 'No description available'}</p>
        <div className="text-sm text-muted-foreground">
          <p>Balls: {game.ball_count}</p>
          <p>Range: {game.min_number} - {game.max_number}</p>
        </div>
      </CardContent>
    </Card>
  );
}
