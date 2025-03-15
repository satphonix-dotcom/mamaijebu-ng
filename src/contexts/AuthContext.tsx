
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { AuthContextType } from '@/types/auth';
import { fetchUserProfile } from '@/hooks/useUserProfile';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  const { signIn, signUp, signOut: authSignOut, upgradeToPremium: upgradeUserToPremium } = useAuthOperations();

  // Function to update profile state
  const updateProfileState = (profileData: Profile | null) => {
    if (profileData) {
      setProfile(profileData);
      const adminStatus = profileData.is_admin || false;
      setIsAdmin(adminStatus);
      setIsPremium(profileData.is_premium || false);
      
      // Enhanced logging for admin status
      console.log('User profile loaded:', profileData);
      console.log('Is admin:', adminStatus, typeof adminStatus);
      console.log('Is premium:', profileData.is_premium);
      
      // Force refresh if admin status changes
      if (adminStatus !== isAdmin) {
        console.log('Admin status changed from', isAdmin, 'to', adminStatus);
      }
    } else {
      setProfile(null);
      setIsAdmin(false);
      setIsPremium(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        console.log('Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('Session found for user:', session.user.email);
            const profileData = await fetchUserProfile(session.user.id);
            updateProfileState(profileData);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed, event:', _event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          const profileData = await fetchUserProfile(session.user.id);
          updateProfileState(profileData);
        } else {
          console.log('User logged out or no session');
          updateProfileState(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wrapper for signOut to reset local state
  const handleSignOut = async () => {
    try {
      await authSignOut();
      // Clear all auth state
      setSession(null);
      setUser(null);
      updateProfileState(null);
      // Force a page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Wrapper for upgradeToPremium to update local state
  const upgradeToPremium = async () => {
    if (!user) return false;
    
    const success = await upgradeUserToPremium(user.id);
    
    if (success) {
      // Update local state
      const updatedProfile = await fetchUserProfile(user.id);
      updateProfileState(updatedProfile);
    }
    
    return success;
  };

  // Extra debug information for admin status
  useEffect(() => {
    if (user) {
      console.log('AuthContext - Current state:');
      console.log('- User:', user.email);
      console.log('- isAdmin state:', isAdmin);
      console.log('- Profile admin flag:', profile?.is_admin);
    }
  }, [user, isAdmin, profile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut: handleSignOut,
        isAdmin,
        isPremium,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
