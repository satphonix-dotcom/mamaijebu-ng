
import React from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavLinksProps {
  pathname: string;
  isAdmin: boolean;
  user: User | null;
}

export const NavLinks: React.FC<NavLinksProps> = ({ pathname, isAdmin, user }) => {
  // Simple debug log
  console.log('[NavLinks] Rendering with admin status:', isAdmin);
  
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
            "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
            pathname.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span>Admin</span>
          <Badge variant="success" className="px-1.5 py-0 text-[10px]">Admin</Badge>
        </Link>
      )}
    </nav>
  );
};
