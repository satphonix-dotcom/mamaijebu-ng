
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { LottoGame } from '@/types/supabase';

interface GameCardProps {
  game: LottoGame & {
    countries?: { id: string; name: string; code: string };
    lotto_types?: { id: string; name: string; description: string };
  };
  onDelete?: () => void;
}

export function GameCard({ game, onDelete }: GameCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
        <CardDescription>
          {game.countries?.name || 'No country'} - {game.lotto_types?.name || 'No type'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{game.description || 'No description available'}</p>
        <div className="text-sm text-muted-foreground">
          <p>Balls: {game.ball_count}</p>
          <p>Range: {game.min_number} - {game.max_number}</p>
        </div>
      </CardContent>
      {onDelete && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDelete}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4 mr-2 text-destructive" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
