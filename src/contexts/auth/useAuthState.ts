
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
    if (profileData) {
      // Set profile first to ensure it's available
      setProfile(profileData);
      
      // Fetch user roles
      if (user) {
        const userRoles = await fetchUserRoles(user.id);
        setRoles(userRoles);
        
        // Set admin and premium states based on roles
        setIsAdmin(userRoles.includes('admin'));
        setIsPremium(userRoles.includes('premium'));
        
        console.log('[AuthContext] Updating profile state for:', profileData.email);
        console.log('[AuthContext] User roles:', userRoles);
        console.log('[AuthContext] Is admin:', userRoles.includes('admin'));
        console.log('[AuthContext] Is premium:', userRoles.includes('premium'));
      }
    } else {
      console.log('[AuthContext] No profile data, resetting states');
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

  // Extra debug information for admin status
  useEffect(() => {
    if (user) {
      console.log('[AuthContext] Current state:');
      console.log('- User:', user.email);
      console.log('- isAdmin state:', isAdmin);
      console.log('- isPremium state:', isPremium);
      console.log('- Roles:', roles);
    }
  }, [user, isAdmin, isPremium, roles]);

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
