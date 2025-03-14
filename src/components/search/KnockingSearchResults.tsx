
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KnockingSearchResult } from '@/hooks/useKnockingSearch';
import { format } from 'date-fns';

interface KnockingSearchResultsProps {
  results: KnockingSearchResult[];
  isSearching: boolean;
  isMobile?: boolean;
}

export function KnockingSearchResults({
  results,
  isSearching,
  isMobile = false
}: KnockingSearchResultsProps) {
  if (isSearching) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Searching...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            No results found. Try adjusting your search criteria.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Results ({results.length})</h3>
          <div className="border rounded-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Draw #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Draw
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Second Draw
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Third Draw
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Knocking
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(result.draw_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.game_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.draw_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {result.first_numbers.map((num, i) => (
                          <span
                            key={`first-${i}`}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                              ${result.knocking_positions.includes(i) 
                                ? 'bg-blue-600 text-white font-bold' 
                                : 'bg-gray-200 text-gray-800'}`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {result.second_numbers.map((num, i) => (
                          <span
                            key={`second-${i}`}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                              ${result.knocking_positions.includes(i) 
                                ? 'bg-green-600 text-white font-bold' 
                                : 'bg-gray-200 text-gray-800'}`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {result.third_numbers.map((num, i) => (
                          <span
                            key={`third-${i}`}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs
                              ${result.knocking_positions.includes(i) 
                                ? 'bg-purple-600 text-white font-bold' 
                                : 'bg-gray-200 text-gray-800'}`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.knocking_positions.length} positions
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
