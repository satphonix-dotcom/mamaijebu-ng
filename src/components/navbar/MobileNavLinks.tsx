
import React from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface MobileNavLinksProps {
  pathname: string;
  isAdmin: boolean;
  isPremium: boolean;
  user: User | null;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ 
  isAdmin, 
  isPremium, 
  user, 
  setIsMobileMenuOpen 
}) => {
  return (
    <nav className="grid gap-4 text-lg font-medium mt-6">
      <Link to="/" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
        Home
      </Link>
      <Link to="/games" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
        Games
      </Link>
      <Link to="/search" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
        Search
      </Link>
      {user && (
        <Link 
          to="/dashboard" 
          className="hover:text-primary" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className="hover:text-primary"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Admin
        </Link>
      )}
      {user && (
        <Link
          to="/premium"
          className="hover:text-primary"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {isPremium ? "Premium Active" : "Upgrade to Premium"}
        </Link>
      )}
    </nav>
  );
};
