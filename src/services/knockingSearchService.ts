
import { supabase } from "@/integrations/supabase/client";
import { KnockingSearchParams, KnockingSearchResult } from "@/types/knockingSearch";
import { buildValidTriplets, findKnockingPositions } from "@/utils/knockingSearchUtils";

/**
 * Fetches and processes knocking search data from Supabase
 */
export const fetchKnockingSearchResults = async (
  params: KnockingSearchParams
): Promise<KnockingSearchResult[]> => {
  // Build valid triplets
  const validTriplets = buildValidTriplets(
    params.firstRowNumbers,
    params.secondRowNumbers,
    params.thirdRowNumbers
  );

  if (validTriplets.length === 0) {
    return [];
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
    return [];
  }

  return processKnockingSearchResults(draws || [], validTriplets, params);
};

/**
 * Process the raw draw data into knocking search results
 */
const processKnockingSearchResults = (
  draws: any[],
  validTriplets: { first: number; second: number; third: number; position: number }[],
  params: KnockingSearchParams
): KnockingSearchResult[] => {
  // Group draws by game and sort by date to find consecutive triplets
  const drawsByGame: Record<string, any[]> = {};
  draws.forEach(draw => {
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
      const knockingPositions = findKnockingPositions(
        firstDraw, 
        secondDraw, 
        thirdDraw, 
        validTriplets, 
        params.matchLogic
      );
      
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

  return results;
};
