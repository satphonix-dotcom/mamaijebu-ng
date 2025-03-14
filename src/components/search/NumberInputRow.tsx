
import React from 'react';
import { Input } from '@/components/ui/input';

interface NumberInputRowProps {
  numbers: string[];
  onChange: (index: number, value: string) => void;
  rowLabel: string;
  isMobile?: boolean;
}

export function NumberInputRow({ 
  numbers, 
  onChange, 
  rowLabel, 
  isMobile = false 
}: NumberInputRowProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {rowLabel}
      </label>
      <div className={`grid ${isMobile ? 'grid-cols-5' : 'grid-cols-5 md:grid-cols-10'} gap-2`}>
        {numbers.map((num, index) => (
          <Input
            key={`${rowLabel.toLowerCase().replace(/\s+/g, '-')}-${index}`}
            className="w-full text-center px-1"
            value={num}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow up to 2 digits
              if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) <= 99)) {
                onChange(index, value);
              }
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder={(index + 1).toString()}
            style={{ 
              appearance: 'textfield',
              width: '100%',
              fontSize: isMobile ? '16px' : 'inherit'
            }}
          />
        ))}
      </div>
    </div>
  );
}
