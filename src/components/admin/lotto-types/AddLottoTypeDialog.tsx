
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LottoTypeForm } from './LottoTypeForm';

interface AddLottoTypeDialogProps {
  onAddType: (typeData: any) => Promise<any>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLottoTypeDialog({ onAddType, isOpen, onOpenChange }: AddLottoTypeDialogProps) {
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [hasMultipleSets, setHasMultipleSets] = useState(false);
  const [mainNumbersCount, setMainNumbersCount] = useState('5');
  const [mainNumbersMin, setMainNumbersMin] = useState('1');
  const [mainNumbersMax, setMainNumbersMax] = useState('50');
  const [extraNumbersCount, setExtraNumbersCount] = useState('2');
  const [extraNumbersMin, setExtraNumbersMin] = useState('1');
  const [extraNumbersMax, setExtraNumbersMax] = useState('12');

  const resetForm = () => {
    setTypeName('');
    setTypeDescription('');
    setHasMultipleSets(false);
    setMainNumbersCount('5');
    setMainNumbersMin('1');
    setMainNumbersMax('50');
    setExtraNumbersCount('2');
    setExtraNumbersMin('1');
    setExtraNumbersMax('12');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const configData = {
        has_multiple_sets: hasMultipleSets,
        main_numbers: {
          count: parseInt(mainNumbersCount),
          min: parseInt(mainNumbersMin), 
          max: parseInt(mainNumbersMax)
        }
      };

      // Only include extra numbers data if it's a multiple set lottery
      if (hasMultipleSets) {
        configData['extra_numbers'] = {
          count: parseInt(extraNumbersCount),
          min: parseInt(extraNumbersMin),
          max: parseInt(extraNumbersMax)
        };
      }

      await onAddType({
        name: typeName,
        description: typeDescription,
        configuration: configData
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add New Lottery Type</Button>
      </DialogTrigger>
      <LottoTypeForm
        onSubmit={handleSubmit}
        typeName={typeName}
        setTypeName={setTypeName}
        typeDescription={typeDescription}
        setTypeDescription={setTypeDescription}
        hasMultipleSets={hasMultipleSets}
        setHasMultipleSets={setHasMultipleSets}
        mainNumbersCount={mainNumbersCount}
        setMainNumbersCount={setMainNumbersCount}
        mainNumbersMin={mainNumbersMin}
        setMainNumbersMin={setMainNumbersMin}
        mainNumbersMax={mainNumbersMax}
        setMainNumbersMax={setMainNumbersMax}
        extraNumbersCount={extraNumbersCount}
        setExtraNumbersCount={setExtraNumbersCount}
        extraNumbersMin={extraNumbersMin}
        setExtraNumbersMin={setExtraNumbersMin}
        extraNumbersMax={extraNumbersMax}
        setExtraNumbersMax={setExtraNumbersMax}
      />
    </Dialog>
  );
}
