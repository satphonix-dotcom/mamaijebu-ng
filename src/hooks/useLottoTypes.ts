
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LottoType } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useLottoTypes() {
  const [lottoTypes, setLottoTypes] = useState<LottoType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLottoTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lotto_types')
        .select('*')
        .order('name', { ascending: true }) as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      setLottoTypes(data || []);
    } catch (error) {
      console.error('Error fetching lotto types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lotto types. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addLottoType = async (typeData: any) => {
    try {
      const { data, error } = await supabase
        .from('lotto_types')
        .insert([typeData])
        .select() as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      
      if (data) {
        setLottoTypes(prevTypes => [...(data || []), ...prevTypes]);
      }
      
      toast({
        title: 'Success',
        description: 'Lottery type added successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error adding lottery type:', error);
      toast({
        title: 'Error',
        description: 'Failed to add lottery type. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateLottoType = async (id: string, typeData: any) => {
    try {
      const { data, error } = await supabase
        .from('lotto_types')
        .update(typeData)
        .eq('id', id)
        .select() as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      
      // Update the local state with the updated type
      if (data && data.length > 0) {
        setLottoTypes(prevTypes => 
          prevTypes.map(type => type.id === id ? data[0] : type)
        );
      }
      
      toast({
        title: 'Success',
        description: 'Lottery type updated successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error updating lottery type:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lottery type. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteLottoType = async (id: string) => {
    try {
      console.log('Deleting lotto type with ID:', id);
      
      // First, check if there are any games associated with this type
      const { data: games, error: gamesError } = await supabase
        .from('lotto_games')
        .select('id')
        .eq('lotto_type_id', id)
        .limit(1);
      
      if (gamesError) throw gamesError;
      
      if (games && games.length > 0) {
        toast({
          title: 'Cannot Delete Lottery Type',
          description: 'This type is used by one or more games. Delete those games first.',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('lotto_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state by removing the deleted type
      setLottoTypes(prevTypes => prevTypes.filter(type => type.id !== id));
      
      toast({
        title: 'Success',
        description: 'Lottery type deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting lottery type:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lottery type. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchLottoTypes();
  }, []);

  return {
    lottoTypes,
    loading,
    fetchLottoTypes,
    addLottoType,
    updateLottoType,
    deleteLottoType
  };
}
