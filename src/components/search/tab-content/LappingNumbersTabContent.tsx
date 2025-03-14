
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LappingNumbersSearch } from '@/components/search/LappingNumbersSearch';

export function LappingNumbersTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lapping Numbers Search</CardTitle>
        <CardDescription>
          Search for lapping vertical sequence of numbers between two consecutive draws.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LappingNumbersSearch />
      </CardContent>
    </Card>
  );
}
