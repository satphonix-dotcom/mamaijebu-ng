
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchLogicType } from '@/hooks/useOneRowSearch';

interface SearchLogicSelectorProps {
  value: SearchLogicType;
  onChange: (value: SearchLogicType) => void;
  label: string;
}

export function SearchLogicSelector({ value, onChange, label }: SearchLogicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as SearchLogicType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select search logic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="both">Search in Both Success and Machine</SelectItem>
          <SelectItem value="success">Search in Success Numbers Only</SelectItem>
          <SelectItem value="machine">Search in Machine Numbers Only</SelectItem>
          <SelectItem value="position">Search by Position</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
