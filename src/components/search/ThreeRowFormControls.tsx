
import React from 'react';
import { Button } from '@/components/ui/button';
import { MatchLogicType } from '@/hooks/useThreeRowSearch';
import { NumberInputRow } from '@/components/search/NumberInputRow';
import { GameSelectors } from '@/components/search/GameSelectors';
import { MatchLogicSelector } from '@/components/search/MatchLogicSelector';
import { LottoGame, LottoType } from '@/types/supabase';

interface ThreeRowFormControlsProps {
  firstRowNumbers: string[];
  secondRowNumbers: string[];
  thirdRowNumbers: string[];
  gameTypeId: string | null;
  gameId: string | null;
  availableGames: LottoGame[];
  firstRowMatchLogic: MatchLogicType;
  secondRowMatchLogic: MatchLogicType;
  thirdRowMatchLogic: MatchLogicType;
  lottoTypes: LottoType[];
  isSearching: boolean;
  isMobile: boolean;
  onFirstRowNumberChange: (index: number, value: string) => void;
  onSecondRowNumberChange: (index: number, value: string) => void;
  onThirdRowNumberChange: (index: number, value: string) => void;
  onGameTypeChange: (value: string | null) => void;
  onGameIdChange: (value: string | null) => void;
  onFirstRowMatchLogicChange: (value: MatchLogicType) => void;
  onSecondRowMatchLogicChange: (value: MatchLogicType) => void;
  onThirdRowMatchLogicChange: (value: MatchLogicType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ThreeRowFormControls: React.FC<ThreeRowFormControlsProps> = ({
  firstRowNumbers,
  secondRowNumbers,
  thirdRowNumbers,
  gameTypeId,
  gameId,
  availableGames,
  firstRowMatchLogic,
  secondRowMatchLogic,
  thirdRowMatchLogic,
  lottoTypes,
  isSearching,
  isMobile,
  onFirstRowNumberChange,
  onSecondRowNumberChange,
  onThirdRowNumberChange,
  onGameTypeChange,
  onGameIdChange,
  onFirstRowMatchLogicChange,
  onSecondRowMatchLogicChange,
  onThirdRowMatchLogicChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Number Input Rows */}
      <NumberInputRow 
        numbers={firstRowNumbers} 
        onChange={onFirstRowNumberChange} 
        rowLabel="First Row Numbers" 
        isMobile={isMobile}
      />
      
      <NumberInputRow 
        numbers={secondRowNumbers} 
        onChange={onSecondRowNumberChange} 
        rowLabel="Second Row Numbers" 
        isMobile={isMobile}
      />
      
      <NumberInputRow 
        numbers={thirdRowNumbers} 
        onChange={onThirdRowNumberChange} 
        rowLabel="Third Row Numbers" 
        isMobile={isMobile}
      />

      {/* Game Type and Game Selectors */}
      <GameSelectors 
        lottoTypes={lottoTypes}
        availableGames={availableGames}
        gameTypeId={gameTypeId}
        gameId={gameId}
        onGameTypeChange={onGameTypeChange}
        onGameIdChange={onGameIdChange}
        isMobile={isMobile}
      />

      {/* Match Logic Selectors */}
      <ThreeRowMatchLogicSelectors
        firstRowMatchLogic={firstRowMatchLogic}
        secondRowMatchLogic={secondRowMatchLogic}
        thirdRowMatchLogic={thirdRowMatchLogic}
        onFirstRowMatchLogicChange={onFirstRowMatchLogicChange}
        onSecondRowMatchLogicChange={onSecondRowMatchLogicChange}
        onThirdRowMatchLogicChange={onThirdRowMatchLogicChange}
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
  );
};
