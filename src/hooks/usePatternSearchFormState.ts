
import { useState } from 'react';
import { LottoGame } from '@/types/supabase';

interface PatternSearchFormState {
  successNumbers: string[];
  machineNumbers: string[];
  gameType: string;
  specificGame: string;
  year: string;
}

export function usePatternSearchFormState(gamesByType: {[key: string]: LottoGame[]}) {
  const [successNumbers, setSuccessNumbers] = useState<string[]>(Array(5).fill(''));
  const [machineNumbers, setMachineNumbers] = useState<string[]>(Array(5).fill(''));
  const [gameType, setGameType] = useState('all');
  const [specificGame, setSpecificGame] = useState('all');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Filter games based on selected type
  const filteredGames = gameType === 'all' 
    ? [] 
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
    setYear(new Date().getFullYear().toString());
  };

  return {
    successNumbers,
    machineNumbers,
    gameType,
    specificGame,
    year,
    filteredGames,
    setGameType,
    setSpecificGame,
    setYear,
    handleSuccessNumberChange,
    handleMachineNumberChange,
    handleClear
  };
}
