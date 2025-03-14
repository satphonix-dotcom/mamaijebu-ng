
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PremiumUserView = () => {
  const navigate = useNavigate();

  return (
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
  );
};
