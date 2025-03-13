
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-2 lg:ml-0 flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-900">LottoGaze</Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            
            {user && (
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
            
            <Link to="/search">
              <Button variant="ghost">Search</Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost">History</Button>
            </Link>
            
            {isAdmin && (
              <Link to="/admin/dashboard">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}
            
            {user ? (
              <Button variant="default" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-primary-400 hover:bg-primary-500">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
