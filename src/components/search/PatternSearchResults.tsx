
import React from 'react';
import { Card } from '@/components/ui/card';

interface PatternSearchResultsProps {
  results: any[];
  isSearching: boolean;
}

export function PatternSearchResults({ results, isSearching }: PatternSearchResultsProps) {
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
          Enter numbers and search parameters to find pattern matches.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <p className="p-4">Results placeholder: Pattern search results will appear here</p>
    </Card>
  );
}
