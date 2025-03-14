
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SingleNumberSearch } from '@/components/search/SingleNumberSearch';

export function SingleNumberTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Number Search</CardTitle>
        <CardDescription>
          Search for a single number across lottery games. Filter by game type and position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SingleNumberSearch />
      </CardContent>
    </Card>
  );
}
