
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
      <Alert variant="outline" className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Format your draws using this pattern:
          <code className="block mt-1 p-2 bg-muted rounded text-xs">
            DrawNumber: DD/MM/YYYY: Main Numbers | Extra Numbers
          </code>
          <span className="text-xs block mt-1">
            Example for EuroMillions: <code>3245: 04/01/2025: 10 20 30 40 50 | 01 02</code><br />
            Example for 5/90 format: <code>3245: 04/01/2025: 10 20 30 40 50</code>
          </span>
        </AlertDescription>
      </Alert>
      <Textarea
        placeholder="e.g. 3245: 04/01/2025: 10 20 30 40 50 | 01 02"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] font-mono"
      />
    </div>
  );
};
