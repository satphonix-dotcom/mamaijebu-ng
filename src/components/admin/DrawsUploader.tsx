
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame, LottoType, Country } from '@/types/supabase';
import { GameSelector } from './draws/GameSelector';
import { CountrySelector } from './draws/CountrySelector';
import { DrawDataInput } from './draws/DrawDataInput';
import { parseDraws, validateDraw } from '@/utils/drawParser';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface DrawsUploaderProps {
  games: (LottoGame & { lotto_type?: LottoType })[];
  onSuccess: () => void;
}

export const DrawsUploader = ({ games, onSuccess }: DrawsUploaderProps) => {
  const [rawData, setRawData] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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

    fetchCountries();
  }, [toast]);

  // Reset selected game when country changes
  useEffect(() => {
    setSelectedGame('');
  }, [selectedCountry]);

  const handleUpload = async () => {
    if (!selectedGame) {
      toast({
        title: 'Game Required',
        description: 'Please select a game for these draws',
        variant: 'destructive',
      });
      return;
    }

    if (!rawData.trim()) {
      toast({
        title: 'No Data',
        description: 'Please enter draw data to upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const draws = parseDraws(rawData);
      
      if (draws.length === 0) {
        throw new Error('No valid draws found in the data');
      }

      // Find the selected game to validate the numbers
      const game = games.find(g => g.id === selectedGame);
      
      if (!game) {
        throw new Error('Selected game not found');
      }

      console.log(`Uploading ${draws.length} draws for game: ${game.name}`);
      console.log(`Game configuration: ${game.ball_count} balls, range ${game.min_number}-${game.max_number}`);
      
      let successCount = 0;
      let errorCount = 0;
      let validationErrors: string[] = [];

      // Insert each draw one by one to better handle errors
      for (const draw of draws) {
        // Validate draw against game rules
        const validation = validateDraw(draw, game);
        
        if (!validation.valid) {
          console.warn(validation.errors.join('\n'));
          validationErrors = [...validationErrors, ...validation.errors];
          errorCount++;
          continue;
        }

        // Insert the draw with draw number
        const { error } = await supabase
          .from('lotto_draws')
          .insert({
            game_id: selectedGame,
            draw_date: draw.drawDate,
            draw_number: draw.drawNumber,
            numbers: draw.numbers
          });

        if (error) {
          console.error(`Error inserting draw ${draw.drawNumber}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Draws Uploaded',
          description: `Successfully uploaded ${successCount} draws${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
        
        // Clear the form
        setRawData('');
        
        // Refresh the draws list
        onSuccess();
      } else {
        toast({
          title: 'Upload Failed',
          description: `No draws were uploaded. ${validationErrors.length > 0 ? 'Validation errors occurred.' : 'Please check the console for details.'}`,
          variant: 'destructive',
        });
        
        if (validationErrors.length > 0) {
          console.error('Validation errors:', validationErrors);
          toast({
            title: 'Validation Errors',
            description: validationErrors[0],
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error processing draws:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process draw data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Bulk Upload Draws</CardTitle>
        <CardDescription>
          Paste draw data in the format: DrawNumber: Date: Numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Country</label>
              <CountrySelector 
                countries={countries} 
                selectedCountry={selectedCountry} 
                onSelectCountry={setSelectedCountry} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Game</label>
              <GameSelector 
                games={games} 
                selectedGame={selectedGame} 
                onSelectGame={setSelectedGame}
                selectedCountry={selectedCountry}
                disabled={!selectedCountry} 
              />
            </div>
          </div>
          
          <DrawDataInput 
            value={rawData} 
            onChange={setRawData} 
          />
          
          <Button 
            onClick={handleUpload} 
            disabled={isLoading || !selectedGame || !rawData.trim()}
            className="w-full"
          >
            {isLoading ? 'Uploading...' : 'Upload Draws'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
