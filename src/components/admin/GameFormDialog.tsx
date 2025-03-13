
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Country, LottoType, LottoGame } from '@/types/supabase';

interface GameFormDialogProps {
  countries: Country[];
  lottoTypes: LottoType[];
  onGameAdded: (game: any) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameFormDialog({ 
  countries, 
  lottoTypes, 
  onGameAdded, 
  isOpen, 
  onOpenChange 
}: GameFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ballCount, setBallCount] = useState('');
  const [minNumber, setMinNumber] = useState('');
  const [maxNumber, setMaxNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLottoType, setSelectedLottoType] = useState('');
  
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setDescription('');
    setBallCount('');
    setMinNumber('');
    setMaxNumber('');
    setSelectedCountry('');
    setSelectedLottoType('');
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
      
      onGameAdded(data);
      onOpenChange(false);
      resetForm();
      
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
