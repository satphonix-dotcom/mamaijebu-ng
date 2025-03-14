
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LottoGame, Country } from '@/types/supabase';
import { GameSelector } from './GameSelector';
import { CountrySelector } from './CountrySelector';

interface CreateDrawDialogProps {
  games: LottoGame[];
  onSuccess: () => void;
}

export const CreateDrawDialog = ({ games, onSuccess }: CreateDrawDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [drawDate, setDrawDate] = useState('');
  const [drawNumber, setDrawNumber] = useState('');
  const [numbers, setNumbers] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const { toast } = useToast();

  // Fetch countries when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setCountries(data || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load countries. Please try again.',
          variant: 'destructive',
        });
      }
    };

    if (isDialogOpen) {
      fetchCountries();
    }
  }, [isDialogOpen, toast]);

  // Reset selected game when country changes
  useEffect(() => {
    setSelectedGame('');
  }, [selectedCountry]);

  // Get the currently selected game
  const selectedGameObject = games.find(g => g.id === selectedGame);

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
      
      if (!selectedGameObject) {
        toast({
          title: 'Error',
          description: 'Selected game not found',
          variant: 'destructive',
        });
        return;
      }
      
      if (numbersArray.length !== selectedGameObject.ball_count) {
        toast({
          title: 'Error',
          description: `You must enter exactly ${selectedGameObject.ball_count} numbers`,
          variant: 'destructive',
        });
        return;
      }
      
      for (const num of numbersArray) {
        if (isNaN(num) || num < selectedGameObject.min_number || num > selectedGameObject.max_number) {
          toast({
            title: 'Error',
            description: `All numbers must be between ${selectedGameObject.min_number} and ${selectedGameObject.max_number}`,
            variant: 'destructive',
          });
          return;
        }
      }
      
      const { error } = await supabase
        .from('lotto_draws')
        .insert([{
          game_id: selectedGame,
          draw_date: drawDate,
          draw_number: drawNumber || null,
          numbers: numbersArray
        }]);
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      setSelectedCountry('');
      setSelectedGame('');
      setDrawDate('');
      setDrawNumber('');
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
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <div className="col-span-3">
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelectCountry={setSelectedCountry}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="game" className="text-right">
                Game
              </Label>
              <div className="col-span-3">
                <GameSelector
                  games={games}
                  selectedGame={selectedGame}
                  onSelectGame={setSelectedGame}
                  selectedCountry={selectedCountry}
                  disabled={!selectedCountry}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="draw_number" className="text-right">
                Draw Number
              </Label>
              <Input
                id="draw_number"
                placeholder="e.g., 0001"
                value={drawNumber}
                onChange={(e) => setDrawNumber(e.target.value)}
                className="col-span-3"
              />
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
                {selectedGameObject && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter {selectedGameObject.ball_count} numbers between {selectedGameObject.min_number} and {selectedGameObject.max_number}, separated by commas.
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
