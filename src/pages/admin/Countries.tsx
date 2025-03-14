
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Country } from '@/types/supabase';
import { Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true }) as { data: Country[] | null, error: any };
      
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load countries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('countries')
        .insert([{
          name: countryName,
          code: countryCode,
        }])
        .select() as { data: Country[] | null, error: any };
      
      if (error) throw error;
      
      setCountries([...(data || []), ...countries]);
      setIsDialogOpen(false);
      setCountryName('');
      setCountryCode('');
      
      toast({
        title: 'Success',
        description: 'Country added successfully',
      });
    } catch (error) {
      console.error('Error adding country:', error);
      toast({
        title: 'Error',
        description: 'Failed to add country. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setCountryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!countryToDelete) return;

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', countryToDelete);

      if (error) throw error;

      // Update local state
      setCountries(countries.filter(country => country.id !== countryToDelete));
      setCountryToDelete(null);
      setIsDeleteDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Country deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete country. This country may be referenced by games.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Countries</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Country</Button>
            </DialogTrigger>
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading countries...</p>
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No countries found. Add your first country!</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Countries List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell className="font-medium">{country.name}</TableCell>
                      <TableCell>{country.code}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(country.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the country.
              If this country is used by any games, the deletion will fail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCountryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
