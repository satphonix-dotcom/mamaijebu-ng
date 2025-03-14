
import { useState } from 'react';
import { LappingMatchLogicType } from './useLappingSearch';
import { LottoGame } from '@/types/supabase';

export const useLappingFormState = (gamesByType: {[key: string]: LottoGame[]}) => {
  // Initialize with 10 empty strings for each row
  const [firstRowNumbers, setFirstRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [secondRowNumbers, setSecondRowNumbers] = useState<string[]>(Array(10).fill(''));
  
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [matchLogic, setMatchLogic] = useState<LappingMatchLogicType>('random');
  
  // Available games based on selected game type
  const availableGames = gameTypeId ? (gamesByType[gameTypeId] || []) : [];

  // Handlers for number inputs
  const handleFirstRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...firstRowNumbers];
    newNumbers[index] = value;
    setFirstRowNumbers(newNumbers);
  };

  const handleSecondRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...secondRowNumbers];
    newNumbers[index] = value;
    setSecondRowNumbers(newNumbers);
  };

  return {
    firstRowNumbers,
    secondRowNumbers,
    gameTypeId,
    gameId,
    matchLogic,
    availableGames,
    setGameTypeId,
    setGameId,
    setMatchLogic,
    handleFirstRowNumberChange,
    handleSecondRowNumberChange
  };
};
