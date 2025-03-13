
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';

interface Draw {
  drawNumber: string;
  drawDate: string;
  numbers: number[];
}

interface DrawsUploaderProps {
  games: LottoGame[];
  onSuccess: () => void;
}

export const DrawsUploader = ({ games, onSuccess }: DrawsUploaderProps) => {
  const [rawData, setRawData] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseDraws = (text: string): Draw[] => {
    const draws: Draw[] = [];
    
    // Split by lines and process each line
    const lines = text.trim().split('\n');
    
    for (const line of lines) {
      // Extract data using regex or split
      // Format: 3245: 04/01/2025: 75 30 55 64 23 | 52 47 82 73 80
      const parts = line.split(':').map(part => part.trim());
      
      if (parts.length < 3) continue;
      
      const drawNumber = parts[0];
      const drawDate = parts[1];
      
      // Extract all numbers, including those after the pipe symbol
      const numbersPart = parts.slice(2).join(':');
      const allNumbers = numbersPart.replace('|', ' ')
        .split(' ')
        .filter(n => n.trim() !== '')
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n));
      
      if (allNumbers.length > 0) {
        draws.push({
          drawNumber,
          drawDate: formatDate(drawDate),
          numbers: allNumbers
        });
      }
    }
    
    return draws;
  };
  
  // Convert date format from DD/MM/YYYY to YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

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

      let successCount = 0;
      let errorCount = 0;

      // Insert each draw one by one to better handle errors
      for (const draw of draws) {
        // Validate number count
        if (draw.numbers.length !== game.ball_count) {
          console.warn(`Draw ${draw.drawNumber} has ${draw.numbers.length} balls but game requires ${game.ball_count}`);
          errorCount++;
          continue;
        }

        // Validate number range
        const invalidNumbers = draw.numbers.filter(
          n => n < game.min_number || n > game.max_number
        );
        
        if (invalidNumbers.length > 0) {
          console.warn(`Draw ${draw.drawNumber} has numbers outside the allowed range: ${invalidNumbers.join(', ')}`);
          errorCount++;
          continue;
        }

        // Insert the draw
        const { error } = await supabase
          .from('lotto_draws')
          .insert({
            game_id: selectedGame,
            draw_date: draw.drawDate,
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
          description: 'No draws were uploaded. Please check the console for details.',
          variant: 'destructive',
        });
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
          <div>
            <Select 
              value={selectedGame} 
              onValueChange={setSelectedGame}
            >
              <SelectTrigger>
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
          
          <Textarea
            placeholder="e.g. 3245: 04/01/2025: 75 30 55 64 23 | 52 47 82 73 80"
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            className="min-h-[200px] font-mono"
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
