
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LappingMatchLogicType = 'random' | 'positional' | 'position-random-zebra' | 'match-two-lapping' | 'match-two-diagonal';

export interface LappingSearchParams {
  firstRowNumbers: string[];
  secondRowNumbers: string[];
  gameTypeId: string | null;
  gameId: string | null;
  matchLogic: LappingMatchLogicType;
}

export interface LappingSearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  draw_number?: string;
  numbers: number[];
  next_numbers: number[]; // numbers from the next draw
  lapping_positions: number[]; // positions where lapping occurred
}

export const useLappingSearch = () => {
  const [searchResults, setSearchResults] = useState<LappingSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (params: LappingSearchParams) => {
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

      // Ensure we have matching pairs
      const validPairs: { first: number; second: number; position: number }[] = [];
      
      for (let i = 0; i < 10; i++) {
        if (i < params.firstRowNumbers.length && 
            i < params.secondRowNumbers.length && 
            params.firstRowNumbers[i] && 
            params.secondRowNumbers[i]) {
          validPairs.push({
            first: parseInt(params.firstRowNumbers[i], 10),
            second: parseInt(params.secondRowNumbers[i], 10),
            position: i
          });
        }
      }

      if (validPairs.length === 0) {
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

      // Group draws by game and sort by date to find consecutive pairs
      const drawsByGame: Record<string, any[]> = {};
      draws?.forEach(draw => {
        const gameId = draw.lotto_games.id;
        if (!drawsByGame[gameId]) {
          drawsByGame[gameId] = [];
        }
        drawsByGame[gameId].push(draw);
      });

      // For each game, find consecutive draw pairs and check for lapping numbers
      const results: LappingSearchResult[] = [];

      Object.values(drawsByGame).forEach(gameDraw => {
        // Sort draws by date (newest first)
        gameDraw.sort((a, b) => new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime());

        // Check consecutive pairs
        for (let i = 0; i < gameDraw.length - 1; i++) {
          const currentDraw = gameDraw[i];
          const nextDraw = gameDraw[i+1];
          
          // Find lapping numbers based on the selected match logic
          const lappingPositions: number[] = [];
          
          switch (params.matchLogic) {
            case 'positional':
              // Check for lapping at the exact positions specified
              validPairs.forEach(pair => {
                if (pair.position < currentDraw.numbers.length && 
                    pair.position < nextDraw.numbers.length &&
                    currentDraw.numbers[pair.position] === pair.first && 
                    nextDraw.numbers[pair.position] === pair.second) {
                  lappingPositions.push(pair.position);
                }
              });
              break;
              
            case 'random':
              // Check for lapping at any position
              validPairs.forEach(pair => {
                for (let pos = 0; pos < currentDraw.numbers.length; pos++) {
                  if (pos < nextDraw.numbers.length &&
                      currentDraw.numbers[pos] === pair.first && 
                      nextDraw.numbers[pos] === pair.second) {
                    lappingPositions.push(pos);
                    break; // Only count each pair once
                  }
                }
              });
              break;
              
            case 'position-random-zebra':
              // Combination of positional and random
              validPairs.forEach(pair => {
                // Positional check
                if (pair.position < currentDraw.numbers.length && 
                    pair.position < nextDraw.numbers.length &&
                    currentDraw.numbers[pair.position] === pair.first && 
                    nextDraw.numbers[pair.position] === pair.second) {
                  lappingPositions.push(pair.position);
                }
                
                // Random check (any position)
                for (let pos = 0; pos < currentDraw.numbers.length; pos++) {
                  if (pos < nextDraw.numbers.length &&
                      currentDraw.numbers[pos] === pair.first && 
                      nextDraw.numbers[pos] === pair.second &&
                      !lappingPositions.includes(pos)) {
                    lappingPositions.push(pos);
                  }
                }
                
                // Zebra/diagonal check (numbers not directly above each other)
                for (let pos1 = 0; pos1 < currentDraw.numbers.length; pos1++) {
                  for (let pos2 = 0; pos2 < nextDraw.numbers.length; pos2++) {
                    if (pos1 !== pos2 && // Different positions (diagonal)
                        currentDraw.numbers[pos1] === pair.first && 
                        nextDraw.numbers[pos2] === pair.second) {
                      // Mark both positions
                      if (!lappingPositions.includes(pos1)) lappingPositions.push(pos1);
                      if (!lappingPositions.includes(pos2)) lappingPositions.push(pos2);
                    }
                  }
                }
              });
              break;
              
            case 'match-two-lapping':
              // Must have at least 2 lapping numbers in the same positions
              const verticalPairs: number[] = [];
              validPairs.forEach(pair => {
                for (let pos = 0; pos < currentDraw.numbers.length; pos++) {
                  if (pos < nextDraw.numbers.length &&
                      currentDraw.numbers[pos] === pair.first && 
                      nextDraw.numbers[pos] === pair.second) {
                    verticalPairs.push(pos);
                  }
                }
              });
              
              // Only include if we have at least 2 lapping numbers
              if (verticalPairs.length >= 2) {
                lappingPositions.push(...verticalPairs);
              }
              break;
              
            case 'match-two-diagonal':
              // Must have at least 2 diagonal lapping pairs
              const diagonalPairs: [number, number][] = [];
              validPairs.forEach(pair => {
                for (let pos1 = 0; pos1 < currentDraw.numbers.length; pos1++) {
                  for (let pos2 = 0; pos2 < nextDraw.numbers.length; pos2++) {
                    if (pos1 !== pos2 && // Different positions (diagonal)
                        currentDraw.numbers[pos1] === pair.first && 
                        nextDraw.numbers[pos2] === pair.second) {
                      diagonalPairs.push([pos1, pos2]);
                    }
                  }
                }
              });
              
              // Only include if we have at least 2 diagonal pairs
              if (diagonalPairs.length >= 2) {
                diagonalPairs.forEach(([pos1, pos2]) => {
                  if (!lappingPositions.includes(pos1)) lappingPositions.push(pos1);
                  if (!lappingPositions.includes(pos2)) lappingPositions.push(pos2);
                });
              }
              break;
          }
          
          // If we found any lapping numbers, add to results
          if (lappingPositions.length > 0) {
            results.push({
              id: currentDraw.id,
              game_name: currentDraw.lotto_games.name,
              draw_date: currentDraw.draw_date,
              draw_number: currentDraw.draw_number,
              numbers: currentDraw.numbers,
              next_numbers: nextDraw.numbers,
              lapping_positions: lappingPositions
            });
          }
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error in lapping search:', error);
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
