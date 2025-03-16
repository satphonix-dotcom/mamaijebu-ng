
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
  const updateProfileState = async (profileData: Profile | null) => {
    if (profileData) {
      // Set profile first to ensure it's available
      setProfile(profileData);
      
      // Parse admin status with explicit boolean conversion and debug logging
      const adminStatus = profileData.is_admin === true;
      const premiumStatus = profileData.is_premium === true;
      
      console.log('Updating profile state for:', profileData.email);
      console.log('Raw admin value:', profileData.is_admin);
      console.log('Parsed admin status:', adminStatus);
      console.log('Current admin state:', isAdmin);
      
      // Set the admin and premium statuses
      setIsAdmin(adminStatus);
      setIsPremium(premiumStatus);
      
      console.log('Admin status set to:', adminStatus);
    } else {
      console.log('No profile data, resetting states');
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
            await updateProfileState(profileData);
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
          await updateProfileState(profileData);
        } else {
          console.log('User logged out or no session');
          await updateProfileState(null);
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
      console.log('AuthContext: Starting sign out process');
      
      // Clear all auth state first to prevent UI flicker
      setSession(null);
      setUser(null);
      await updateProfileState(null);
      
      // Then call the actual signOut from supabase
      await authSignOut();
      console.log('AuthContext: Sign out completed, redirecting to home page');
      
      // Force a page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error; // Rethrow to allow proper error handling
    }
  };

  // Wrapper for upgradeToPremium to update local state
  const upgradeToPremium = async () => {
    if (!user) return false;
    
    const success = await upgradeUserToPremium(user.id);
    
    if (success) {
      // Update local state
      const updatedProfile = await fetchUserProfile(user.id);
      await updateProfileState(updatedProfile);
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
