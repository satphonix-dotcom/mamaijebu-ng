
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LottoDraw, LottoGame } from '@/types/supabase';

// Define an extended type that includes the lotto_games relation
type DrawWithGame = LottoDraw & {
  lotto_games?: LottoGame;
};

interface DrawsListProps {
  draws: DrawWithGame[];
  loading: boolean;
}

export const DrawsList = ({ draws, loading }: DrawsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading draws...</p>
      </div>
    );
  }

  if (draws.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No draws found. Create your first draw!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {draws.map((draw) => (
        <Card key={draw.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{draw.lotto_games?.name || 'Unknown Game'}</CardTitle>
              <span className="text-sm font-medium">
                {new Date(draw.draw_date).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {draw.numbers.map((number, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                >
                  {number}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
