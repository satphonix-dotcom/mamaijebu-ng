
import React from 'react';
import { MatchLogicSelector } from '@/components/search/MatchLogicSelector';
import { MatchLogicType } from '@/hooks/useThreeRowSearch';

interface ThreeRowMatchLogicSelectorsProps {
  firstRowMatchLogic: MatchLogicType;
  secondRowMatchLogic: MatchLogicType;
  thirdRowMatchLogic: MatchLogicType;
  onFirstRowMatchLogicChange: (value: MatchLogicType) => void;
  onSecondRowMatchLogicChange: (value: MatchLogicType) => void;
  onThirdRowMatchLogicChange: (value: MatchLogicType) => void;
  isMobile: boolean;
}

export const ThreeRowMatchLogicSelectors: React.FC<ThreeRowMatchLogicSelectorsProps> = ({
  firstRowMatchLogic,
  secondRowMatchLogic,
  thirdRowMatchLogic,
  onFirstRowMatchLogicChange,
  onSecondRowMatchLogicChange,
  onThirdRowMatchLogicChange,
  isMobile
}) => {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
      <MatchLogicSelector 
        value={firstRowMatchLogic}
        onChange={onFirstRowMatchLogicChange}
        label="@row1 (Match in First Row)"
      />
      
      <MatchLogicSelector 
        value={secondRowMatchLogic}
        onChange={onSecondRowMatchLogicChange}
        label="@row2 (Match in Second Row)"
      />
      
      <MatchLogicSelector 
        value={thirdRowMatchLogic}
        onChange={onThirdRowMatchLogicChange}
        label="@row3 (Match in Third Row)"
      />
    </div>
  );
};
