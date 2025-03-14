
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Country, LottoType } from '@/types/supabase';
import { GameFormFields } from './GameFormFields';
import { useGameForm } from '@/hooks/useGameForm';

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
  const { formState, updateField, handleSubmit } = useGameForm({ onGameAdded, onOpenChange });

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
          <GameFormFields
            name={formState.name}
            description={formState.description}
            ballCount={formState.ballCount}
            minNumber={formState.minNumber}
            maxNumber={formState.maxNumber}
            selectedCountry={formState.selectedCountry}
            selectedLottoType={formState.selectedLottoType}
            countries={countries}
            lottoTypes={lottoTypes}
            onFieldChange={updateField}
          />
          <DialogFooter>
            <Button type="submit">Create Game</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
