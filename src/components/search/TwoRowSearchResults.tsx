
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface TwoRowSearchResultsProps {
  results: any[];
  isSearching: boolean;
}

export function TwoRowSearchResults({ results, isSearching }: TwoRowSearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Enter numbers and search parameters to find two-row matches.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableCaption>Found {results.length} matches</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
            <TableHead>First Draw Date</TableHead>
            <TableHead>First Draw #</TableHead>
            <TableHead>First Draw Numbers</TableHead>
            <TableHead>Second Draw Date</TableHead>
            <TableHead>Second Draw Numbers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.game_name}</TableCell>
              <TableCell>
                {format(new Date(result.draw_date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>{result.draw_number || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {result.numbers.map((num: number, index: number) => (
                    <span
                      key={index}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                        ${result.first_row_matched 
                          ? 'bg-green-600 text-white font-bold' 
                          : 'bg-gray-200 text-gray-800'}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {result.next_draw_date ? format(new Date(result.next_draw_date), 'dd/MM/yyyy') : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {result.next_draw_numbers?.map((num: number, index: number) => (
                    <span
                      key={index}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                        ${result.second_row_matched 
                          ? 'bg-green-600 text-white font-bold' 
                          : 'bg-gray-200 text-gray-800'}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
