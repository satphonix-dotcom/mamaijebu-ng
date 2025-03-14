
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PremiumUserView } from "@/components/premium/PremiumUserView";
import { PlanComparison } from "@/components/premium/PlanComparison";
import { PaymentSection } from "@/components/premium/PaymentSection";
import { usePremiumSubscription } from "@/hooks/usePremiumSubscription";

const PremiumSubscription = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const { 
    isLoading, 
    isLoadingPlan, 
    getPriceDisplay, 
    handlePaymentInitiate 
  } = usePremiumSubscription();

  // Redirect to login if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  // If already premium, show a different view
  if (isPremium) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <PremiumUserView />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                <Crown className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Upgrade to Premium</CardTitle>
            <CardDescription>
              Get access to all premium features with a one-time payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PlanComparison premiumPrice={getPriceDisplay()} />
            <PaymentSection 
              isLoading={isLoading}
              isLoadingPlan={isLoadingPlan}
              priceDisplay={getPriceDisplay()}
              onPaymentInitiate={handlePaymentInitiate}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PremiumSubscription;
