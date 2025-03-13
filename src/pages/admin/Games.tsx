
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame, Country, LottoType } from '@/types/supabase';
import { GameFormDialog } from '@/components/admin/GameFormDialog';
import { GamesGrid } from '@/components/admin/GamesGrid';

export default function Games() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [lottoTypes, setLottoTypes] = useState<LottoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
          countries (*),
          lotto_type:lotto_type_id (*)
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

  const handleGameAdded = (newGame: any) => {
    setGames([...(newGame as any), ...games]);
    fetchData(); // Refresh data to ensure consistency
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lotto Games</h1>
          <GameFormDialog 
            countries={countries}
            lottoTypes={lottoTypes}
            onGameAdded={handleGameAdded}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>

        <GamesGrid games={games} loading={loading} />
      </div>
    </AdminLayout>
  );
}
