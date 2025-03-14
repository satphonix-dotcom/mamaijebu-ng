
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchLogicType } from '@/hooks/useThreeRowSearch';

interface MatchLogicSelectorProps {
  value: MatchLogicType;
  onChange: (value: MatchLogicType) => void;
  label: string;
}

export function MatchLogicSelector({ value, onChange, label }: MatchLogicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as MatchLogicType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select match logic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Match any number</SelectItem>
          <SelectItem value="one">Match at least 1 number</SelectItem>
          <SelectItem value="two">Match at least 2 numbers</SelectItem>
          <SelectItem value="three">Match at least 3 numbers</SelectItem>
          <SelectItem value="four">Match at least 4 numbers</SelectItem>
          <SelectItem value="five">Match at least 5 numbers</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
