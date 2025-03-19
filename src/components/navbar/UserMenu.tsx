
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface UserMenuProps {
  user: User | null;
  isAdmin: boolean;
  isPremium: boolean;
  signOut: () => Promise<void>;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, isAdmin, isPremium, signOut }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Enhanced sign out with proper navigation
  const handleSignOut = async () => {
    try {
      console.log("Signing out user...");
      await signOut();
      console.log("User signed out successfully");
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Use React Router navigation instead of window.location for better SPA behavior
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Link to="/login">
        <Button>Login</Button>
      </Link>
    );
  }

  // Debug admin status
  console.log('UserMenu rendering - isAdmin:', isAdmin);
  console.log('UserMenu user:', user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.email ? `https://ui-avatars.com/api/?name=${user.email}` : ""} alt={user?.email || "User"} />
            <AvatarFallback>
              {user?.email ? user.email[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {isAdmin ? "Administrator" : isPremium ? "Premium User" : "User"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        {!isPremium && (
          <DropdownMenuItem asChild>
            <Link to="/premium">Upgrade to Premium</Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
