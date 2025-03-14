
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
      
      setLottoTypes([...(data || []), ...lottoTypes]);
      
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
      setLottoTypes(lottoTypes.map(type => 
        type.id === id ? { ...type, ...data?.[0] } : type
      ));
      
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
      const { error } = await supabase
        .from('lotto_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state by removing the deleted type
      setLottoTypes(lottoTypes.filter(type => type.id !== id));
      
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
