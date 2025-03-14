
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatternNumberInputsProps {
  successNumbers: string[];
  machineNumbers: string[];
  onSuccessNumberChange: (index: number, value: string) => void;
  onMachineNumberChange: (index: number, value: string) => void;
}

export function PatternNumberInputs({
  successNumbers,
  machineNumbers,
  onSuccessNumberChange,
  onMachineNumberChange
}: PatternNumberInputsProps) {
  return (
    <div className="space-y-2">
      <Label>Success and Machine Numbers</Label>
      <div className="grid grid-cols-10 gap-2">
        {successNumbers.map((num, index) => (
          <Input
            key={`success-${index}`}
            type="number"
            min="1"
            max="99"
            placeholder={`S${index + 1}`}
            value={num}
            onChange={(e) => onSuccessNumberChange(index, e.target.value)}
            className="bg-blue-50 border-blue-200"
          />
        ))}
        {machineNumbers.map((num, index) => (
          <Input
            key={`machine-${index}`}
            type="number"
            min="1"
            max="99"
            placeholder={`M${index + 1}`}
            value={num}
            onChange={(e) => onMachineNumberChange(index, e.target.value)}
            className="bg-red-50 border-red-200"
          />
        ))}
      </div>
    </div>
  );
}
