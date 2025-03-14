import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KnockingMatchLogicType } from '@/types/knockingSearch';

interface KnockingMatchLogicSelectorProps {
  value: KnockingMatchLogicType;
  onChange: (value: KnockingMatchLogicType) => void;
  isMobile?: boolean;
}

export function KnockingMatchLogicSelector({
  value,
  onChange,
  isMobile = false
}: KnockingMatchLogicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Knocking Match Logic
      </label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as KnockingMatchLogicType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select match logic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vertical">Vertical (Same Position)</SelectItem>
          <SelectItem value="diagonal">Diagonal/Zebra (Any Position)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
