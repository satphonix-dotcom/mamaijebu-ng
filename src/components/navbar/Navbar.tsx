
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";
import { MobileNavLinks } from "./MobileNavLinks";
import { UserMenu } from "./UserMenu";
import { BrandLogo } from "./BrandLogo";

const Navbar = () => {
  const { user, signOut, isAdmin, isPremium, refreshUserProfile, hasRole, roles } = useAuth();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // On mount, refresh the user profile to ensure we have the latest data
  useEffect(() => {
    if (user) {
      console.log('[Navbar] User logged in:', user.email);
      console.log('[Navbar] Is admin:', isAdmin);
      console.log('[Navbar] Has admin role:', hasRole('admin'));
      console.log('[Navbar] Available roles:', roles);
      
      // Force refresh user profile on component mount
      refreshUserProfile();
    }
  }, [user, refreshUserProfile]);

  // Make sure we use hasRole consistently
  const isUserAdmin = hasRole('admin');
  const isUserPremium = hasRole('premium');

  return (
    <header className="bg-background border-b sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <BrandLogo />
          <NavLinks 
            pathname={pathname} 
            isAdmin={isUserAdmin} 
            user={user} 
          />
        </div>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-2/3 md:w-1/2">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the application.
              </SheetDescription>
            </SheetHeader>
            <MobileNavLinks 
              pathname={pathname} 
              isAdmin={isUserAdmin} 
              isPremium={isUserPremium} 
              user={user} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            />
          </SheetContent>
        </Sheet>

        <UserMenu user={user} isAdmin={isUserAdmin} isPremium={isUserPremium} signOut={signOut} />
      </div>
    </header>
  );
};

export default Navbar;
