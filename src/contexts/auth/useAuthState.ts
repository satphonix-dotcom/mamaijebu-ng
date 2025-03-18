
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
    
    // Reset flags if no profile data
    if (!profileData) {
      console.log('[useAuthState] No profile data, resetting states');
      setProfile(null);
      setIsAdmin(false);
      setIsPremium(false);
      setRoles([]);
      return;
    }
    
    // Set profile data
    setProfile(profileData);
    
    // Initialize roles array
    let userRoles: UserRole[] = [];
    
    // Set legacy flags from profile
    if (profileData.is_admin) {
      console.log('[useAuthState] Setting admin from profile.is_admin field');
      setIsAdmin(true);
      // Add admin role if not already in array
      if (!userRoles.includes('admin')) {
        userRoles.push('admin');
      }
    }
    
    if (profileData.is_premium) {
      console.log('[useAuthState] Setting premium from profile.is_premium field');
      setIsPremium(true);
      // Add premium role if not already in array
      if (!userRoles.includes('premium')) {
        userRoles.push('premium');
      }
    }
    
    // Fetch user roles from the new roles system
    if (user) {
      try {
        const fetchedRoles = await fetchUserRoles(user.id);
        console.log('[useAuthState] Fetched roles for user:', fetchedRoles);
        
        // Merge roles from legacy flags and roles table
        userRoles = [...new Set([...userRoles, ...fetchedRoles])];
        
        // Update admin and premium flags based on roles
        if (userRoles.includes('admin')) {
          console.log('[useAuthState] Setting admin status from roles table');
          setIsAdmin(true);
        }
        
        if (userRoles.includes('premium')) {
          console.log('[useAuthState] Setting premium status from roles table');
          setIsPremium(true);
        }
        
        // Set final roles array
        setRoles(userRoles);
        console.log('[useAuthState] Final roles array:', userRoles);
      } catch (error) {
        console.error('[useAuthState] Error fetching roles:', error);
      }
    }
  };

  // Initialize auth state on component mount
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

    // Listen for auth state changes
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
