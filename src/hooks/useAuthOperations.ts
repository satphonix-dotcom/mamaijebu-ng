
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, addUserRole } from './useUserProfile';
import { UserRole } from '@/types/supabase';

export const useAuthOperations = () => {
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
      console.log('useAuthOperations: Calling Supabase signOut');
      
      // First, properly clear session from browser
      localStorage.removeItem('supabase.auth.token');
      
      // Then perform the API call to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      console.log('useAuthOperations: Supabase signOut successful');
      
      return { success: true };
    } catch (error) {
      console.error('Error in signOut operation:', error);
      throw error;
    }
  };

  const upgradeToPremium = async (userId: string) => {
    if (!userId) return false;
    
    try {
      console.log('Upgrading user to premium:', userId);
      
      // Try adding the premium role first
      const roleSuccess = await addUserRole(userId, 'premium' as UserRole);
      
      if (roleSuccess) {
        console.log('Premium role added successfully');
        return true;
      }
      
      // Fall back to legacy method
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating premium status in database:', error);
        throw error;
      }
      
      console.log('Database updated successfully:', data);
      
      // Double-check by fetching the latest profile
      const latestProfile = await fetchUserProfile(userId);
      if (latestProfile) {
        console.log('Fetched latest profile:', latestProfile);
        
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

  return {
    signIn,
    signUp,
    signOut,
    upgradeToPremium
  };
};
