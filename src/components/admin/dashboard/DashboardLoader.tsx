
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

export const DashboardLoader = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-10 flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard statistics...</span>
      </div>
    </AdminLayout>
  );
};
