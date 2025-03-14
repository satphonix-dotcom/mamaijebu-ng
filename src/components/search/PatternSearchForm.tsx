
import React from 'react';
import { Button } from '@/components/ui/button';
import { LottoType, LottoGame } from '@/types/supabase';
import { usePatternSearchFormState } from '@/hooks/usePatternSearchFormState';
import { PatternNumberInputs } from '@/components/search/PatternNumberInputs';
import { PatternSelectors } from '@/components/search/PatternSelectors';

interface PatternSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: {
    successNumbers: string[];
    machineNumbers: string[];
    gameTypeId: string | null;
    gameId: string | null;
    year: string;
  }) => void;
  isSearching: boolean;
}

export function PatternSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching 
}: PatternSearchFormProps) {
  const {
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
  } = usePatternSearchFormState(gamesByType);
  
  // Available years (last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 10}, (_, i) => (currentYear - i).toString());

  const handleSearch = () => {
    // Validate at least one number is entered
    if ([...successNumbers, ...machineNumbers].every(n => !n)) {
      alert('Please enter at least one number');
      return;
    }

    // Validate numbers are within range 1-99
    const allNumbers = [...successNumbers, ...machineNumbers].filter(Boolean);
    const invalidNumbers = allNumbers.some(n => {
      const num = parseInt(n, 10);
      return isNaN(num) || num < 1 || num > 99;
    });

    if (invalidNumbers) {
      alert('All numbers must be between 1 and 99');
      return;
    }

    onSearch({
      successNumbers,
      machineNumbers,
      gameTypeId: gameType === 'all' ? null : gameType,
      gameId: specificGame === 'all' ? null : specificGame,
      year
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Number input boxes */}
        <PatternNumberInputs 
          successNumbers={successNumbers}
          machineNumbers={machineNumbers}
          onSuccessNumberChange={handleSuccessNumberChange}
          onMachineNumberChange={handleMachineNumberChange}
        />
        
        {/* Game and year selectors */}
        <PatternSelectors 
          lottoTypes={lottoTypes}
          filteredGames={filteredGames}
          gameType={gameType}
          specificGame={specificGame}
          year={year}
          years={years}
          onGameTypeChange={(value) => {
            setGameType(value);
            setSpecificGame('all');
          }}
          onSpecificGameChange={setSpecificGame}
          onYearChange={setYear}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
