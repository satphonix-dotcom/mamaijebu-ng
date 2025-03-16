
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  // Force refresh user profile when admin page loads
  useEffect(() => {
    refreshUserProfile();
    console.log('[AdminLayout] Refreshed user profile, isAdmin:', isAdmin);
  }, [refreshUserProfile]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      console.log('[AdminLayout] User is not admin, redirecting to home');
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
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
