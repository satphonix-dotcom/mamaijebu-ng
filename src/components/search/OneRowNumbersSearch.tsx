
import React, { useState, useEffect } from 'react';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';
import { OneRowSearchForm } from '@/components/search/OneRowSearchForm';
import { OneRowSearchResults } from '@/components/search/OneRowSearchResults';
import { useOneRowSearch } from '@/hooks/useOneRowSearch';

export function OneRowNumbersSearch() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesByType, setGamesByType] = useState<{[key: string]: LottoGame[]}>({});
  const { lottoTypes } = useLottoTypes();
  const { searchResults, performSearch, isSearching } = useOneRowSearch();

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
      <OneRowSearchForm 
        lottoTypes={lottoTypes}
        games={games}
        gamesByType={gamesByType}
        onSearch={performSearch}
        isSearching={isSearching}
      />
      
      <OneRowSearchResults 
        results={searchResults} 
        isSearching={isSearching} 
      />
    </div>
  );
}
