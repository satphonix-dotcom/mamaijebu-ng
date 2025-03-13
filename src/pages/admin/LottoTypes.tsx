
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
import { Switch } from '@/components/ui/switch';

export default function LottoTypes() {
  const [lottoTypes, setLottoTypes] = useState<LottoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [hasMultipleSets, setHasMultipleSets] = useState(false);
  const [mainNumbersCount, setMainNumbersCount] = useState('5');
  const [mainNumbersMin, setMainNumbersMin] = useState('1');
  const [mainNumbersMax, setMainNumbersMax] = useState('50');
  const [extraNumbersCount, setExtraNumbersCount] = useState('2');
  const [extraNumbersMin, setExtraNumbersMin] = useState('1');
  const [extraNumbersMax, setExtraNumbersMax] = useState('12');
  
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

      // Using the any type to work around TypeScript limitations until the Supabase types are updated
      const { data, error } = await supabase
        .from('lotto_types')
        .insert([{
          name: typeName,
          description: typeDescription,
          configuration: configData
        }])
        .select() as { data: LottoType[] | null, error: any };
      
      if (error) throw error;
      
      setLottoTypes([...(data || []), ...lottoTypes]);
      setIsDialogOpen(false);
      resetForm();
      
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

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lottery Types</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Lottery Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
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

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="multiple-sets" className="text-right">
                      Multiple Number Sets
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="multiple-sets"
                        checked={hasMultipleSets}
                        onCheckedChange={setHasMultipleSets}
                      />
                      <Label htmlFor="multiple-sets" className="cursor-pointer">
                        {hasMultipleSets ? "Yes (e.g. EuroMillions)" : "No (e.g. 5/90)"}
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <h3 className="font-medium text-sm">Main Numbers Configuration</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="main-count">Count</Label>
                        <Input
                          id="main-count"
                          type="number"
                          value={mainNumbersCount}
                          onChange={(e) => setMainNumbersCount(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="main-min">Min Number</Label>
                        <Input
                          id="main-min"
                          type="number"
                          value={mainNumbersMin}
                          onChange={(e) => setMainNumbersMin(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="main-max">Max Number</Label>
                        <Input
                          id="main-max"
                          type="number"
                          value={mainNumbersMax}
                          onChange={(e) => setMainNumbersMax(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {hasMultipleSets && (
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <h3 className="font-medium text-sm">Extra Numbers Configuration</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="extra-count">Count</Label>
                          <Input
                            id="extra-count"
                            type="number"
                            value={extraNumbersCount}
                            onChange={(e) => setExtraNumbersCount(e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="extra-min">Min Number</Label>
                          <Input
                            id="extra-min"
                            type="number"
                            value={extraNumbersMin}
                            onChange={(e) => setExtraNumbersMin(e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="extra-max">Max Number</Label>
                          <Input
                            id="extra-max"
                            type="number"
                            value={extraNumbersMax}
                            onChange={(e) => setExtraNumbersMax(e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                    <TableHead>Configuration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lottoTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.description}</TableCell>
                      <TableCell>
                        {type.configuration ? (
                          <div className="text-xs">
                            <p>Main numbers: {type.configuration.main_numbers?.count || '?'} 
                              ({type.configuration.main_numbers?.min || '?'}-{type.configuration.main_numbers?.max || '?'})
                            </p>
                            {type.configuration.has_multiple_sets && type.configuration.extra_numbers && (
                              <p>Extra numbers: {type.configuration.extra_numbers.count} 
                                ({type.configuration.extra_numbers.min}-{type.configuration.extra_numbers.max})
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No configuration</span>
                        )}
                      </TableCell>
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
