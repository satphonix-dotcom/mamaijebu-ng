import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
  upgradeToPremium: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
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
            
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.is_admin || false);
              setIsPremium(profileData.is_premium || false);
            }
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
          
          if (profileData) {
            setProfile(profileData);
            setIsAdmin(profileData.is_admin || false);
            setIsPremium(profileData.is_premium || false);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsPremium(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const upgradeToPremium = async () => {
    if (!user) return false;
    
    try {
      console.log('Upgrading user to premium:', user.id);
      
      // First, update the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating premium status in database:', error);
        throw error;
      }
      
      console.log('Database updated successfully:', data);
      
      // Then update local state
      setProfile(data);
      setIsPremium(true);
      
      // Double-check by fetching the latest profile
      const latestProfile = await fetchUserProfile(user.id);
      if (latestProfile) {
        console.log('Fetched latest profile:', latestProfile);
        setProfile(latestProfile);
        setIsPremium(latestProfile.is_premium || false);
        
        if (!latestProfile.is_premium) {
          console.warn('Profile was not updated to premium in the database!');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      return false;
    }
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
