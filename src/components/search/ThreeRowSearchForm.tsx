
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { useThreeRowFormState } from '@/hooks/useThreeRowFormState';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { MatchLogicSelector } from '@/components/search/MatchLogicSelector';

interface ThreeRowSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: any) => void;
  isSearching: boolean;
  isMobile?: boolean;
}

export function ThreeRowSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching,
  isMobile = false
}: ThreeRowSearchFormProps) {
  const {
    firstRowNumbers,
    secondRowNumbers,
    thirdRowNumbers,
    gameTypeId,
    gameId,
    availableGames,
    firstRowMatchLogic,
    secondRowMatchLogic,
    thirdRowMatchLogic,
    setGameTypeId,
    setGameId,
    setFirstRowMatchLogic,
    setSecondRowMatchLogic,
    setThirdRowMatchLogic,
    handleFirstRowNumberChange,
    handleSecondRowNumberChange,
    handleThirdRowNumberChange
  } = useThreeRowFormState(gamesByType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      firstRowNumbers,
      secondRowNumbers,
      thirdRowNumbers,
      gameTypeId,
      gameId,
      firstRowMatchLogic,
      secondRowMatchLogic,
      thirdRowMatchLogic
    });
  };

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'pt-6'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number Input Rows */}
          <NumberInputRow 
            numbers={firstRowNumbers} 
            onChange={handleFirstRowNumberChange} 
            rowLabel="First Row Numbers" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={secondRowNumbers} 
            onChange={handleSecondRowNumberChange} 
            rowLabel="Second Row Numbers" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={thirdRowNumbers} 
            onChange={handleThirdRowNumberChange} 
            rowLabel="Third Row Numbers" 
            isMobile={isMobile}
          />

          {/* Game Type and Game Selectors */}
          <GameSelectors 
            lottoTypes={lottoTypes}
            availableGames={availableGames}
            gameTypeId={gameTypeId}
            gameId={gameId}
            onGameTypeChange={(value) => setGameTypeId(value || null)}
            onGameIdChange={(value) => setGameId(value || null)}
            isMobile={isMobile}
          />

          {/* Match Logic Selectors */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
            <MatchLogicSelector 
              value={firstRowMatchLogic}
              onChange={setFirstRowMatchLogic}
              label="@row1 (Match in First Row)"
            />
            
            <MatchLogicSelector 
              value={secondRowMatchLogic}
              onChange={setSecondRowMatchLogic}
              label="@row2 (Match in Second Row)"
            />
            
            <MatchLogicSelector 
              value={thirdRowMatchLogic}
              onChange={setThirdRowMatchLogic}
              label="@row3 (Match in Third Row)"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
