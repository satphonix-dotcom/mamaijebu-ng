
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define the search logic type
type SearchLogicType = 'both' | 'success' | 'machine' | 'position';

interface SearchParams {
  number: number;
  gameTypeId: string | null;
  gameId: string | null;
  searchLogic: SearchLogicType;
}

interface SearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  numbers: number[];
  draw_number?: string; // Keep this as optional since it might not be in DB
  matched_positions?: number[];
}

export function useSearchResults() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performSearch = async (params: SearchParams) => {
    try {
      setIsSearching(true);
      setSearchResults([]);
      
      // Build the query to fetch draw data
      let query = supabase
        .from('lotto_draws')
        .select(`
          id,
          draw_date,
          draw_number,
          numbers,
          lotto_games!inner(id, name, lotto_type_id)
        `);
      
      // Filter by game type if specified
      if (params.gameTypeId) {
        query = query.eq('lotto_games.lotto_type_id', params.gameTypeId);
      }
      
      // Filter by specific game if specified
      if (params.gameId) {
        query = query.eq('game_id', params.gameId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the results based on search logic
      const processedResults = (data || []).filter(draw => {
        const numbers = draw.numbers || [];
        
        if (params.searchLogic === 'both') {
          return numbers.includes(params.number);
        } else if (params.searchLogic === 'success') {
          // Assuming first 5 numbers are success numbers (may need to adjust based on your data structure)
          const successNumbers = numbers.slice(0, 5);
          return successNumbers.includes(params.number);
        } else if (params.searchLogic === 'machine') {
          // Assuming numbers after the first 5 are machine numbers
          const machineNumbers = numbers.slice(5);
          return machineNumbers.includes(params.number);
        } else if (params.searchLogic === 'position') {
          // For position search, we're just checking if the number exists in any position
          // In a real implementation, you'd check specific positions
          return numbers.includes(params.number);
        }
        
        return false;
      }).map((draw, index) => {
        // Find the positions where the number matches
        const matchedPositions = draw.numbers
          .map((num: number, index: number) => num === params.number ? index : -1)
          .filter((pos: number) => pos !== -1);
        
        return {
          id: draw.id,
          game_name: draw.lotto_games.name,
          draw_date: draw.draw_date,
          numbers: draw.numbers,
          draw_number: draw.draw_number || `${index + 1}`, // Use stored draw_number or fallback to index
          matched_positions: matchedPositions
        };
      });
      
      setSearchResults(processedResults);
      
      toast({
        title: "Search complete",
        description: `Found ${processedResults.length} results for number ${params.number}`,
      });
      
    } catch (error) {
      console.error('Error searching for numbers:', error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    isSearching,
    performSearch
  };
}
