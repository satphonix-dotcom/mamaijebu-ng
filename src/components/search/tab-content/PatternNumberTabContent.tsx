
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatternNumberSearch } from '@/components/search/PatternNumberSearch';

export function PatternNumberTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Number Pattern Search</CardTitle>
        <CardDescription>
          Study number movement patterns across lottery charts. Look for patterns in success and machine numbers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PatternNumberSearch />
      </CardContent>
    </Card>
  );
}
