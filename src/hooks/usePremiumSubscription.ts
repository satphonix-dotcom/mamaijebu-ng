
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
  const [premiumPlan, setPremiumPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    fetchPremiumPlan();
  }, []);

  const fetchPremiumPlan = async () => {
    setIsLoadingPlan(true);
    try {
      // Fetch the premium plan (assuming it's the yearly plan)
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('period', 'yearly')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      setPremiumPlan(data as SubscriptionPlan);
    } catch (error) {
      console.error('Error fetching premium plan:', error);
      // If we can't fetch a plan, use a default price
      setPremiumPlan({
        id: 'default',
        name: 'Premium',
        period: 'yearly',
        price: 799999, // Default price in kobo
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const getPriceDisplay = () => {
    if (isLoadingPlan) return "Loading...";
    if (!premiumPlan) return "₦7,999.99";
    
    // Format the price from kobo (stored in the DB) to naira with proper formatting
    const priceInNaira = premiumPlan.price / 100;
    return `₦${priceInNaira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePaymentInitiate = async () => {
    if (!user) return;
    
    if (!premiumPlan) {
      toast({
        title: "Error",
        description: "Could not load subscription plan details. Please try again.",
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
          amount: premiumPlan.price / 100, // Convert kobo to naira for the API
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
    premiumPlan,
    getPriceDisplay,
    handlePaymentInitiate
  };
};
