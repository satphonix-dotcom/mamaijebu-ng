
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { SubscriptionPlan } from "@/types/supabase";

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
}

export function SubscriptionPlansTable({ 
  plans, 
  onEdit, 
  onDelete, 
  isLoading 
}: SubscriptionPlansTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Price (USD)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Loading subscription plans...</TableCell>
            </TableRow>
          ) : plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">No subscription plans found</TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>
                  {plan.period === 'monthly' ? 'Monthly' : 
                   plan.period === 'quarterly' ? 'Quarterly' : 
                   plan.period === 'yearly' ? 'Yearly' : plan.period}
                </TableCell>
                <TableCell className="text-right">${(plan.price / 100).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(plan)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
