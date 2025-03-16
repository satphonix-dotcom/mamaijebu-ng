
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  pathname: string;
  isAdmin: boolean;
  user: User | null;
}

export const NavLinks: React.FC<NavLinksProps> = ({ pathname, isAdmin, user }) => {
  // Enhanced debug for admin status
  useEffect(() => {
    console.log('NavLinks - Admin status check:', isAdmin);
    if (isAdmin) {
      console.log('Admin links should be visible');
    }
  }, [isAdmin]);
  
  return (
    <nav className="hidden md:flex gap-6">
      <Link
        to="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link
        to="/games"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/games" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Games
      </Link>
      <Link
        to="/search"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/search" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Search
      </Link>
      {user && (
        <Link
          to="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Admin
        </Link>
      )}
    </nav>
  );
};
