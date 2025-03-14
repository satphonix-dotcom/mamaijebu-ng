
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KnockingNumbersSearch } from '@/components/search/KnockingNumbersSearch';

export function KnockingNumbersTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knocking Numbers Search</CardTitle>
        <CardDescription>
          Search for knocking pattern of numbers between three consecutive draws.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <KnockingNumbersSearch />
      </CardContent>
    </Card>
  );
}
