
import { useState } from 'react';
import { KnockingSearchParams, KnockingSearchResult, KnockingMatchLogicType } from '@/types/knockingSearch';
import { fetchKnockingSearchResults } from '@/services/knockingSearchService';

export type { KnockingMatchLogicType, KnockingSearchParams, KnockingSearchResult };

export const useKnockingSearch = () => {
  const [searchResults, setSearchResults] = useState<KnockingSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (params: KnockingSearchParams) => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      const results = await fetchKnockingSearchResults(params);
      setSearchResults(results);
    } catch (error) {
      console.error('Error in knocking search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    isSearching,
    performSearch
  };
};
