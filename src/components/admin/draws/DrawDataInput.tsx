
import { Textarea } from '@/components/ui/textarea';

interface DrawDataInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DrawDataInput = ({ value, onChange }: DrawDataInputProps) => {
  return (
    <Textarea
      placeholder="e.g. 3245: 04/01/2025: 75 30 55 64 23 | 52 47 82 73 80"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px] font-mono"
    />
  );
};
