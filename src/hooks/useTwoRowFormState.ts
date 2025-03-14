
import { useState, useEffect } from 'react';
import { LottoGame } from '@/types/supabase';
import { MatchLogicType } from '@/hooks/useTwoRowSearch';

export function useTwoRowFormState(gamesByType: {[key: string]: LottoGame[]}) {
  const [firstRowNumbers, setFirstRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [secondRowNumbers, setSecondRowNumbers] = useState<string[]>(Array(10).fill(''));
  const [gameTypeId, setGameTypeId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [availableGames, setAvailableGames] = useState<LottoGame[]>([]);
  const [firstRowMatchLogic, setFirstRowMatchLogic] = useState<MatchLogicType>('two');
  const [secondRowMatchLogic, setSecondRowMatchLogic] = useState<MatchLogicType>('two');

  // Update available games when game type changes
  useEffect(() => {
    if (gameTypeId && gamesByType[gameTypeId]) {
      setAvailableGames(gamesByType[gameTypeId]);
      setGameId(null); // Reset game selection when type changes
    } else {
      setAvailableGames([]);
      setGameId(null);
    }
  }, [gameTypeId, gamesByType]);

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
    availableGames,
    firstRowMatchLogic,
    secondRowMatchLogic,
    setGameTypeId,
    setGameId,
    setFirstRowMatchLogic,
    setSecondRowMatchLogic,
    handleFirstRowNumberChange,
    handleSecondRowNumberChange
  };
}
