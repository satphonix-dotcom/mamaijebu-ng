
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OneRowNumbersSearch } from '@/components/search/OneRowNumbersSearch';

export function OneRowNumbersTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>One Row Numbers Search</CardTitle>
        <CardDescription>
          Look up numbers that occur within a single draw/event. Apply different match logics to refine your search.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OneRowNumbersSearch />
      </CardContent>
    </Card>
  );
}
