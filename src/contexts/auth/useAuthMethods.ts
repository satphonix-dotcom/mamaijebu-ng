
import { User } from '@supabase/supabase-js';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { fetchUserProfile, fetchUserRoles, addUserRole, removeUserRole } from '@/hooks/useUserProfile';
import { Profile, UserRole } from '@/types/supabase';
import { AuthMethods } from './types';

export const useAuthMethods = (
  user: User | null,
  updateProfileState: (profileData: Profile | null) => Promise<void>
): AuthMethods => {
  const { signIn, signUp, signOut: authSignOut, upgradeToPremium: upgradeUserToPremium } = useAuthOperations();

  // Function to check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    // This will be implemented in the provider
    return false;
  };

  // Function to add a role to a user
  const addRole = async (userId: string, role: UserRole): Promise<boolean> => {
    const success = await addUserRole(userId, role);
    if (success && userId === user?.id) {
      // Update local state by refreshing the profile
      const profileData = await fetchUserProfile(userId);
      await updateProfileState(profileData);
    }
    return success;
  };

  // Function to remove a role from a user
  const removeRole = async (userId: string, role: UserRole): Promise<boolean> => {
    const success = await removeUserRole(userId, role);
    if (success && userId === user?.id) {
      // Update local state by refreshing the profile
      const profileData = await fetchUserProfile(userId);
      await updateProfileState(profileData);
    }
    return success;
  };

  // Force refresh of user profile and roles
  const refreshUserProfile = async () => {
    if (user) {
      console.log('[AuthContext] Manually refreshing user profile and roles');
      const profileData = await fetchUserProfile(user.id);
      await updateProfileState(profileData);
    }
  };

  // Wrapper for signOut to reset local state
  const handleSignOut = async () => {
    try {
      console.log('[AuthContext] Starting sign out process');
      
      // Call the actual signOut from supabase
      await authSignOut();
      console.log('[AuthContext] Sign out completed');
      
      // Reset local state
      await updateProfileState(null);
      
      // Force a page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('[AuthContext] Error during sign out:', error);
      throw error;
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

  return {
    signIn,
    signUp,
    signOut: handleSignOut,
    hasRole,
    addRole,
    removeRole,
    upgradeToPremium,
    refreshUserProfile
  };
};
