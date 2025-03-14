
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { LottoDraw, LottoGame } from '@/types/supabase';

// Define an extended type that includes the lotto_games relation
type DrawWithGame = LottoDraw & {
  lotto_games?: LottoGame;
};

interface DrawsListProps {
  draws: DrawWithGame[];
  loading: boolean;
  onDeleteDraw?: (id: string) => Promise<void>;
}

export const DrawsList = ({ draws, loading, onDeleteDraw }: DrawsListProps) => {
  const [drawToDelete, setDrawToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (drawToDelete && onDeleteDraw) {
      await onDeleteDraw(drawToDelete);
      setDrawToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDrawToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading draws...</p>
      </div>
    );
  }

  if (draws.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No draws found. Create your first draw!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {draws.map((draw) => (
          <Card key={draw.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{draw.lotto_games?.name || 'Unknown Game'}</CardTitle>
                <span className="text-sm font-medium">
                  {new Date(draw.draw_date).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {draw.numbers.map((number, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </CardContent>
            {onDeleteDraw && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openDeleteDialog(draw.id)}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this draw.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDrawToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
