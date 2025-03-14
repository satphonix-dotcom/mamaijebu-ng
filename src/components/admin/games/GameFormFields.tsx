
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Country, LottoType } from '@/types/supabase';

interface GameFormFieldsProps {
  name: string;
  description: string;
  ballCount: string;
  minNumber: string;
  maxNumber: string;
  selectedCountry: string;
  selectedLottoType: string;
  countries: Country[];
  lottoTypes: LottoType[];
  onFieldChange: (field: string, value: string) => void;
}

export function GameFormFields({
  name,
  description,
  ballCount,
  minNumber,
  maxNumber,
  selectedCountry,
  selectedLottoType,
  countries,
  lottoTypes,
  onFieldChange
}: GameFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Game Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="country" className="text-right">
          Country
        </Label>
        <Select 
          value={selectedCountry} 
          onValueChange={(value) => onFieldChange('selectedCountry', value)}
          required
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Lottery Type
        </Label>
        <Select 
          value={selectedLottoType} 
          onValueChange={(value) => onFieldChange('selectedLottoType', value)}
          required
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a lottery type" />
          </SelectTrigger>
          <SelectContent>
            {lottoTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          className="col-span-3"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ball_count" className="text-right">
          Ball Count
        </Label>
        <Input
          id="ball_count"
          type="number"
          value={ballCount}
          onChange={(e) => onFieldChange('ballCount', e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="min_number" className="text-right">
          Min Number
        </Label>
        <Input
          id="min_number"
          type="number"
          value={minNumber}
          onChange={(e) => onFieldChange('minNumber', e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="max_number" className="text-right">
          Max Number
        </Label>
        <Input
          id="max_number"
          type="number"
          value={maxNumber}
          onChange={(e) => onFieldChange('maxNumber', e.target.value)}
          className="col-span-3"
          required
        />
      </div>
    </div>
  );
}
