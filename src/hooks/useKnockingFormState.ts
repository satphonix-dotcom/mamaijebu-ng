
import { useState } from 'react';
import { KnockingMatchLogicType } from './useKnockingSearch';
import { LottoGame } from '@/types/supabase';

export const useKnockingFormState = (gamesByType: {[key: string]: LottoGame[]}) => {
  // Initialize with 10 empty strings for each row
  const [firstRowNumbers, setFirstRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [secondRowNumbers, setSecondRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [thirdRowNumbers, setThirdRowNumbers] = useState<string[]>(Array(10).fill(''));
  
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [matchLogic, setMatchLogic] = useState<KnockingMatchLogicType>('vertical');
  
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

  const handleThirdRowNumberChange = (index: number, value: string) => {
    const newNumbers = [...thirdRowNumbers];
    newNumbers[index] = value;
    setThirdRowNumbers(newNumbers);
  };

  return {
    firstRowNumbers,
    secondRowNumbers,
    thirdRowNumbers,
    gameTypeId,
    gameId,
    matchLogic,
    availableGames,
    setGameTypeId,
    setGameId,
    setMatchLogic,
    handleFirstRowNumberChange,
    handleSecondRowNumberChange,
    handleThirdRowNumberChange
  };
};
