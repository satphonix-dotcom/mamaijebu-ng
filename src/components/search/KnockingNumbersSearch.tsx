
import React, { useState, useEffect } from 'react';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';
import { KnockingSearchForm } from '@/components/search/KnockingSearchForm';
import { KnockingSearchResults } from '@/components/search/KnockingSearchResults';
import { useKnockingSearch } from '@/hooks/useKnockingSearch';
import { useIsMobile } from '@/hooks/use-mobile';

export function KnockingNumbersSearch() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesByType, setGamesByType] = useState<{[key: string]: LottoGame[]}>({});
  const { lottoTypes } = useLottoTypes();
  const { searchResults, performSearch, isSearching } = useKnockingSearch();
  const isMobile = useIsMobile();

  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('lotto_games')
          .select(`
            *,
            countries (id, name),
            lotto_type:lotto_type_id (id, name)
          `)
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        const gamesData = data || [];
        setGames(gamesData);
        
        // Group games by lotto type
        const groupedGames: {[key: string]: LottoGame[]} = {};
        gamesData.forEach(game => {
          if (game.lotto_type?.id) {
            if (!groupedGames[game.lotto_type.id]) {
              groupedGames[game.lotto_type.id] = [];
            }
            groupedGames[game.lotto_type.id].push(game);
          }
        });
        
        setGamesByType(groupedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  return (
    <div className="space-y-6">
      <KnockingSearchForm 
        lottoTypes={lottoTypes}
        games={games}
        gamesByType={gamesByType}
        onSearch={performSearch}
        isSearching={isSearching}
        isMobile={isMobile}
      />
      
      <KnockingSearchResults 
        results={searchResults} 
        isSearching={isSearching} 
        isMobile={isMobile}
      />
    </div>
  );
}
