
import { TableCell, TableBody, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
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
import { LottoType } from "@/types/supabase";
import { EditLottoTypeDialog } from "./EditLottoTypeDialog";

interface LottoTypesListProps {
  lottoTypes: LottoType[];
  loading: boolean;
  onUpdateType: (id: string, typeData: any) => Promise<any>;
  onDeleteType?: (id: string) => Promise<void>;
}

export function LottoTypesList({ 
  lottoTypes, 
  loading, 
  onUpdateType,
  onDeleteType 
}: LottoTypesListProps) {
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (typeToDelete && onDeleteType) {
      await onDeleteType(typeToDelete);
      setTypeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setTypeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading lottery types...</p>
      </div>
    );
  }

  if (lottoTypes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No lottery types found. Add your first type!</p>
      </div>
    );
  }

  return (
    <>
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
                <TableHead className="w-[150px]">Actions</TableHead>
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
                        <p>
                          Main numbers: {type.configuration.main_numbers?.count || '?'} 
                          ({type.configuration.main_numbers?.min || '?'}-{type.configuration.main_numbers?.max || '?'})
                        </p>
                        {type.configuration.has_multiple_sets && type.configuration.extra_numbers && (
                          <p>
                            Extra numbers: {type.configuration.extra_numbers.count} 
                            ({type.configuration.extra_numbers.min}-{type.configuration.extra_numbers.max})
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No configuration</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditLottoTypeDialog lottoType={type} onUpdateType={onUpdateType} />
                      {onDeleteType && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(type.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lottery type
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTypeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
