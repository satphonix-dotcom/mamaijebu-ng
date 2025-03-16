
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';
import { fetchUserProfile, fetchUserRoles } from '@/hooks/useUserProfile';
import { AuthState } from './types';

export const useAuthState = (): AuthState & {
  updateProfileState: (profileData: Profile | null) => Promise<void>;
} => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);

  // Function to update profile and roles state
  const updateProfileState = async (profileData: Profile | null) => {
    console.log('[useAuthState] Updating profile state:', profileData);
    
    if (profileData) {
      // Set profile first to ensure it's available
      setProfile(profileData);
      
      // Fetch user roles
      if (user) {
        try {
          const userRoles = await fetchUserRoles(user.id);
          console.log('[useAuthState] Fetched roles for user:', userRoles);
          
          setRoles(userRoles);
          
          // Set admin and premium states based on roles
          const hasAdminRole = userRoles.includes('admin');
          const hasPremiumRole = userRoles.includes('premium');
          
          console.log('[useAuthState] Setting admin status to:', hasAdminRole);
          console.log('[useAuthState] Setting premium status to:', hasPremiumRole);
          
          setIsAdmin(hasAdminRole);
          setIsPremium(hasPremiumRole);
          
          // Also check legacy fields for backwards compatibility
          if (!hasAdminRole && profileData.is_admin) {
            console.log('[useAuthState] Setting admin from legacy field');
            setIsAdmin(true);
          }
          
          if (!hasPremiumRole && profileData.is_premium) {
            console.log('[useAuthState] Setting premium from legacy field');
            setIsPremium(true);
          }
        } catch (error) {
          console.error('[useAuthState] Error fetching roles:', error);
        }
      }
    } else {
      console.log('[useAuthState] No profile data, resetting states');
      setProfile(null);
      setIsAdmin(false);
      setIsPremium(false);
      setRoles([]);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        console.log('[useAuthState] Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[useAuthState] Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('[useAuthState] Session found for user:', session.user.email);
            const profileData = await fetchUserProfile(session.user.id);
            await updateProfileState(profileData);
          }
        }
      } catch (error) {
        console.error('[useAuthState] Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[useAuthState] Auth state changed, event:', _event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('[useAuthState] User authenticated:', session.user.email);
          const profileData = await fetchUserProfile(session.user.id);
          await updateProfileState(profileData);
        } else {
          console.log('[useAuthState] User logged out or no session');
          await updateProfileState(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isPremium,
    roles,
    updateProfileState
  };
};
