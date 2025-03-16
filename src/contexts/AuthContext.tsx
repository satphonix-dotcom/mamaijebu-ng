
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
      
      // Force the admin status to be a boolean and log it
      const adminStatus = Boolean(profileData.is_admin);
      const premiumStatus = Boolean(profileData.is_premium);
      
      console.log('[AuthContext] Updating profile state for:', profileData.email);
      console.log('[AuthContext] Raw admin value from database:', profileData.is_admin);
      console.log('[AuthContext] Parsed admin status:', adminStatus);
      console.log('[AuthContext] Admin status type:', typeof adminStatus);
      
      // Set the admin and premium statuses
      setIsAdmin(adminStatus);
      setIsPremium(premiumStatus);
      
      console.log('[AuthContext] Admin status now set to:', adminStatus);
    } else {
      console.log('[AuthContext] No profile data, resetting states');
      setProfile(null);
      setIsAdmin(false);
      setIsPremium(false);
    }
  };

  // Force refresh of user profile when admin status might have changed
  const refreshUserProfile = async () => {
    if (user) {
      console.log('[AuthContext] Manually refreshing user profile');
      const profileData = await fetchUserProfile(user.id);
      await updateProfileState(profileData);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        console.log('[AuthContext] Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthContext] Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('[AuthContext] Session found for user:', session.user.email);
            const profileData = await fetchUserProfile(session.user.id);
            await updateProfileState(profileData);
          }
        }
      } catch (error) {
        console.error('[AuthContext] Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[AuthContext] Auth state changed, event:', _event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('[AuthContext] User authenticated:', session.user.email);
          const profileData = await fetchUserProfile(session.user.id);
          await updateProfileState(profileData);
        } else {
          console.log('[AuthContext] User logged out or no session');
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
      console.log('[AuthContext] Starting sign out process');
      
      // Clear all auth state first to prevent UI flicker
      setSession(null);
      setUser(null);
      await updateProfileState(null);
      
      // Then call the actual signOut from supabase
      await authSignOut();
      console.log('[AuthContext] Sign out completed, redirecting to home page');
      
      // Force a page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('[AuthContext] Error during sign out:', error);
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
      console.log('[AuthContext] Current state:');
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
        refreshUserProfile,
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
