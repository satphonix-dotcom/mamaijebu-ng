
import React, { useState, useEffect } from 'react';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { supabase } from '@/integrations/supabase/client';
import { LottoGame } from '@/types/supabase';
import { ThreeRowSearchForm } from '@/components/search/ThreeRowSearchForm';
import { ThreeRowSearchResults } from '@/components/search/ThreeRowSearchResults';
import { useThreeRowSearch } from '@/hooks/useThreeRowSearch';

export function ThreeRowNumbersSearch() {
  const [games, setGames] = useState<LottoGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesByType, setGamesByType] = useState<{[key: string]: LottoGame[]}>({});
  const { lottoTypes } = useLottoTypes();
  const { searchResults, performSearch, isSearching } = useThreeRowSearch();

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
      <ThreeRowSearchForm 
        lottoTypes={lottoTypes}
        games={games}
        gamesByType={gamesByType}
        onSearch={performSearch}
        isSearching={isSearching}
      />
      
      <ThreeRowSearchResults 
        results={searchResults} 
        isSearching={isSearching} 
      />
    </div>
  );
}
