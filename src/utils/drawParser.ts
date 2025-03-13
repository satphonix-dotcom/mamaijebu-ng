
import { LottoGame } from '@/types/supabase';

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
    // Extract data using regex or split
    // Format: 3245: 04/01/2025: 75 30 55 64 23 | 52 47 82 73 80
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
        .filter(n => !isNaN(n))
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
        draw.extraNumbers = numberSets[1];
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
export const validateDraw = (draw: Draw, game: LottoGame): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Get the lottery type configuration if available
  const lottoTypeConfig = game.lotto_types?.configuration;
  
  if (lottoTypeConfig && lottoTypeConfig.has_multiple_sets) {
    // For games with multiple number sets like EuroMillions
    const mainNumbers = draw.mainNumbers || [];
    const extraNumbers = draw.extraNumbers || [];
    
    // Validate main numbers
    if (mainNumbers.length !== lottoTypeConfig.main_numbers.count) {
      errors.push(`Draw ${draw.drawNumber} has ${mainNumbers.length} main numbers but requires ${lottoTypeConfig.main_numbers.count}`);
    }
    
    const invalidMainNumbers = mainNumbers.filter(
      n => n < lottoTypeConfig.main_numbers.min || n > lottoTypeConfig.main_numbers.max
    );
    
    if (invalidMainNumbers.length > 0) {
      errors.push(`Draw ${draw.drawNumber} has main numbers outside the range: ${invalidMainNumbers.join(', ')}`);
    }
    
    // Validate extra numbers
    if (extraNumbers.length !== lottoTypeConfig.extra_numbers.count) {
      errors.push(`Draw ${draw.drawNumber} has ${extraNumbers.length} extra numbers but requires ${lottoTypeConfig.extra_numbers.count}`);
    }
    
    const invalidExtraNumbers = extraNumbers.filter(
      n => n < lottoTypeConfig.extra_numbers.min || n > lottoTypeConfig.extra_numbers.max
    );
    
    if (invalidExtraNumbers.length > 0) {
      errors.push(`Draw ${draw.drawNumber} has extra numbers outside the range: ${invalidExtraNumbers.join(', ')}`);
    }
  } else {
    // Fallback to old validation for games without detailed configuration
    // Validate number count
    if (draw.numbers.length !== game.ball_count) {
      errors.push(`Draw ${draw.drawNumber} has ${draw.numbers.length} balls but game requires ${game.ball_count}`);
    }

    // Validate number range
    const invalidNumbers = draw.numbers.filter(
      n => n < game.min_number || n > game.max_number
    );
    
    if (invalidNumbers.length > 0) {
      errors.push(`Draw ${draw.drawNumber} has numbers outside the allowed range: ${invalidNumbers.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
