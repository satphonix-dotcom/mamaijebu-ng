
import React from 'react';
import { Button } from '@/components/ui/button';
import { LottoType, LottoGame } from '@/types/supabase';
import { OneRowSearchParams } from '@/hooks/useOneRowSearch';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { MatchLogicSelector } from '@/components/search/MatchLogicSelector';
import { SearchLogicSelector } from '@/components/search/SearchLogicSelector';
import { useOneRowFormState } from '@/hooks/useOneRowFormState';
import { useIsMobile } from '@/hooks/use-mobile';

interface OneRowSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: OneRowSearchParams) => void;
  isSearching: boolean;
}

export function OneRowSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching 
}: OneRowSearchFormProps) {
  const isMobile = useIsMobile();
  const {
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
  } = useOneRowFormState(gamesByType);

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
      searchLogic,
      matchLogic
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Number input rows */}
        <div className="space-y-4">
          <NumberInputRow 
            numbers={successNumbers} 
            onChange={handleSuccessNumberChange} 
            rowLabel="Success Numbers" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={machineNumbers} 
            onChange={handleMachineNumberChange} 
            rowLabel="Machine Numbers" 
            isMobile={isMobile}
          />
        </div>
        
        {/* Game selectors and logic selectors */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
          {/* Game Type and Specific Game selectors */}
          <div className="space-y-4">
            <GameSelectors 
              lottoTypes={lottoTypes}
              availableGames={filteredGames}
              gameTypeId={gameType === 'all' ? null : gameType}
              gameId={specificGame === 'all' ? null : specificGame}
              onGameTypeChange={(value) => {
                setGameType(value);
                setSpecificGame('all');
              }}
              onGameIdChange={setSpecificGame}
              isMobile={isMobile}
            />
          </div>
          
          {/* Logic selectors */}
          <div className="space-y-4">
            <SearchLogicSelector 
              value={searchLogic}
              onChange={setSearchLogic}
              label="Search Logic"
            />
            
            <MatchLogicSelector 
              value={matchLogic}
              onChange={setMatchLogic}
              label="Match Count Logic"
            />
          </div>
        </div>
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
