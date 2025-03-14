
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionPlan } from "@/types/supabase";

interface EditPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
  onSave: (plan: Omit<SubscriptionPlan, 'id'> & { id?: string }) => Promise<void>;
}

export function EditPlanDialog({ isOpen, onOpenChange, plan, onSave }: EditPlanDialogProps) {
  const [name, setName] = useState<string>(plan?.name || "");
  const [period, setPeriod] = useState<string>(plan?.period || "monthly");
  const [price, setPrice] = useState<string>(plan ? ((plan.price / 100).toFixed(2)) : "19.99");
  const [isSaving, setIsSaving] = useState(false);

  // Update form state when plan prop changes
  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setPeriod(plan.period);
      setPrice((plan.price / 100).toFixed(2));
    } else {
      // Default values for new plan
      setName("");
      setPeriod("monthly");
      setPrice("19.99");
    }
  }, [plan]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Convert price from dollars to cents for storage
      const priceInCents = Math.round(parseFloat(price) * 100);
      
      await onSave({
        id: plan?.id,
        name,
        period,
        price: priceInCents,
        is_active: plan?.is_active ?? true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Subscription Plan" : "Add Subscription Plan"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Premium Monthly"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Period
            </Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price (USD)
            </Label>
            <div className="relative col-span-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
