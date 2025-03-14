
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LottoGame, LottoType } from '@/types/supabase';
import { useThreeRowFormState } from '@/hooks/useThreeRowFormState';
import { ThreeRowFormControls } from '@/components/search/ThreeRowFormControls';

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
        <ThreeRowFormControls
          firstRowNumbers={firstRowNumbers}
          secondRowNumbers={secondRowNumbers}
          thirdRowNumbers={thirdRowNumbers}
          gameTypeId={gameTypeId}
          gameId={gameId}
          availableGames={availableGames}
          firstRowMatchLogic={firstRowMatchLogic}
          secondRowMatchLogic={secondRowMatchLogic}
          thirdRowMatchLogic={thirdRowMatchLogic}
          lottoTypes={lottoTypes}
          isSearching={isSearching}
          isMobile={isMobile}
          onFirstRowNumberChange={handleFirstRowNumberChange}
          onSecondRowNumberChange={handleSecondRowNumberChange}
          onThirdRowNumberChange={handleThirdRowNumberChange}
          onGameTypeChange={(value) => setGameTypeId(value)}
          onGameIdChange={(value) => setGameId(value)}
          onFirstRowMatchLogicChange={setFirstRowMatchLogic}
          onSecondRowMatchLogicChange={setSecondRowMatchLogic}
          onThirdRowMatchLogicChange={setThirdRowMatchLogic}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
