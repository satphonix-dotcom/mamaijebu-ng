
import { useState, useEffect } from "react";
import { fetchProfileStats } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

export type DashboardStats = {
  users: {
    total: number;
    premium: number;
    admin: number;
  };
  games: {
    total: number;
    countriesCount: number;
  };
  draws: {
    total: number;
    recentDrawsCount: number;
  };
};

export type UserDistribution = Array<{
  name: string;
  value: number;
}>;

export type GamesByCountry = Array<{
  name: string;
  count: number;
}>;

export const useDashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    users: {
      total: 0,
      premium: 0,
      admin: 0
    },
    games: {
      total: 0,
      countriesCount: 0
    },
    draws: {
      total: 0,
      recentDrawsCount: 0
    }
  });

  const [userDistribution, setUserDistribution] = useState<UserDistribution>([
    { name: "Regular Users", value: 0 },
    { name: "Premium Users", value: 0 },
    { name: "Admin Users", value: 0 },
  ]);

  const [gamesByCountry, setGamesByCountry] = useState<GamesByCountry>([]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch user stats
        const profileStats = await fetchProfileStats();
        
        // Fetch game stats
        const { count: gamesCount } = await supabase
          .from('lotto_games')
          .select('*', { count: 'exact', head: true });
        
        // Fetch countries count
        const { count: countriesCount } = await supabase
          .from('countries')
          .select('*', { count: 'exact', head: true });
        
        // Fetch draws stats
        const { count: drawsCount } = await supabase
          .from('lotto_draws')
          .select('*', { count: 'exact', head: true });
        
        // Fetch recent draws (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: recentDrawsCount } = await supabase
          .from('lotto_draws')
          .select('*', { count: 'exact', head: true })
          .gte('draw_date', thirtyDaysAgo.toISOString().split('T')[0]);
        
        // Fetch games by country
        const { data: countryData } = await supabase
          .from('countries')
          .select('id, name, lotto_games:lotto_games(*)');
        
        const countryGameCounts = countryData?.map(country => ({
          name: country.name,
          count: country.lotto_games ? country.lotto_games.length : 0
        })).filter(item => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 5) || [];

        setStats({
          users: {
            total: profileStats.totalUsers,
            premium: profileStats.premiumUsers,
            admin: profileStats.adminUsers
          },
          games: {
            total: gamesCount || 0,
            countriesCount: countriesCount || 0
          },
          draws: {
            total: drawsCount || 0,
            recentDrawsCount: recentDrawsCount || 0
          }
        });

        setUserDistribution([
          { name: "Regular Users", value: profileStats.totalUsers - profileStats.premiumUsers - profileStats.adminUsers },
          { name: "Premium Users", value: profileStats.premiumUsers },
          { name: "Admin Users", value: profileStats.adminUsers },
        ]);

        setGamesByCountry(countryGameCounts);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { loading, stats, userDistribution, gamesByCountry };
};
