
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PaymentSectionProps {
  isLoading: boolean;
  isLoadingPlan: boolean;
  priceDisplay: string;
  onPaymentInitiate: () => Promise<void>;
}

export const PaymentSection = ({ isLoading, isLoadingPlan, priceDisplay, onPaymentInitiate }: PaymentSectionProps) => {
  return (
    <>
      <div className="bg-gray-50 p-4 rounded-lg border mt-8">
        <h3 className="font-bold mb-2">Payment Information</h3>
        <p className="text-gray-600 mb-4">
          Secure payment is processed via Paystack. You'll receive immediate access to premium features after payment.
        </p>
      </div>
      <CardFooter className="flex flex-col items-center">
        <Button 
          size="lg" 
          className="w-full max-w-md mb-4"
          onClick={onPaymentInitiate}
          disabled={isLoading || isLoadingPlan}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isLoadingPlan ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading plan...
            </>
          ) : (
            `Upgrade to Premium (${priceDisplay})`
          )}
        </Button>
        <p className="text-xs text-gray-500">
          By upgrading, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </>
  );
};
