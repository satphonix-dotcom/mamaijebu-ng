
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/supabase";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSave: (user: Profile) => Promise<void>;
}

export function EditUserDialog({ isOpen, onOpenChange, user, onSave }: EditUserDialogProps) {
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const { refreshUserProfile } = useAuth();

  // Update form state when user prop changes
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      // Ensure boolean conversion for is_admin and log the conversion
      const adminStatus = Boolean(user.is_admin);
      setIsAdmin(adminStatus);
      console.log('[EditUserDialog] Loading user:', user.email);
      console.log('[EditUserDialog] Admin status type:', typeof user.is_admin);
      console.log('[EditUserDialog] Raw admin value:', user.is_admin);
      console.log('[EditUserDialog] Converted admin status:', adminStatus);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      console.log('[EditUserDialog] Saving user with updated admin status:', isAdmin);
      
      await onSave({
        ...user,
        email,
        is_admin: isAdmin,
      });
      
      console.log('[EditUserDialog] User saved successfully with admin status:', isAdmin);
      
      // Refresh the current user's profile if needed
      await refreshUserProfile();
    } catch (error) {
      console.error('[EditUserDialog] Error saving user:', error);
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
                  console.log('[EditUserDialog] Checkbox changed to:', newValue);
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
