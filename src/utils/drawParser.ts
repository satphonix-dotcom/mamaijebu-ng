
import { LottoGame } from '@/types/supabase';

export interface Draw {
  drawNumber: string;
  drawDate: string;
  numbers: number[];
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
    const allNumbers = numbersPart.replace('|', ' ')
      .split(' ')
      .filter(n => n.trim() !== '')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));
    
    if (allNumbers.length > 0) {
      draws.push({
        drawNumber,
        drawDate: formatDate(drawDate),
        numbers: allNumbers
      });
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

  return {
    valid: errors.length === 0,
    errors
  };
};
