
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
  onSave: (user: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & { password: string }) => Promise<void>;
}

export function CreateUserDialog({ isOpen, onOpenChange, onSave }: CreateUserDialogProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setIsAdmin(false);
    setIsPremium(false);
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
        password,
        is_admin: isAdmin,
        is_premium: isPremium,
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
            Create a new user with authentication credentials and profile.
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
            <Label htmlFor="new-password" className="text-right">
              Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-isPremium" className="text-right">
              Premium
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="new-isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked === true)}
              />
              <Label htmlFor="new-isPremium" className="font-normal">
                User has premium access
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving || !email || !password}>
            {isSaving ? 'Creating...' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
