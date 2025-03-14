
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
import { GameFormDialog } from '@/components/admin/games/GameFormDialog';
import { GamesGrid } from '@/components/admin/GamesGrid';
import { useGames } from '@/hooks/useGames';
import { useCountries } from '@/hooks/useCountries';
import { useLottoTypes } from '@/hooks/useLottoTypes';

export default function Games() {
  const { games, loading, fetchGames, handleDeleteGame } = useGames();
  const { countries } = useCountries();
  const { lottoTypes } = useLottoTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleGameAdded = () => {
    fetchGames(); // Refresh data to ensure consistency
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lotto Games</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add New Game</Button>
        </div>

        <GameFormDialog 
          countries={countries}
          lottoTypes={lottoTypes}
          onGameAdded={handleGameAdded}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

        <GamesGrid 
          games={games} 
          loading={loading} 
          onDeleteGame={handleDeleteGame}
        />
      </div>
    </AdminLayout>
  );
}
