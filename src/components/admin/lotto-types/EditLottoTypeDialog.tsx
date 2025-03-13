
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LottoTypeForm } from './LottoTypeForm';
import { Pencil } from 'lucide-react';
import { LottoType } from '@/types/supabase';

interface EditLottoTypeDialogProps {
  lottoType: LottoType;
  onUpdateType: (id: string, typeData: any) => Promise<any>;
}

export function EditLottoTypeDialog({ lottoType, onUpdateType }: EditLottoTypeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typeName, setTypeName] = useState(lottoType.name);
  const [typeDescription, setTypeDescription] = useState(lottoType.description || '');
  const [hasMultipleSets, setHasMultipleSets] = useState(lottoType.configuration?.has_multiple_sets || false);
  const [mainNumbersCount, setMainNumbersCount] = useState(lottoType.configuration?.main_numbers?.count?.toString() || '5');
  const [mainNumbersMin, setMainNumbersMin] = useState(lottoType.configuration?.main_numbers?.min?.toString() || '1');
  const [mainNumbersMax, setMainNumbersMax] = useState(lottoType.configuration?.main_numbers?.max?.toString() || '50');
  const [extraNumbersCount, setExtraNumbersCount] = useState(lottoType.configuration?.extra_numbers?.count?.toString() || '2');
  const [extraNumbersMin, setExtraNumbersMin] = useState(lottoType.configuration?.extra_numbers?.min?.toString() || '1');
  const [extraNumbersMax, setExtraNumbersMax] = useState(lottoType.configuration?.extra_numbers?.max?.toString() || '12');

  // Update form state when lottoType changes
  useEffect(() => {
    setTypeName(lottoType.name);
    setTypeDescription(lottoType.description || '');
    setHasMultipleSets(lottoType.configuration?.has_multiple_sets || false);
    setMainNumbersCount(lottoType.configuration?.main_numbers?.count?.toString() || '5');
    setMainNumbersMin(lottoType.configuration?.main_numbers?.min?.toString() || '1');
    setMainNumbersMax(lottoType.configuration?.main_numbers?.max?.toString() || '50');
    setExtraNumbersCount(lottoType.configuration?.extra_numbers?.count?.toString() || '2');
    setExtraNumbersMin(lottoType.configuration?.extra_numbers?.min?.toString() || '1');
    setExtraNumbersMax(lottoType.configuration?.extra_numbers?.max?.toString() || '12');
  }, [lottoType]);

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

      await onUpdateType(lottoType.id, {
        name: typeName,
        description: typeDescription,
        configuration: configData
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
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
        formTitle="Edit Lottery Type"
        submitButtonText="Update Type"
      />
    </Dialog>
  );
}
