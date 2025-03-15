
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
};

export const StatCard = ({ title, value, subtitle }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

type StatsCardsProps = {
  stats: {
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
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard 
        title="Total Users" 
        value={stats.users.total} 
        subtitle={`Premium: ${stats.users.premium} | Regular: ${stats.users.total - stats.users.premium - stats.users.admin}`} 
      />
      <StatCard 
        title="Admin Users" 
        value={stats.users.admin} 
        subtitle={`${((stats.users.admin / stats.users.total) * 100).toFixed(1)}% of total users`} 
      />
      <StatCard 
        title="Total Games" 
        value={stats.games.total} 
        subtitle={`From ${stats.games.countriesCount} different countries`} 
      />
      <StatCard 
        title="Total Draws" 
        value={stats.draws.total} 
        subtitle={`${stats.draws.recentDrawsCount} in the last 30 days`} 
      />
    </div>
  );
};
