
import { TableCell, TableBody, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottoType } from "@/types/supabase";
import { EditLottoTypeDialog } from "./EditLottoTypeDialog";

interface LottoTypesListProps {
  lottoTypes: LottoType[];
  loading: boolean;
  onUpdateType: (id: string, typeData: any) => Promise<any>;
}

export function LottoTypesList({ lottoTypes, loading, onUpdateType }: LottoTypesListProps) {
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
              <TableHead className="w-[80px]">Actions</TableHead>
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
                  <EditLottoTypeDialog lottoType={type} onUpdateType={onUpdateType} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
