import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame, Country, LottoType } from '@/types/supabase';

export default function Games() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [lottoTypes, setLottoTypes] = useState<LottoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ballCount, setBallCount] = useState('');
  const [minNumber, setMinNumber] = useState('');
  const [maxNumber, setMaxNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLottoType, setSelectedLottoType] = useState('');
  
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
        .select(`
          *,
          countries (id, name, code),
          lotto_types (id, name, description)
        `)
        .order('name', { ascending: true });
      
      if (gamesError) throw gamesError;
      setGames(gamesData || []);
      
      // Fetch countries
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true }) as { data: Country[] | null, error: any };
      
      if (countriesError) throw countriesError;
      setCountries(countriesData || []);
      
      // Fetch lotto types
      const { data: typesData, error: typesError } = await supabase
        .from('lotto_types')
        .select('*')
        .order('name', { ascending: true }) as { data: LottoType[] | null, error: any };
      
      if (typesError) throw typesError;
      setLottoTypes(typesData || []);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('lotto_games')
        .insert([{
          name,
          description,
          ball_count: parseInt(ballCount),
          min_number: parseInt(minNumber),
          max_number: parseInt(maxNumber),
          country_id: selectedCountry,
          lotto_type_id: selectedLottoType
        }])
        .select(`
          *,
          countries (id, name, code),
          lotto_types (id, name, description)
        `);
      
      if (error) throw error;
      
      setGames([...(data as any), ...games]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Game created successfully',
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to create game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setBallCount('');
    setMinNumber('');
    setMaxNumber('');
    setSelectedCountry('');
    setSelectedLottoType('');
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
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create New Lotto Game</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Game Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Country
                    </Label>
                    <Select 
                      value={selectedCountry} 
                      onValueChange={setSelectedCountry}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Lottery Type
                    </Label>
                    <Select 
                      value={selectedLottoType} 
                      onValueChange={setSelectedLottoType}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a lottery type" />
                      </SelectTrigger>
                      <SelectContent>
                        {lottoTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ball_count" className="text-right">
                      Ball Count
                    </Label>
                    <Input
                      id="ball_count"
                      type="number"
                      value={ballCount}
                      onChange={(e) => setBallCount(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min_number" className="text-right">
                      Min Number
                    </Label>
                    <Input
                      id="min_number"
                      type="number"
                      value={minNumber}
                      onChange={(e) => setMinNumber(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max_number" className="text-right">
                      Max Number
                    </Label>
                    <Input
                      id="max_number"
                      type="number"
                      value={maxNumber}
                      onChange={(e) => setMaxNumber(e.target.value)}
                      className="col-span-3"
                      required
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id}>
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>
                    {(game as any).countries?.name} - {(game as any).lotto_types?.name}
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
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
