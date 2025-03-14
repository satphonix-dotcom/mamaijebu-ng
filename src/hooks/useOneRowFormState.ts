
import { useState } from 'react';
import { LottoGame } from '@/types/supabase';
import { SearchLogicType, MatchLogicType } from '@/hooks/useOneRowSearch';

export function useOneRowFormState(gamesByType: {[key: string]: LottoGame[]}) {
  const [successNumbers, setSuccessNumbers] = useState<string[]>(Array(5).fill(''));
  const [machineNumbers, setMachineNumbers] = useState<string[]>(Array(5).fill(''));
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [searchLogic, setSearchLogic] = useState<SearchLogicType>('both');
  const [matchLogic, setMatchLogic] = useState<MatchLogicType>('any');

  // Filter games based on selected type
  const filteredGames = gameType === 'all' 
    ? [] // No need to show all games in dropdown when "all" is selected 
    : gamesByType[gameType] || [];

  const handleSuccessNumberChange = (index: number, value: string) => {
    const newNumbers = [...successNumbers];
    newNumbers[index] = value;
    setSuccessNumbers(newNumbers);
  };

  const handleMachineNumberChange = (index: number, value: string) => {
    const newNumbers = [...machineNumbers];
    newNumbers[index] = value;
    setMachineNumbers(newNumbers);
  };

  const handleClear = () => {
    setSuccessNumbers(Array(5).fill(''));
    setMachineNumbers(Array(5).fill(''));
    setGameType('all');
    setSpecificGame('all');
    setSearchLogic('both');
    setMatchLogic('any');
  };

  return {
    successNumbers,
    machineNumbers,
    gameType,
    specificGame,
    searchLogic,
    matchLogic,
    filteredGames,
    setGameType,
    setSpecificGame,
    setSearchLogic,
    setMatchLogic,
    handleSuccessNumberChange,
    handleMachineNumberChange,
    handleClear
  };
}
