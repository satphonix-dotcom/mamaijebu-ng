
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
  
  const { signIn, signUp, signOut, upgradeToPremium: upgradeUserToPremium } = useAuthOperations();

  // Function to update profile state
  const updateProfileState = (profileData: Profile | null) => {
    if (profileData) {
      setProfile(profileData);
      setIsAdmin(profileData.is_admin || false);
      setIsPremium(profileData.is_premium || false);
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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
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
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          updateProfileState(profileData);
        } else {
          updateProfileState(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
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
