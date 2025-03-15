
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { fetchProfileStats } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
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

  const [userDistribution, setUserDistribution] = useState([
    { name: "Regular Users", value: 0 },
    { name: "Premium Users", value: 0 },
    { name: "Admin Users", value: 0 },
  ]);

  const [gamesByCountry, setGamesByCountry] = useState<{ name: string; count: number }[]>([]);

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

  const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10 flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard statistics...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Premium: {stats.users.premium} | Regular: {stats.users.total - stats.users.premium - stats.users.admin}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users.admin}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.users.admin / stats.users.total) * 100).toFixed(1)}% of total users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.games.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {stats.games.countriesCount} different countries
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Draws</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.draws.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.draws.recentDrawsCount} in the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Games by Country (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gamesByCountry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <a href="/admin/games" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Manage Games
                </a>
                <a href="/admin/users" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Manage Users
                </a>
                <a href="/admin/draws" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Manage Draws
                </a>
                <a href="/admin/countries" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Manage Countries
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
