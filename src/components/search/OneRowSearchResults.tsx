
import React from 'react';
import { Card } from '@/components/ui/card';

interface OneRowSearchResultsProps {
  results: any[];
  isSearching: boolean;
}

export function OneRowSearchResults({ results, isSearching }: OneRowSearchResultsProps) {
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
          Enter numbers and search parameters to find one row matches.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <p className="p-4">Results placeholder: One row search results will appear here</p>
    </Card>
  );
}
