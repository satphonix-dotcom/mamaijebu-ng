
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LottoGame } from '@/types/supabase';

interface CreateDrawDialogProps {
  games: LottoGame[];
  onSuccess: () => void;
}

export const CreateDrawDialog = ({ games, onSuccess }: CreateDrawDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<LottoGame | null>(null);
  const [drawDate, setDrawDate] = useState('');
  const [numbers, setNumbers] = useState<string>('');
  const { toast } = useToast();

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
      
      const { error } = await supabase
        .from('lotto_draws')
        .insert([{
          game_id: selectedGame.id,
          draw_date: drawDate,
          numbers: numbersArray
        }]);
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      setSelectedGame(null);
      setDrawDate('');
      setNumbers('');
      
      toast({
        title: 'Success',
        description: 'Draw created successfully',
      });
      
      onSuccess(); // Refresh data
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
  );
};
