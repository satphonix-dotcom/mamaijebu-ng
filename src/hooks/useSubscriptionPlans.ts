
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, SubscriptionPlanInsert, SubscriptionPlanUpdate } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.error('Error fetching subscription plans:', error);
      toast({
        title: 'Failed to load subscription plans',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: SubscriptionPlanInsert) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      
      setPlans([data, ...plans]);
      
      toast({
        title: 'Plan created',
        description: 'New subscription plan has been created successfully.',
      });
      
      return data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the subscription plan.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updatePlan = async (id: string, planData: SubscriptionPlanUpdate) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPlans(plans.map(plan => plan.id === id ? data : plan));
      
      toast({
        title: 'Plan updated',
        description: 'The subscription plan has been updated successfully.',
      });
      
      return data;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the subscription plan.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPlans(plans.filter(plan => plan.id !== id));
      
      toast({
        title: 'Plan deleted',
        description: 'The subscription plan has been deleted successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the subscription plan.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    plans,
    isLoading,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan
  };
}
