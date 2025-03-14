
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameFormState {
  name: string;
  description: string;
  ballCount: string;
  minNumber: string;
  maxNumber: string;
  selectedCountry: string;
  selectedLottoType: string;
}

interface UseGameFormProps {
  onGameAdded: (game: any) => void;
  onOpenChange: (open: boolean) => void;
}

export function useGameForm({ onGameAdded, onOpenChange }: UseGameFormProps) {
  const [formState, setFormState] = useState<GameFormState>({
    name: '',
    description: '',
    ballCount: '',
    minNumber: '',
    maxNumber: '',
    selectedCountry: '',
    selectedLottoType: '',
  });
  
  const { toast } = useToast();

  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      ballCount: '',
      minNumber: '',
      maxNumber: '',
      selectedCountry: '',
      selectedLottoType: '',
    });
  };

  const updateField = (field: keyof GameFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('lotto_games')
        .insert([{
          name: formState.name,
          description: formState.description,
          ball_count: parseInt(formState.ballCount),
          min_number: parseInt(formState.minNumber),
          max_number: parseInt(formState.maxNumber),
          country_id: formState.selectedCountry,
          lotto_type_id: formState.selectedLottoType
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

  return {
    formState,
    updateField,
    handleSubmit,
    resetForm
  };
}
