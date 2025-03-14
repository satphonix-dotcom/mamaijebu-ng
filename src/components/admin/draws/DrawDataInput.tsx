
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DrawDataInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DrawDataInput = ({ value, onChange }: DrawDataInputProps) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Format your draws using this pattern:
          <code className="block mt-1 p-2 bg-muted rounded text-xs">
            DrawNumber: DD/MM/YYYY: Main Numbers | Extra Numbers
          </code>
          <span className="text-xs block mt-1">
            Example: <code>0001: 29/09/1962: 41 89 80 62 45 | 00 00 00 00 00</code><br />
            Note: The system will ignore zeros in the extra numbers section.
          </span>
        </AlertDescription>
      </Alert>
      <Textarea
        placeholder="e.g. 0001: 29/09/1962: 41 89 80 62 45 | 00 00 00 00 00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] font-mono"
      />
    </div>
  );
};
