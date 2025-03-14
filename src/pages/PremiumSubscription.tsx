
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Crown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const PremiumSubscription = () => {
  const { user, profile, isPremium, upgradeToPremeium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

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
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl">You're a Premium Member!</CardTitle>
              <CardDescription>
                You already have access to all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p>Enjoy all the exclusive features and benefits of your premium membership.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                  <h3 className="font-medium">Advanced Pattern Search</h3>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                  <h3 className="font-medium">Single & Multiple Number Analysis</h3>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                  <h3 className="font-medium">Compare Charts</h3>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate("/search")}>
                Go to Search
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  const handlePaymentInitiate = async () => {
    setIsLoading(true);
    try {
      // Use edge function to initiate payment
      const { data, error } = await supabase.functions.invoke('initiate-payment', {
        body: {
          userId: user.id,
          userEmail: profile?.email || user.email,
          amount: 1999, // $19.99 in USD
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  Standard (Free)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Basic lottery results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>View charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Advanced pattern search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                    <span className="text-gray-500">One, Two & Three Row Numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Lapping & Knocking Numbers</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <p className="text-xl font-bold mb-2">$0</p>
                  <p className="text-gray-500">Current Plan</p>
                </div>
              </div>
              
              <div className="border-2 border-primary rounded-lg p-6 bg-primary/5 relative">
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                  Recommended
                </div>
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2 text-primary">
                  <Crown className="h-5 w-5" />
                  Premium (One-time)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Everything in Standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Advanced pattern search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Single, One, Two & Three Row Numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Lapping & Knocking Numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Compare Charts</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <p className="text-xl font-bold mb-2">$19.99</p>
                  <p className="text-green-600">Lifetime Access</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border mt-8">
              <h3 className="font-bold mb-2">Payment Information</h3>
              <p className="text-gray-600 mb-4">
                Secure payment is processed via Paystack. You'll receive immediate access to premium features after payment.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button 
              size="lg" 
              className="w-full max-w-md mb-4"
              onClick={handlePaymentInitiate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Premium ($19.99)"
              )}
            </Button>
            <p className="text-xs text-gray-500">
              By upgrading, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PremiumSubscription;
