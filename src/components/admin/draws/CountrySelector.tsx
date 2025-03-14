
import { Country } from '@/types/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string;
  onSelectCountry: (countryId: string) => void;
}

export const CountrySelector = ({ countries, selectedCountry, onSelectCountry }: CountrySelectorProps) => {
  return (
    <Select 
      value={selectedCountry} 
      onValueChange={onSelectCountry}
    >
      <SelectTrigger>
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
  );
};
