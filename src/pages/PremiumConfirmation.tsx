
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Crown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

enum VerificationStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

const PremiumConfirmation = () => {
  const { user, upgradeToPremeium, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.LOADING);
  const [error, setError] = useState<string | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Get the reference from URL params
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If already premium, no need to verify
    if (isPremium) {
      setStatus(VerificationStatus.SUCCESS);
      return;
    }

    if (!reference) {
      setStatus(VerificationStatus.ERROR);
      setError("Invalid payment reference");
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log("Verifying payment with reference:", reference);
        
        // Call the verify payment edge function
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { reference }
        });

        if (error) {
          console.error("Error invoking verify-payment function:", error);
          throw new Error(error.message);
        }

        console.log("Verification response:", data);

        if (!data) {
          throw new Error("No data returned from verification");
        }

        if (data.success) {
          console.log("Payment verification successful, upgrading user to premium");
          
          // Try updating local auth state
          const upgraded = await upgradeToPremeium();
          
          if (!upgraded) {
            console.warn("Local auth state update failed, user will need to refresh");
            toast({
              title: "Partial Success",
              description: "Your account has been upgraded but you may need to log out and back in to see premium features.",
              variant: "destructive",
            });
          }
          
          setStatus(VerificationStatus.SUCCESS);
          
          toast({
            title: "Payment Successful",
            description: "Your account has been upgraded to premium!",
          });
        } else {
          throw new Error(data.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification failed:", err);
        setStatus(VerificationStatus.ERROR);
        setError(err.message || "There was a problem verifying your payment");
        
        // If we've tried less than 3 times and it looks like a temporary issue, retry
        if (verificationAttempts < 3 && (err.message?.includes("timeout") || err.message?.includes("network") || !err.message)) {
          setVerificationAttempts(prev => prev + 1);
          
          toast({
            title: "Verification Retry",
            description: `Retrying payment verification (attempt ${verificationAttempts + 1}/3)...`,
          });
          
          // Wait a bit before retrying
          setTimeout(() => {
            setStatus(VerificationStatus.LOADING);
          }, 3000);
        } else {
          toast({
            title: "Verification Error",
            description: err.message || "There was a problem verifying your payment",
            variant: "destructive",
          });
        }
      }
    };

    if (status === VerificationStatus.LOADING) {
      verifyPayment();
    }
  }, [user, reference, navigate, toast, upgradeToPremeium, status, verificationAttempts, isPremium]);

  const handleManualRefresh = async () => {
    setStatus(VerificationStatus.LOADING);
    setVerificationAttempts(0);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === VerificationStatus.LOADING && (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              )}
              {status === VerificationStatus.SUCCESS && (
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              )}
              {status === VerificationStatus.ERROR && (
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === VerificationStatus.LOADING && "Verifying Payment..."}
              {status === VerificationStatus.SUCCESS && "Payment Successful!"}
              {status === VerificationStatus.ERROR && "Payment Verification Failed"}
            </CardTitle>
            <CardDescription>
              {status === VerificationStatus.LOADING && "Please wait while we confirm your payment"}
              {status === VerificationStatus.SUCCESS && "Your account has been upgraded to premium"}
              {status === VerificationStatus.ERROR && error}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {status === VerificationStatus.LOADING && (
              <p>We're processing your payment and upgrading your account. This may take a moment.</p>
            )}
            
            {status === VerificationStatus.SUCCESS && (
              <>
                <p>Thank you for upgrading! You now have access to all premium features.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <h3 className="font-medium">Advanced Pattern Search</h3>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <h3 className="font-medium">Multiple Number Analysis</h3>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <h3 className="font-medium">Compare Charts</h3>
                  </div>
                </div>
              </>
            )}
            
            {status === VerificationStatus.ERROR && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p>
                  We couldn't verify your payment. If you believe this is an error, please 
                  contact our support team with your reference number: {reference}
                </p>
                <div className="mt-4">
                  <Button onClick={handleManualRefresh} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center space-x-4">
            {status === VerificationStatus.SUCCESS && (
              <>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button onClick={() => navigate("/search")}>
                  Try Premium Features
                </Button>
              </>
            )}
            
            {status === VerificationStatus.ERROR && (
              <>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button onClick={() => navigate("/premium")}>
                  Try Again
                </Button>
              </>
            )}
            
            {status === VerificationStatus.LOADING && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PremiumConfirmation;
