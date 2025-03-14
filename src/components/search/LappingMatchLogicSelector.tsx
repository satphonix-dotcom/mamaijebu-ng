
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LappingMatchLogicType } from '@/hooks/useLappingSearch';

interface LappingMatchLogicSelectorProps {
  value: LappingMatchLogicType;
  onChange: (value: LappingMatchLogicType) => void;
  isMobile?: boolean;
}

export function LappingMatchLogicSelector({
  value,
  onChange,
  isMobile = false
}: LappingMatchLogicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Lapping Match Logic
      </label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as LappingMatchLogicType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select match logic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random">Random (Any Position)</SelectItem>
          <SelectItem value="positional">Positional (Exact Position)</SelectItem>
          <SelectItem value="position-random-zebra">Position, Random & Zebra/Diagonal</SelectItem>
          <SelectItem value="match-two-lapping">Match At Least Two Lapping</SelectItem>
          <SelectItem value="match-two-diagonal">Match At Least Two Diagonal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
