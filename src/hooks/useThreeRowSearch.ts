
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define types for search logic
export type MatchLogicType = 'any' | 'one' | 'two' | 'three' | 'four' | 'five';

export interface ThreeRowSearchParams {
  firstRowNumbers: string[];
  secondRowNumbers: string[];
  thirdRowNumbers: string[];
  gameTypeId: string | null;
  gameId: string | null;
  firstRowMatchLogic: MatchLogicType;
  secondRowMatchLogic: MatchLogicType;
  thirdRowMatchLogic: MatchLogicType;
}

interface SearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  numbers: number[];
  draw_number?: string;
  next_draw_date?: string;
  next_draw_numbers?: number[];
  next_draw_id?: string;
  third_draw_date?: string;
  third_draw_numbers?: number[];
  third_draw_id?: string;
  first_row_matched?: boolean;
  second_row_matched?: boolean;
  third_row_matched?: boolean;
}

export function useThreeRowSearch() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const getMinimumMatchCount = (matchLogic: MatchLogicType): number => {
    switch (matchLogic) {
      case 'one': return 1;
      case 'two': return 2;
      case 'three': return 3;
      case 'four': return 4;
      case 'five': return 5;
      default: return 0; // 'any' means no minimum
    }
  };

  const performSearch = async (params: ThreeRowSearchParams) => {
    setIsSearching(true);
    
    try {
      // Filter out empty strings
      const firstRowNums = params.firstRowNumbers.filter(n => n.trim() !== '').map(Number);
      const secondRowNums = params.secondRowNumbers.filter(n => n.trim() !== '').map(Number);
      const thirdRowNums = params.thirdRowNumbers.filter(n => n.trim() !== '').map(Number);
      
      // Validate that we have enough numbers to search based on match logic
      const firstRowMinMatch = getMinimumMatchCount(params.firstRowMatchLogic);
      const secondRowMinMatch = getMinimumMatchCount(params.secondRowMatchLogic);
      const thirdRowMinMatch = getMinimumMatchCount(params.thirdRowMatchLogic);
      
      if (firstRowNums.length < firstRowMinMatch && 
          secondRowNums.length < secondRowMinMatch && 
          thirdRowNums.length < thirdRowMinMatch) {
        toast({
          title: "Invalid search",
          description: "Please enter enough numbers to match your search criteria for at least one row.",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      // Build query
      let query = supabase
        .from('lotto_draws')
        .select(`
          id,
          draw_date,
          draw_number,
          numbers,
          lotto_games!inner (
            id,
            name,
            lotto_type:lotto_type_id (id, name)
          )
        `)
        .order('draw_date', { ascending: false });
      
      // Filter by game type if provided
      if (params.gameTypeId) {
        query = query.eq('lotto_games.lotto_type_id', params.gameTypeId);
      }
      
      // Filter by specific game if provided
      if (params.gameId) {
        query = query.eq('game_id', params.gameId);
      }
      
      const { data: allDraws, error } = await query;
      
      if (error) throw error;
      
      // Process the draws to find consecutive triplets and match against search criteria
      const results: SearchResult[] = [];
      
      if (allDraws) {
        // Sort draws by date (newest first)
        const sortedDraws = [...allDraws].sort((a, b) => 
          new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime()
        );
        
        // Group draws by game
        const drawsByGame: Record<string, any[]> = {};
        
        sortedDraws.forEach(draw => {
          const gameId = draw.lotto_games.id;
          if (!drawsByGame[gameId]) {
            drawsByGame[gameId] = [];
          }
          drawsByGame[gameId].push(draw);
        });
        
        // For each game, find consecutive draw triplets
        Object.values(drawsByGame).forEach(gameDraws => {
          // Process draws in triplets (current, next, and third)
          for (let i = 0; i < gameDraws.length - 2; i++) {
            const currentDraw = gameDraws[i];
            const nextDraw = gameDraws[i + 1];
            const thirdDraw = gameDraws[i + 2];
            
            // Check first row match
            let firstRowMatch = false;
            if (firstRowNums.length >= firstRowMinMatch) {
              const matchCount = firstRowNums.filter(num => 
                currentDraw.numbers.includes(num)
              ).length;
              firstRowMatch = matchCount >= firstRowMinMatch;
            }
            
            // Check second row match
            let secondRowMatch = false;
            if (secondRowNums.length >= secondRowMinMatch) {
              const matchCount = secondRowNums.filter(num => 
                nextDraw.numbers.includes(num)
              ).length;
              secondRowMatch = matchCount >= secondRowMinMatch;
            }
            
            // Check third row match
            let thirdRowMatch = false;
            if (thirdRowNums.length >= thirdRowMinMatch) {
              const matchCount = thirdRowNums.filter(num => 
                thirdDraw.numbers.includes(num)
              ).length;
              thirdRowMatch = matchCount >= thirdRowMinMatch;
            }
            
            // Add to results if any row matches
            if (firstRowMatch || secondRowMatch || thirdRowMatch) {
              results.push({
                id: currentDraw.id,
                game_name: currentDraw.lotto_games.name,
                draw_date: currentDraw.draw_date,
                numbers: currentDraw.numbers,
                draw_number: currentDraw.draw_number,
                next_draw_date: nextDraw.draw_date,
                next_draw_numbers: nextDraw.numbers,
                next_draw_id: nextDraw.id,
                third_draw_date: thirdDraw.draw_date,
                third_draw_numbers: thirdDraw.numbers,
                third_draw_id: thirdDraw.id,
                first_row_matched: firstRowMatch,
                second_row_matched: secondRowMatch,
                third_row_matched: thirdRowMatch
              });
            }
          }
        });
      }
      
      setSearchResults(results);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} matches for your three-row search.`,
      });
      
    } catch (error) {
      console.error('Error performing three-row search:', error);
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
