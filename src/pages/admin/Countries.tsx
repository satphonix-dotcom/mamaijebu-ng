
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
import { CountryList } from '@/components/admin/countries/CountryList';
import { AddCountryDialog } from '@/components/admin/countries/AddCountryDialog';
import { DeleteCountryDialog } from '@/components/admin/countries/DeleteCountryDialog';
import { useCountries } from '@/hooks/useCountries';

export default function Countries() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
  
  const { countries, loading, addCountry, deleteCountry } = useCountries();

  const handleAddCountry = async (name: string, code: string) => {
    const success = await addCountry(name, code);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setCountryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!countryToDelete) return;

    const success = await deleteCountry(countryToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setCountryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setCountryToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Countries</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add New Country</Button>
        </div>

        <CountryList 
          countries={countries} 
          loading={loading} 
          onDeleteClick={openDeleteDialog} 
        />

        <AddCountryDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onSubmit={handleAddCountry} 
        />

        <DeleteCountryDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </AdminLayout>
  );
}
