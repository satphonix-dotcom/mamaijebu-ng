
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const usePremiumSubscription = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    setIsLoadingPlan(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const typedPlans = data.map(plan => ({
          ...plan,
          period: plan.period as 'monthly' | 'quarterly' | 'yearly'
        }));
        
        setAvailablePlans(typedPlans);
        // Default to the first plan
        setSelectedPlan(typedPlans[0]);
      } else {
        // If no plans found, create a default one
        const defaultPlan: SubscriptionPlan = {
          id: 'default',
          name: 'Premium',
          period: 'monthly',
          price: 199900, // Default price in kobo
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setAvailablePlans([defaultPlan]);
        setSelectedPlan(defaultPlan);
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      // Create a default plan
      const defaultPlan: SubscriptionPlan = {
        id: 'default',
        name: 'Premium',
        period: 'monthly',
        price: 199900, // Default price in kobo
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setAvailablePlans([defaultPlan]);
      setSelectedPlan(defaultPlan);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const getPriceDisplay = () => {
    if (isLoadingPlan || !selectedPlan) return "Loading...";
    
    // Format the price from kobo (stored in the DB) to naira with proper formatting
    const priceInNaira = selectedPlan.price / 100;
    return `₦${priceInNaira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const selectPlan = (planId: string) => {
    const plan = availablePlans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  const handlePaymentInitiate = async () => {
    if (!user || !selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a subscription plan to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use edge function to initiate payment
      const { data, error } = await supabase.functions.invoke('initiate-payment', {
        body: {
          userId: user.id,
          userEmail: profile?.email || user.email,
          amount: selectedPlan.price / 100, // Convert kobo to naira for the API
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          planPeriod: selectedPlan.period,
          callbackUrl: window.location.origin + '/premium-confirmation'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setPaymentReference(data.reference);
        setPaymentInitiated(true);
        
        // Redirect to Paystack payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was a problem initiating your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isLoadingPlan,
    paymentInitiated,
    paymentReference,
    selectedPlan,
    availablePlans,
    getPriceDisplay,
    selectPlan,
    handlePaymentInitiate
  };
};
