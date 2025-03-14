
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';

export function useGames() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      
      // Fetch games
      const { data: gamesData, error: gamesError } = await supabase
        .from('lotto_games')
        .select(`
          *,
          countries (*),
          lotto_types (*)
        `)
        .order('name', { ascending: true });
      
      if (gamesError) throw gamesError;
      setGames(gamesData || []);
      
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

  const handleDeleteGame = async (id: string) => {
    try {
      console.log('Deleting game with ID:', id);
      
      // First, check if there are any draws associated with this game
      const { data: draws, error: drawsError } = await supabase
        .from('lotto_draws')
        .select('id')
        .eq('game_id', id)
        .limit(1);
      
      if (drawsError) throw drawsError;
      
      if (draws && draws.length > 0) {
        toast({
          title: 'Cannot Delete Game',
          description: 'This game has draws associated with it. Delete the draws first.',
          variant: 'destructive',
        });
        return;
      }
      
      // If no draws are associated, proceed with deletion
      const { error } = await supabase
        .from('lotto_games')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state by filtering out the deleted game
      setGames(prevGames => prevGames.filter(game => game.id !== id));

      toast({
        title: 'Success',
        description: 'Game deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete game. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    loading,
    fetchGames,
    handleDeleteGame
  };
}
