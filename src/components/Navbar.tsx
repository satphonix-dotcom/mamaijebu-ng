
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, signOut, isAdmin, isPremium } = useAuth();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Log admin status for debugging
  useEffect(() => {
    if (user) {
      console.log('Navbar - User logged in:', user.email);
      console.log('Navbar - Is admin:', isAdmin);
    }
  }, [user, isAdmin]);

  return (
    <header className="bg-background border-b sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="hidden md:block">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">LottoStats</span>
            </div>
          </Link>
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
          </SheetContent>
        </Sheet>

        {user ? (
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
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
