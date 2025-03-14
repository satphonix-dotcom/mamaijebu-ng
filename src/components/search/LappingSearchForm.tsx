
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { useLappingFormState } from '@/hooks/useLappingFormState';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { LappingMatchLogicSelector } from '@/components/search/LappingMatchLogicSelector';

interface LappingSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: any) => void;
  isSearching: boolean;
  isMobile?: boolean;
}

export function LappingSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching,
  isMobile = false
}: LappingSearchFormProps) {
  const {
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
  } = useLappingFormState(gamesByType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      firstRowNumbers,
      secondRowNumbers,
      gameTypeId,
      gameId,
      matchLogic
    });
  };

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'pt-6'}`}>
        <form onSubmit={handleSubmit} className={`space-y-4 ${isMobile ? 'w-full' : 'space-y-6'}`}>
          {/* Lapping explanation */}
          <div className="text-sm text-muted-foreground mb-4">
            <p>Enter matching number pairs in the same position across both rows. The system will search for draws where these number pairs appear in consecutive draws.</p>
          </div>
          
          {/* Number Input Rows */}
          <NumberInputRow 
            numbers={firstRowNumbers} 
            onChange={handleFirstRowNumberChange} 
            rowLabel="First Draw Numbers" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={secondRowNumbers} 
            onChange={handleSecondRowNumberChange} 
            rowLabel="Next Draw Numbers" 
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

          {/* Match Logic Selector */}
          <LappingMatchLogicSelector
            value={matchLogic}
            onChange={setMatchLogic}
            isMobile={isMobile}
          />

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
