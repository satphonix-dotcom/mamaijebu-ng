
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type KnockingMatchLogicType = 'vertical' | 'diagonal';

export interface KnockingSearchParams {
  firstRowNumbers: string[];
  secondRowNumbers: string[];
  thirdRowNumbers: string[];
  gameTypeId: string | null;
  gameId: string | null;
  matchLogic: KnockingMatchLogicType;
}

export interface KnockingSearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  draw_number?: string;
  first_numbers: number[];
  second_numbers: number[]; // numbers from the second draw
  third_numbers: number[]; // numbers from the third draw
  knocking_positions: number[]; // positions where knocking occurred
}

export const useKnockingSearch = () => {
  const [searchResults, setSearchResults] = useState<KnockingSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (params: KnockingSearchParams) => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      // Prepare the numbers arrays - filter out empty strings and convert to numbers
      const firstRowNumeric = params.firstRowNumbers
        .map(n => n.trim())
        .filter(n => n !== '')
        .map(n => parseInt(n, 10));
      
      const secondRowNumeric = params.secondRowNumbers
        .map(n => n.trim())
        .filter(n => n !== '')
        .map(n => parseInt(n, 10));
        
      const thirdRowNumeric = params.thirdRowNumbers
        .map(n => n.trim())
        .filter(n => n !== '')
        .map(n => parseInt(n, 10));

      // Ensure we have matching triplets
      const validTriplets: { first: number; second: number; third: number; position: number }[] = [];
      
      for (let i = 0; i < 10; i++) {
        if (i < params.firstRowNumbers.length && 
            i < params.secondRowNumbers.length && 
            i < params.thirdRowNumbers.length && 
            params.firstRowNumbers[i] && 
            params.secondRowNumbers[i] &&
            params.thirdRowNumbers[i]) {
          validTriplets.push({
            first: parseInt(params.firstRowNumbers[i], 10),
            second: parseInt(params.secondRowNumbers[i], 10),
            third: parseInt(params.thirdRowNumbers[i], 10),
            position: i
          });
        }
      }

      if (validTriplets.length === 0) {
        setIsSearching(false);
        return;
      }

      // Query for draws
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
            lotto_type_id
          )
        `)
        .order('draw_date', { ascending: false });

      // Filter by game type if specified
      if (params.gameTypeId) {
        query = query.eq('lotto_games.lotto_type_id', params.gameTypeId);
      }

      // Further filter by specific game if specified
      if (params.gameId) {
        query = query.eq('lotto_games.id', params.gameId);
      }

      const { data: draws, error } = await query;

      if (error) {
        console.error('Error searching draws:', error);
        setIsSearching(false);
        return;
      }

      // Group draws by game and sort by date to find consecutive triplets
      const drawsByGame: Record<string, any[]> = {};
      draws?.forEach(draw => {
        const gameId = draw.lotto_games.id;
        if (!drawsByGame[gameId]) {
          drawsByGame[gameId] = [];
        }
        drawsByGame[gameId].push(draw);
      });

      // For each game, find consecutive draw triplets and check for knocking numbers
      const results: KnockingSearchResult[] = [];

      Object.values(drawsByGame).forEach(gameDraw => {
        // Sort draws by date (newest first)
        gameDraw.sort((a, b) => new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime());

        // Check consecutive triplets
        for (let i = 0; i < gameDraw.length - 2; i++) {
          const firstDraw = gameDraw[i];
          const secondDraw = gameDraw[i+1];
          const thirdDraw = gameDraw[i+2];
          
          // Find knocking numbers based on the selected match logic
          const knockingPositions: number[] = [];
          
          if (params.matchLogic === 'vertical') {
            // Check for vertical knocking (same position across all three draws)
            validTriplets.forEach(triplet => {
              if (triplet.position < firstDraw.numbers.length && 
                  triplet.position < secondDraw.numbers.length &&
                  triplet.position < thirdDraw.numbers.length &&
                  firstDraw.numbers[triplet.position] === triplet.first && 
                  secondDraw.numbers[triplet.position] === triplet.second &&
                  thirdDraw.numbers[triplet.position] === triplet.third) {
                knockingPositions.push(triplet.position);
              }
            });
          } else if (params.matchLogic === 'diagonal') {
            // Check for vertical knocking first
            validTriplets.forEach(triplet => {
              if (triplet.position < firstDraw.numbers.length && 
                  triplet.position < secondDraw.numbers.length &&
                  triplet.position < thirdDraw.numbers.length &&
                  firstDraw.numbers[triplet.position] === triplet.first && 
                  secondDraw.numbers[triplet.position] === triplet.second &&
                  thirdDraw.numbers[triplet.position] === triplet.third) {
                knockingPositions.push(triplet.position);
              }
            });
            
            // Then check for diagonal/zebra knocking (different positions across draws)
            validTriplets.forEach(triplet => {
              for (let pos1 = 0; pos1 < firstDraw.numbers.length; pos1++) {
                if (firstDraw.numbers[pos1] === triplet.first) {
                  for (let pos2 = 0; pos2 < secondDraw.numbers.length; pos2++) {
                    if (pos1 !== pos2 && secondDraw.numbers[pos2] === triplet.second) {
                      for (let pos3 = 0; pos3 < thirdDraw.numbers.length; pos3++) {
                        if (pos3 !== pos2 && pos3 !== pos1 && thirdDraw.numbers[pos3] === triplet.third) {
                          // Mark all three positions
                          if (!knockingPositions.includes(pos1)) knockingPositions.push(pos1);
                          if (!knockingPositions.includes(pos2)) knockingPositions.push(pos2);
                          if (!knockingPositions.includes(pos3)) knockingPositions.push(pos3);
                        }
                      }
                    }
                  }
                }
              }
            });
          }
          
          // If we found any knocking numbers, add to results
          if (knockingPositions.length > 0) {
            results.push({
              id: firstDraw.id,
              game_name: firstDraw.lotto_games.name,
              draw_date: firstDraw.draw_date,
              draw_number: firstDraw.draw_number,
              first_numbers: firstDraw.numbers,
              second_numbers: secondDraw.numbers,
              third_numbers: thirdDraw.numbers,
              knocking_positions: knockingPositions
            });
          }
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error in knocking search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    isSearching,
    performSearch
  };
};
