import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame, LottoDraw } from '@/types/supabase';

// Define an extended type that includes the lotto_games relation
type DrawWithGame = LottoDraw & {
  lotto_games?: LottoGame;
};

export default function Draws() {
  const [draws, setDraws] = useState<DrawWithGame[]>([]);
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<LottoGame | null>(null);
  const [drawDate, setDrawDate] = useState('');
  const [numbers, setNumbers] = useState<string>('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch games
      const { data: gamesData, error: gamesError } = await supabase
        .from('lotto_games')
        .select('*');
      
      if (gamesError) throw gamesError;
      setGames(gamesData || []);
      
      // Fetch draws with game information
      const { data: drawsData, error: drawsError } = await supabase
        .from('lotto_draws')
        .select(`
          *,
          lotto_games(*)
        `)
        .order('draw_date', { ascending: false });
      
      if (drawsError) throw drawsError;
      setDraws(drawsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameChange = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    setSelectedGame(game || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGame) {
      toast({
        title: 'Error',
        description: 'Please select a game',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Parse and validate numbers
      const numbersArray = numbers.split(',').map(n => parseInt(n.trim(), 10));
      
      if (numbersArray.length !== selectedGame.ball_count) {
        toast({
          title: 'Error',
          description: `You must enter exactly ${selectedGame.ball_count} numbers`,
          variant: 'destructive',
        });
        return;
      }
      
      for (const num of numbersArray) {
        if (isNaN(num) || num < selectedGame.min_number || num > selectedGame.max_number) {
          toast({
            title: 'Error',
            description: `All numbers must be between ${selectedGame.min_number} and ${selectedGame.max_number}`,
            variant: 'destructive',
          });
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('lotto_draws')
        .insert([{
          game_id: selectedGame.id,
          draw_date: drawDate,
          numbers: numbersArray
        }])
        .select(`
          *,
          lotto_games(*)
        `);
      
      if (error) throw error;
      
      setDraws([...(data as DrawWithGame[]), ...draws]);
      setIsDialogOpen(false);
      setSelectedGame(null);
      setDrawDate('');
      setNumbers('');
      
      toast({
        title: 'Success',
        description: 'Draw created successfully',
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating draw:', error);
      toast({
        title: 'Error',
        description: 'Failed to create draw. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lotto Draws</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Draw</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Lotto Draw</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="game" className="text-right">
                      Game
                    </Label>
                    <Select onValueChange={handleGameChange} required>
                      <SelectTrigger className="col-span-3">
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
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="draw_date" className="text-right">
                      Draw Date
                    </Label>
                    <Input
                      id="draw_date"
                      type="date"
                      value={drawDate}
                      onChange={(e) => setDrawDate(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="numbers" className="text-right">
                      Numbers
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="numbers"
                        placeholder="e.g., 5, 12, 23, 27, 39, 42"
                        value={numbers}
                        onChange={(e) => setNumbers(e.target.value)}
                        required
                      />
                      {selectedGame && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter {selectedGame.ball_count} numbers between {selectedGame.min_number} and {selectedGame.max_number}, separated by commas.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Draw</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading draws...</p>
          </div>
        ) : draws.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No draws found. Create your first draw!</p>
          </div>
        ) : (
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
        )}
      </div>
    </AdminLayout>
  );
}
