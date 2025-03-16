
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile, UserRole } from "@/types/supabase";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  userRoles: UserRole[];
  onSave: (user: Profile, roles: UserRole[]) => Promise<void>;
}

export function EditUserDialog({ isOpen, onOpenChange, user, userRoles, onSave }: EditUserDialogProps) {
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const { refreshUserProfile } = useAuth();

  // Update form state when user and roles props change
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setIsAdmin(userRoles.includes('admin'));
      setIsPremium(userRoles.includes('premium'));
      
      console.log('[EditUserDialog] Loading user:', user.email);
      console.log('[EditUserDialog] User roles:', userRoles);
    }
  }, [user, userRoles]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare roles array based on checkboxes
      const newRoles: UserRole[] = ['user']; // Everyone has the base user role
      
      if (isAdmin) {
        newRoles.push('admin');
      }
      
      if (isPremium) {
        newRoles.push('premium');
      }
      
      console.log('[EditUserDialog] Saving user with roles:', newRoles);
      
      await onSave({
        ...user,
        email,
      }, newRoles);
      
      console.log('[EditUserDialog] User saved successfully with roles:', newRoles);
      
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
              Roles
            </Label>
            <div className="flex flex-col space-y-2 col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => {
                    const newValue = checked === true;
                    console.log('[EditUserDialog] Admin checkbox changed to:', newValue);
                    setIsAdmin(newValue);
                  }}
                />
                <Label htmlFor="isAdmin" className="font-normal">
                  Administrator
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPremium"
                  checked={isPremium}
                  onCheckedChange={(checked) => {
                    const newValue = checked === true;
                    console.log('[EditUserDialog] Premium checkbox changed to:', newValue);
                    setIsPremium(newValue);
                  }}
                />
                <Label htmlFor="isPremium" className="font-normal">
                  Premium User
                </Label>
              </div>
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
