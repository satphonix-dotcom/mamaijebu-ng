
import { LottoGame, LottoType } from '@/types/supabase';

export interface Draw {
  drawNumber: string;
  drawDate: string;
  numbers: number[];
  mainNumbers?: number[];
  extraNumbers?: number[];
}

/**
 * Parse raw draw data text into structured Draw objects
 */
export const parseDraws = (text: string): Draw[] => {
  const draws: Draw[] = [];
  
  // Split by lines and process each line
  const lines = text.trim().split('\n');
  
  for (const line of lines) {
    // Format: 0001: 29/09/1962: 41 89 80 62 45 | 00 00 00 00 00
    const parts = line.split(':').map(part => part.trim());
    
    if (parts.length < 3) continue;
    
    const drawNumber = parts[0];
    const drawDate = parts[1];
    
    // Extract all numbers, including those after the pipe symbol
    const numbersPart = parts.slice(2).join(':');
    
    // Check if there's a pipe symbol indicating multiple sets
    const numberSets = numbersPart.split('|').map(set => 
      set.trim().split(' ')
        .filter(n => n.trim() !== '')
        .map(n => parseInt(n.trim(), 10))
        .filter(n => !isNaN(n) && n !== 0) // Filter out zeros and NaN values
    );
    
    // All numbers combined (for backward compatibility)
    const allNumbers = numberSets.flat();
    
    if (allNumbers.length > 0) {
      const draw: Draw = {
        drawNumber,
        drawDate: formatDate(drawDate),
        numbers: allNumbers
      };
      
      // If we have multiple sets, store them separately
      if (numberSets.length > 1) {
        draw.mainNumbers = numberSets[0];
        draw.extraNumbers = numberSets[1].filter(n => n !== 0); // Remove zeros
      }
      
      draws.push(draw);
    }
  }
  
  return draws;
};

/**
 * Convert date format from DD/MM/YYYY to YYYY-MM-DD
 */
export const formatDate = (dateStr: string): string => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

/**
 * Validate a draw against game rules
 */
export const validateDraw = (draw: Draw, game: LottoGame & { lotto_type?: LottoType }): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // We'll validate only the main numbers for now, ignoring zeros in extra numbers
  const effectiveNumbers = draw.mainNumbers || draw.numbers;
  
  // Validate number count against game configuration
  if (effectiveNumbers.length !== game.ball_count) {
    errors.push(`Draw ${draw.drawNumber} has ${effectiveNumbers.length} balls but game requires ${game.ball_count}`);
  }

  // Validate number range against game configuration
  const invalidNumbers = effectiveNumbers.filter(
    n => n < game.min_number || n > game.max_number
  );
  
  if (invalidNumbers.length > 0) {
    errors.push(`Draw ${draw.drawNumber} has numbers outside the allowed range: ${invalidNumbers.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
