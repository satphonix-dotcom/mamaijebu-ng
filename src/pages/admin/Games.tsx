
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';

export default function Games() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    ball_count: 6,
    min_number: 1,
    max_number: 49
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('lotto_games').select('*').order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: 'Error',
        description: 'Failed to load games. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGame({
      ...newGame,
      [name]: name === 'ball_count' || name === 'min_number' || name === 'max_number' 
        ? parseInt(value, 10) 
        : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('lotto_games')
        .insert([newGame])
        .select();
      
      if (error) throw error;
      
      setGames([...(data as LottoGame[]), ...games]);
      setIsDialogOpen(false);
      setNewGame({
        name: '',
        description: '',
        ball_count: 6,
        min_number: 1,
        max_number: 49
      });
      
      toast({
        title: 'Success',
        description: 'Game created successfully',
      });
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to create game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lotto Games</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Game</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Lotto Game</DialogTitle>
                <DialogDescription>
                  Add a new lotto game with its rules and parameters.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newGame.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newGame.description || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ball_count" className="text-right">
                      Ball Count
                    </Label>
                    <Input
                      id="ball_count"
                      name="ball_count"
                      type="number"
                      value={newGame.ball_count}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                      min={1}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min_number" className="text-right">
                      Min Number
                    </Label>
                    <Input
                      id="min_number"
                      name="min_number"
                      type="number"
                      value={newGame.min_number}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                      min={1}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max_number" className="text-right">
                      Max Number
                    </Label>
                    <Input
                      id="max_number"
                      name="max_number"
                      type="number"
                      value={newGame.max_number}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                      min={1}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Game</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No games found. Create your first game!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id}>
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>
                    {game.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-medium">Ball Count:</span> {game.ball_count}</p>
                    <p><span className="font-medium">Number Range:</span> {game.min_number} to {game.max_number}</p>
                    <p><span className="font-medium">Created:</span> {new Date(game.created_at).toLocaleDateString()}</p>
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
