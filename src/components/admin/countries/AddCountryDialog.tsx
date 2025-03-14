
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddCountryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, code: string) => Promise<void>;
}

export function AddCountryDialog({ isOpen, onOpenChange, onSubmit }: AddCountryDialogProps) {
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(countryName, countryCode);
    setCountryName('');
    setCountryCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Country Name
              </Label>
              <Input
                id="name"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Country Code
              </Label>
              <Input
                id="code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="col-span-3"
                maxLength={2}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Country</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
