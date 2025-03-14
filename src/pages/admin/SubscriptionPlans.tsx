
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubscriptionPlan } from "@/types/supabase";
import { EditPlanDialog } from "@/components/admin/subscription/EditPlanDialog";
import { SubscriptionPlansTable } from "@/components/admin/subscription/SubscriptionPlansTable";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { plans, isLoading, fetchPlans, createPlan, updatePlan, deletePlan } = useSubscriptionPlans();

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (planData: any) => {
    try {
      if (planData.id) {
        // Update existing plan
        await updatePlan(planData.id, {
          name: planData.name,
          period: planData.period,
          price: planData.price,
          is_active: planData.is_active,
        });
      } else {
        // Create new plan
        await createPlan({
          name: planData.name,
          period: planData.period,
          price: planData.price,
          is_active: true,
        });
      }
      
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleDeletePlan = async (plan: SubscriptionPlan) => {
    if (!confirm(`Are you sure you want to delete the ${plan.name} plan?`)) {
      return;
    }

    await deletePlan(plan.id);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <Button
            onClick={() => {
              setSelectedPlan(null);
              setIsEditDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <SubscriptionPlansTable
          plans={plans}
          isLoading={isLoading}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeletePlan}
        />

        <EditPlanDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plan={selectedPlan}
          onSave={handleSavePlan}
        />
      </div>
    </AdminLayout>
  );
}
