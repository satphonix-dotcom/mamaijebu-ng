
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame, LottoDraw, Country } from '@/types/supabase';
import { DrawsUploader } from '@/components/admin/DrawsUploader';
import { CreateDrawDialog } from '@/components/admin/draws/CreateDrawDialog';
import { DrawsList } from '@/components/admin/draws/DrawsList';

// Define an extended type that includes the lotto_games relation
type DrawWithGame = LottoDraw & {
  lotto_games?: LottoGame;
};

export default function Draws() {
  const [draws, setDraws] = useState<DrawWithGame[]>([]);
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch games with country information
      const { data: gamesData, error: gamesError } = await supabase
        .from('lotto_games')
        .select(`
          *,
          countries(*)
        `);
      
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

  const handleDeleteDraw = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lotto_draws')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setDraws(draws.filter(draw => draw.id !== id));

      toast({
        title: 'Success',
        description: 'Draw deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting draw:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete draw. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lotto Draws</h1>
          <CreateDrawDialog games={games} onSuccess={fetchData} />
        </div>

        {/* Bulk Upload Component */}
        <DrawsUploader games={games} onSuccess={fetchData} />

        {/* Draws List */}
        <DrawsList draws={draws} loading={loading} onDeleteDraw={handleDeleteDraw} />
      </div>
    </AdminLayout>
  );
}
