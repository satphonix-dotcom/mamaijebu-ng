
import { CheckCircle, XCircle, Crown } from "lucide-react";

export const PlanComparison = ({ premiumPrice }: { premiumPrice: string }) => {
  return (
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
          <p className="text-xl font-bold mb-2">₦0</p>
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
          <p className="text-xl font-bold mb-2">{premiumPrice}</p>
          <p className="text-green-600">One-time Payment</p>
        </div>
      </div>
    </div>
  );
};
