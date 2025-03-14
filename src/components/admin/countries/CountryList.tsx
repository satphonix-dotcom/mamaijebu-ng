
import { useState } from 'react';
import { Country } from '@/types/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CountryListProps {
  countries: Country[];
  onDeleteClick: (id: string) => void;
  loading: boolean;
}

export function CountryList({ countries, onDeleteClick, loading }: CountryListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading countries...</p>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No countries found. Add your first country!</p>
      </div>
    );
  }

  return (
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
                    onClick={() => onDeleteClick(country.id)}
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
  );
}
