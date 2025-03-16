
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, refreshUserProfile, hasRole, roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Force refresh user profile when admin page loads
  useEffect(() => {
    console.log('[AdminLayout] Initial state - isAdmin:', isAdmin);
    console.log('[AdminLayout] Initial state - roles:', roles);
    
    const initialize = async () => {
      console.log('[AdminLayout] Refreshing user profile...');
      await refreshUserProfile();
      console.log('[AdminLayout] Profile refreshed, isAdmin:', isAdmin);
      console.log('[AdminLayout] Profile refreshed, roles:', roles);
      
      // Double-check with hasRole directly
      const hasAdminRole = hasRole('admin');
      console.log('[AdminLayout] hasRole("admin") returned:', hasAdminRole);
    };
    
    initialize();
  }, [refreshUserProfile]);

  // Use hasRole directly for more consistent role checking
  const isUserAdmin = hasRole('admin');

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isUserAdmin) {
        console.log('[AdminLayout] User is not admin, redirecting to home');
        toast({
          title: "Access Denied",
          description: "You don't have administrator privileges",
          variant: "destructive"
        });
        navigate('/');
      } else {
        console.log('[AdminLayout] Admin access confirmed');
      }
    }
  }, [isUserAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isUserAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <nav>
              <ul className="flex flex-wrap space-x-2 md:space-x-4">
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/games')}>
                    Games
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/draws')}>
                    Draws
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/countries')}>
                    Countries
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/lotto-types')}>
                    Lottery Types
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/users')}>
                    Users
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/admin/subscription-plans')}>
                    Subscription Plans
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    Back to Site
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
