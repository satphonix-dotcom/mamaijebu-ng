
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { useKnockingFormState } from '@/hooks/useKnockingFormState';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { KnockingMatchLogicSelector } from '@/components/search/KnockingMatchLogicSelector';

interface KnockingSearchFormProps {
  lottoTypes: LottoType[];
  games: LottoGame[];
  gamesByType: {[key: string]: LottoGame[]};
  onSearch: (params: any) => void;
  isSearching: boolean;
  isMobile?: boolean;
}

export function KnockingSearchForm({ 
  lottoTypes, 
  games, 
  gamesByType, 
  onSearch, 
  isSearching,
  isMobile = false
}: KnockingSearchFormProps) {
  const {
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
  } = useKnockingFormState(gamesByType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      firstRowNumbers,
      secondRowNumbers,
      thirdRowNumbers,
      gameTypeId,
      gameId,
      matchLogic
    });
  };

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'pt-6'}`}>
        <form onSubmit={handleSubmit} className={`space-y-4 ${isMobile ? 'w-full' : 'space-y-6'}`}>
          {/* Knocking explanation */}
          <div className="text-sm text-muted-foreground mb-4">
            <p>Enter matching number triplets across three rows. The system will search for draws where these number patterns appear in three consecutive draws.</p>
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
            rowLabel="Second Draw Numbers" 
            isMobile={isMobile}
          />
          
          <NumberInputRow 
            numbers={thirdRowNumbers} 
            onChange={handleThirdRowNumberChange} 
            rowLabel="Third Draw Numbers" 
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
          <KnockingMatchLogicSelector
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
