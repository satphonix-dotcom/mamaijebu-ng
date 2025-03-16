
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';
import { AuthContextType } from '@/types/auth';
import { fetchUserProfile, fetchUserRoles, addUserRole, removeUserRole } from '@/hooks/useUserProfile';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);
  
  const { signIn, signUp, signOut: authSignOut, upgradeToPremium: upgradeUserToPremium } = useAuthOperations();

  // Function to check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  // Function to add a role to a user
  const addRole = async (userId: string, role: UserRole): Promise<boolean> => {
    const success = await addUserRole(userId, role);
    if (success && userId === user?.id) {
      // Update local state if the role was added to the current user
      setRoles(prevRoles => [...new Set([...prevRoles, role])]);
      
      // Update admin/premium state based on roles
      if (role === 'admin') setIsAdmin(true);
      if (role === 'premium') setIsPremium(true);
    }
    return success;
  };

  // Function to remove a role from a user
  const removeRole = async (userId: string, role: UserRole): Promise<boolean> => {
    const success = await removeUserRole(userId, role);
    if (success && userId === user?.id) {
      // Update local state if the role was removed from the current user
      setRoles(prevRoles => prevRoles.filter(r => r !== role));
      
      // Update admin/premium state based on roles
      if (role === 'admin') setIsAdmin(false);
      if (role === 'premium') setIsPremium(false);
    }
    return success;
  };

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

  // Force refresh of user profile and roles
  const refreshUserProfile = async () => {
    if (user) {
      console.log('[AuthContext] Manually refreshing user profile and roles');
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
    
    // First try with the new role system
    const success = await addRole(user.id, 'premium');
    
    if (!success) {
      // Fall back to the legacy method
      const legacySuccess = await upgradeUserToPremium(user.id);
      
      if (legacySuccess) {
        // Update local state
        const updatedProfile = await fetchUserProfile(user.id);
        await updateProfileState(updatedProfile);
        return true;
      }
      return false;
    }
    
    return success;
  };

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
        roles,
        hasRole,
        addRole,
        removeRole,
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
