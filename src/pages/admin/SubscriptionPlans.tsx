
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/supabase";
import { EditPlanDialog } from "@/components/admin/subscription/EditPlanDialog";
import { SubscriptionPlansTable } from "@/components/admin/subscription/SubscriptionPlansTable";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: 'Failed to load subscription plans',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (planData: Omit<SubscriptionPlan, 'id'> & { id?: string }) => {
    try {
      if (planData.id) {
        // Update existing plan
        const { error } = await supabase
          .from('subscription_plans')
          .update({
            name: planData.name,
            period: planData.period,
            price: planData.price,
            is_active: planData.is_active,
          })
          .eq('id', planData.id);

        if (error) throw error;

        toast({
          title: 'Plan updated',
          description: 'The subscription plan has been updated successfully.',
        });
      } else {
        // Create new plan
        const { error } = await supabase
          .from('subscription_plans')
          .insert({
            name: planData.name,
            period: planData.period,
            price: planData.price,
            is_active: true,
          });

        if (error) throw error;

        toast({
          title: 'Plan created',
          description: 'New subscription plan has been created successfully.',
        });
      }

      await fetchPlans();
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the subscription plan.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePlan = async (plan: SubscriptionPlan) => {
    if (!confirm(`Are you sure you want to delete the ${plan.name} plan?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: 'Plan deleted',
        description: 'The subscription plan has been deleted successfully.',
      });

      await fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the subscription plan.',
        variant: 'destructive',
      });
    }
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
