
import { useState, useEffect } from 'react';
import { Country } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCountries = async () => {
    try {
      setLoading(true);
      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true }) as { data: Country[] | null, error: any };
      
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load countries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCountry = async (name: string, code: string) => {
    try {
      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('countries')
        .insert([{
          name: name,
          code: code,
        }])
        .select() as { data: Country[] | null, error: any };
      
      if (error) throw error;
      
      if (data) {
        setCountries(prevCountries => [...data, ...prevCountries]);
      }
      
      toast({
        title: 'Success',
        description: 'Country added successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error adding country:', error);
      toast({
        title: 'Error',
        description: 'Failed to add country. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCountry = async (id: string) => {
    try {
      // First check if the country is referenced by any games
      const { data: games, error: gamesError } = await supabase
        .from('lotto_games')
        .select('id')
        .eq('country_id', id)
        .limit(1);
      
      if (gamesError) throw gamesError;
      
      if (games && games.length > 0) {
        toast({
          title: 'Cannot Delete Country',
          description: 'This country is used by one or more games. Delete those games first.',
          variant: 'destructive',
        });
        return false;
      }
      
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setCountries(prevCountries => prevCountries.filter(country => country.id !== id));

      toast({
        title: 'Success',
        description: 'Country deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete country. This country may be referenced by games.',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    fetchCountries,
    addCountry,
    deleteCountry
  };
}
