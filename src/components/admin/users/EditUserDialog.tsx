
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSave: (user: Profile) => Promise<void>;
}

export function EditUserDialog({ isOpen, onOpenChange, user, onSave }: EditUserDialogProps) {
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isAdmin, setIsAdmin] = useState<boolean>(user?.is_admin || false);
  const [isSaving, setIsSaving] = useState(false);

  // Update form state when user prop changes
  if (user && user.email !== email) {
    setEmail(user.email);
    setIsAdmin(user.is_admin || false);
  }

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await onSave({
        ...user,
        email,
        is_admin: isAdmin,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAdmin" className="text-right">
              Admin
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked === true)}
              />
              <Label htmlFor="isAdmin" className="font-normal">
                User has admin privileges
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
