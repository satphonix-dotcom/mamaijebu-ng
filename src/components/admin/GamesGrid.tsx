
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LottoGame } from '@/types/supabase';
import { GameCard } from './GameCard';

interface GamesGridProps {
  games: Array<LottoGame & {
    countries?: { id: string; name: string; code: string };
    lotto_types?: { id: string; name: string; description: string };
  }>;
  loading: boolean;
  onDeleteGame?: (id: string) => Promise<void>;
}

export function GamesGrid({ games, loading, onDeleteGame }: GamesGridProps) {
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (gameToDelete && onDeleteGame) {
      await onDeleteGame(gameToDelete);
      setGameToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setGameToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading games...</p>
      </div>
    );
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No games found. Create your first game!</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onDelete={onDeleteGame ? () => openDeleteDialog(game.id) : undefined}
          />
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the game
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGameToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
