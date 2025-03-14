
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThreeRowNumbersSearch } from '@/components/search/ThreeRowNumbersSearch';

export function ThreeRowNumbersTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Three Row Numbers Search</CardTitle>
        <CardDescription>
          Search across three consecutive draws independently. Look for patterns across three consecutive lottery events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThreeRowNumbersSearch />
      </CardContent>
    </Card>
  );
}
