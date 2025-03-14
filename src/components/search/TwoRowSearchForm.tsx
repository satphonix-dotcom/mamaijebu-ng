
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { TwoRowSearchParams } from '@/hooks/useTwoRowSearch';
import { useTwoRowFormState } from '@/hooks/useTwoRowFormState';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { MatchLogicSelector } from '@/components/search/MatchLogicSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface TwoRowSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: TwoRowSearchParams) => void;
  isSearching: boolean;
}

export function TwoRowSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching 
}: TwoRowSearchFormProps) {
  const isMobile = useIsMobile();
  const {
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
  } = useTwoRowFormState(gamesByType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      firstRowNumbers,
      secondRowNumbers,
      gameTypeId,
      gameId,
      firstRowMatchLogic,
      secondRowMatchLogic
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
            rowLabel="First Row Numbers (Enter numbers for the first draw)" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={secondRowNumbers} 
            onChange={handleSecondRowNumberChange} 
            rowLabel="Second Row Numbers (Enter numbers for the next draw)" 
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
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
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
