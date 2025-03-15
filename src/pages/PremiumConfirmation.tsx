
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

enum VerificationStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export default function PremiumConfirmation() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const { user, upgradeToPremium } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!reference || !user) {
      setStatus(VerificationStatus.ERROR);
      setErrorMessage('Invalid payment reference or user not logged in.');
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('Verifying payment with reference:', reference);
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { reference }
        });

        if (error) {
          console.error('Error invoking verify-payment function:', error);
          throw new Error(error.message);
        }

        console.log('Verification response:', data);

        if (data.success) {
          console.log('Payment verified successfully, upgrading user to premium');
          const upgraded = await upgradeToPremium();
          console.log('Upgrade result:', upgraded);
          
          if (upgraded) {
            setStatus(VerificationStatus.SUCCESS);
            
            toast({
              title: "Payment Successful",
              description: "Your account has been upgraded to premium!",
            });
          } else {
            console.error('Failed to upgrade user to premium after payment verification');
            throw new Error('Failed to upgrade to premium');
          }
        } else {
          console.error('Payment verification unsuccessful:', data.message);
          throw new Error(data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus(VerificationStatus.ERROR);
        setErrorMessage(err instanceof Error ? err.message : 'An error occurred during payment verification.');
        
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: err instanceof Error ? err.message : 'An error occurred during payment verification.',
        });
      }
    };

    verifyPayment();
  }, [user, reference, navigate, toast, upgradeToPremium]);

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Confirmation</CardTitle>
              <CardDescription>Verifying your payment status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {status === VerificationStatus.LOADING && (
                <>
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-center text-muted-foreground">Verifying your payment...</p>
                </>
              )}
              
              {status === VerificationStatus.SUCCESS && (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                  <p className="text-center text-muted-foreground">
                    Your premium subscription has been activated. Enjoy all the premium features!
                  </p>
                </>
              )}
              
              {status === VerificationStatus.ERROR && (
                <>
                  <XCircle className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                  <p className="text-center text-muted-foreground">
                    {errorMessage || 'We could not verify your payment. Please contact support.'}
                  </p>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => navigate(status === VerificationStatus.SUCCESS ? '/dashboard' : '/premium')}
              >
                {status === VerificationStatus.SUCCESS ? 'Go to Dashboard' : 'Back to Subscription Page'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
