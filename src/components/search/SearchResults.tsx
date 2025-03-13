
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface SearchResult {
  id: string;
  game_name: string;
  draw_date: string;
  numbers: number[];
  matched_positions?: number[];
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No results found. Try adjusting your search criteria.</p>
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
            <TableHead>Draw Date</TableHead>
            <TableHead>Numbers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.game_name}</TableCell>
              <TableCell>{format(new Date(result.draw_date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {result.numbers.map((num, index) => {
                    const isMatched = result.matched_positions?.includes(index);
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                          ${isMatched 
                            ? 'bg-green-600 text-white font-bold' 
                            : 'bg-gray-200 text-gray-800'}`}
                      >
                        {num}
                      </span>
                    );
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
