
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
    selectedPlan,
    availablePlans,
    getPriceDisplay,
    selectPlan,
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
              Get access to all premium features with our subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Selection */}
            {!isLoadingPlan && availablePlans.length > 1 && (
              <div className="w-full max-w-xs mx-auto mb-6">
                <Label htmlFor="plan-select" className="mb-2 block">
                  Choose your plan:
                </Label>
                <Select 
                  value={selectedPlan?.id} 
                  onValueChange={selectPlan}
                  disabled={isLoadingPlan}
                >
                  <SelectTrigger id="plan-select">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.period === 'monthly' ? 'Monthly' : 
                                     plan.period === 'quarterly' ? 'Quarterly' : 
                                     plan.period === 'yearly' ? 'Yearly' : plan.period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Plan Comparison */}
            {selectedPlan && (
              <PlanComparison selectedPlan={selectedPlan} />
            )}

            {/* Payment Section */}
            {selectedPlan && (
              <PaymentSection 
                isLoading={isLoading}
                isLoadingPlan={isLoadingPlan}
                priceDisplay={getPriceDisplay()}
                planName={selectedPlan.name}
                planPeriod={selectedPlan.period}
                onPaymentInitiate={handlePaymentInitiate}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PremiumSubscription;
