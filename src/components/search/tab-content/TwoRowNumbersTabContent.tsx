
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoRowNumbersSearch } from '@/components/search/TwoRowNumbersSearch';

export function TwoRowNumbersTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two Row Numbers Search</CardTitle>
        <CardDescription>
          Search across two consecutive draws independently. Look for patterns across consecutive lottery events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoRowNumbersSearch />
      </CardContent>
    </Card>
  );
}
