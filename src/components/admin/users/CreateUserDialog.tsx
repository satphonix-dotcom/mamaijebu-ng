
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function CreateUserDialog({ isOpen, onOpenChange, onSave }: CreateUserDialogProps) {
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEmail("");
    setIsAdmin(false);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        email,
        is_admin: isAdmin,
      });
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user profile. Note: In a production app, this would create an authentication user as well.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-email" className="text-right">
              Email
            </Label>
            <Input
              id="new-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-isAdmin" className="text-right">
              Admin
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="new-isAdmin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked === true)}
              />
              <Label htmlFor="new-isAdmin" className="font-normal">
                User has admin privileges
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving || !email}>
            {isSaving ? 'Creating...' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
