
import { AdminLayout } from "@/components/AdminLayout";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { UserDistributionChart } from "@/components/admin/dashboard/UserDistributionChart";
import { GamesByCountryChart } from "@/components/admin/dashboard/GamesByCountryChart";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { DashboardLoader } from "@/components/admin/dashboard/DashboardLoader";

export default function AdminDashboard() {
  const { loading, stats, userDistribution, gamesByCountry } = useDashboardStats();

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UserDistributionChart data={userDistribution} />
          <GamesByCountryChart data={gamesByCountry} />
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <QuickActions />
        </div>
      </div>
    </AdminLayout>
  );
}
