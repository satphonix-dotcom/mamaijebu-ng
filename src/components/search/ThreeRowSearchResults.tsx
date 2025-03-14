
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

interface ThreeRowSearchResultsProps {
  results: any[];
  isSearching: boolean;
  isMobile?: boolean;
}

export function ThreeRowSearchResults({ results, isSearching, isMobile }: ThreeRowSearchResultsProps) {
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
          Enter numbers and search parameters to find three-row matches.
        </p>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium">{result.game_name}</h3>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">First Draw: {format(new Date(result.draw_date), 'dd/MM/yyyy')}</p>
                <div className="flex flex-wrap gap-1 mb-3">
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
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Second Draw: {result.next_draw_date ? format(new Date(result.next_draw_date), 'dd/MM/yyyy') : 'N/A'}</p>
                <div className="flex flex-wrap gap-1 mb-3">
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
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Third Draw: {result.third_draw_date ? format(new Date(result.third_draw_date), 'dd/MM/yyyy') : 'N/A'}</p>
                <div className="flex flex-wrap gap-1">
                  {result.third_draw_numbers?.map((num: number, index: number) => (
                    <span
                      key={index}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                        ${result.third_row_matched 
                          ? 'bg-green-600 text-white font-bold' 
                          : 'bg-gray-200 text-gray-800'}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
        <p className="text-sm text-center text-muted-foreground">Found {results.length} matches</p>
      </div>
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
            <TableHead>First Draw Numbers</TableHead>
            <TableHead>Second Draw Date</TableHead>
            <TableHead>Second Draw Numbers</TableHead>
            <TableHead>Third Draw Date</TableHead>
            <TableHead>Third Draw Numbers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.game_name}</TableCell>
              <TableCell>
                {format(new Date(result.draw_date), 'dd/MM/yyyy')}
              </TableCell>
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
              <TableCell>
                {result.third_draw_date ? format(new Date(result.third_draw_date), 'dd/MM/yyyy') : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {result.third_draw_numbers?.map((num: number, index: number) => (
                    <span
                      key={index}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                        ${result.third_row_matched 
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
