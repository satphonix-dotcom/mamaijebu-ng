
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/supabase";
import { useState, useEffect } from "react";
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
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      // Ensure boolean conversion for is_admin
      const adminStatus = user.is_admin === true;
      setIsAdmin(adminStatus);
      console.log('EditUserDialog - Loading user:', user.email, 'Admin status:', adminStatus, 'Raw value:', user.is_admin);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      console.log('Saving user with updated admin status:', isAdmin);
      await onSave({
        ...user,
        email,
        is_admin: isAdmin,
      });
      console.log('User saved successfully with admin status:', isAdmin);
    } catch (error) {
      console.error('Error saving user:', error);
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
                onCheckedChange={(checked) => {
                  const newValue = checked === true;
                  console.log('Checkbox changed to:', newValue);
                  setIsAdmin(newValue);
                }}
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
