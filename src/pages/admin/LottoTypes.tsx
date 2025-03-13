
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { LottoType } from '@/types/supabase';

export default function LottoTypes() {
  const [lottoTypes, setLottoTypes] = useState<LottoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchLottoTypes();
  }, []);

  const fetchLottoTypes = async () => {
    try {
      setLoading(true);
      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('lotto_types')
        .select('*')
        .order('name', { ascending: true }) as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      setLottoTypes(data || []);
    } catch (error) {
      console.error('Error fetching lotto types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lotto types. Please try again.',
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
        .from('lotto_types')
        .insert([{
          name: typeName,
          description: typeDescription,
        }])
        .select() as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      
      setLottoTypes([...(data || []), ...lottoTypes]);
      setIsDialogOpen(false);
      setTypeName('');
      setTypeDescription('');
      
      toast({
        title: 'Success',
        description: 'Lottery type added successfully',
      });
    } catch (error) {
      console.error('Error adding lottery type:', error);
      toast({
        title: 'Error',
        description: 'Failed to add lottery type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lottery Types</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Lottery Type</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lottery Type</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Type Name
                    </Label>
                    <Input
                      id="name"
                      value={typeName}
                      onChange={(e) => setTypeName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={typeDescription}
                      onChange={(e) => setTypeDescription(e.target.value)}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Type</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading lottery types...</p>
          </div>
        ) : lottoTypes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No lottery types found. Add your first type!</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lottery Types List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lottoTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
