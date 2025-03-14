
import { KnockingMatchLogicType } from "@/types/knockingSearch";

/**
 * Validates and converts row strings to numeric values
 */
export const prepareNumbersArray = (rowNumbers: string[]): number[] => {
  return rowNumbers
    .map(n => n.trim())
    .filter(n => n !== '')
    .map(n => parseInt(n, 10));
};

/**
 * Builds triplets from the input rows for searching
 */
export const buildValidTriplets = (
  firstRowNumbers: string[],
  secondRowNumbers: string[],
  thirdRowNumbers: string[]
): { first: number; second: number; third: number; position: number }[] => {
  const validTriplets: { first: number; second: number; third: number; position: number }[] = [];
  
  for (let i = 0; i < 10; i++) {
    if (i < firstRowNumbers.length && 
        i < secondRowNumbers.length && 
        i < thirdRowNumbers.length && 
        firstRowNumbers[i] && 
        secondRowNumbers[i] &&
        thirdRowNumbers[i]) {
      validTriplets.push({
        first: parseInt(firstRowNumbers[i], 10),
        second: parseInt(secondRowNumbers[i], 10),
        third: parseInt(thirdRowNumbers[i], 10),
        position: i
      });
    }
  }
  
  return validTriplets;
};

/**
 * Find knocking positions based on match logic
 */
export const findKnockingPositions = (
  firstDraw: any, 
  secondDraw: any, 
  thirdDraw: any, 
  validTriplets: { first: number; second: number; third: number; position: number }[], 
  matchLogic: KnockingMatchLogicType
): number[] => {
  const knockingPositions: number[] = [];
  
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
  
  // For diagonal match logic, also check across different positions
  if (matchLogic === 'diagonal') {
    findDiagonalKnockingPositions(firstDraw, secondDraw, thirdDraw, validTriplets, knockingPositions);
  }
  
  return knockingPositions;
};

/**
 * Find diagonal/zebra knocking positions across different positions
 */
const findDiagonalKnockingPositions = (
  firstDraw: any, 
  secondDraw: any, 
  thirdDraw: any, 
  validTriplets: { first: number; second: number; third: number; position: number }[],
  knockingPositions: number[]
): void => {
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
};
