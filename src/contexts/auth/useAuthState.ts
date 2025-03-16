
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
      
      let userRoles: UserRole[] = [];
      
      // Set admin and premium states based on legacy fields first
      if (profileData.is_admin) {
        console.log('[useAuthState] Setting admin from profile.is_admin field');
        setIsAdmin(true);
        // Add admin role if it's not already in the roles array
        if (!userRoles.includes('admin')) {
          userRoles.push('admin');
        }
      }
      
      if (profileData.is_premium) {
        console.log('[useAuthState] Setting premium from profile.is_premium field');
        setIsPremium(true);
        // Add premium role if it's not already in the roles array
        if (!userRoles.includes('premium')) {
          userRoles.push('premium');
        }
      }
      
      // Fetch user roles from the new roles system
      if (user) {
        try {
          const fetchedRoles = await fetchUserRoles(user.id);
          console.log('[useAuthState] Fetched roles for user:', fetchedRoles);
          
          // Merge with any roles already set from legacy fields
          userRoles = [...new Set([...userRoles, ...fetchedRoles])];
          setRoles(userRoles);
          
          // Update admin and premium states based on roles
          if (userRoles.includes('admin') && !isAdmin) {
            console.log('[useAuthState] Setting admin status from roles');
            setIsAdmin(true);
          }
          
          if (userRoles.includes('premium') && !isPremium) {
            console.log('[useAuthState] Setting premium status from roles');
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
