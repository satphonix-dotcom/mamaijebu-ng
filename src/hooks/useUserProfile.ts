import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    console.log('[useUserProfile] Fetching profile for user ID:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[useUserProfile] Error fetching profile:', error);
      return null;
    }
    
    // Convert is_admin to proper boolean to avoid type issues (legacy support)
    if (data) {
      data.is_admin = !!data.is_admin;
      data.is_premium = !!data.is_premium;
      console.log('[useUserProfile] Profile data retrieved:', data);
    }
    
    return data;
  } catch (error) {
    console.error('[useUserProfile] Unexpected error fetching profile:', error);
    return null;
  }
}

export async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  try {
    console.log('[useUserProfile] Fetching roles for user ID:', userId);
    
    const { data, error } = await supabase
      .rpc('get_user_roles', { user_id: userId });

    if (error) {
      console.error('[useUserProfile] Error fetching user roles:', error);
      return [];
    }
    
    console.log('[useUserProfile] User roles retrieved:', data);
    return data as UserRole[];
  } catch (error) {
    console.error('[useUserProfile] Unexpected error fetching user roles:', error);
    return [];
  }
}

export async function addUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`[useUserProfile] Adding role ${role} to user ${userId}`);
    
    const { data, error } = await supabase
      .rpc('add_role', { user_id: userId, role });

    if (error) {
      console.error('[useUserProfile] Error adding user role:', error);
      return false;
    }
    
    console.log('[useUserProfile] Role added successfully:', data);
    return data as boolean;
  } catch (error) {
    console.error('[useUserProfile] Unexpected error adding user role:', error);
    return false;
  }
}

export async function removeUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`[useUserProfile] Removing role ${role} from user ${userId}`);
    
    const { data, error } = await supabase
      .rpc('remove_role', { user_id: userId, role });

    if (error) {
      console.error('[useUserProfile] Error removing user role:', error);
      return false;
    }
    
    console.log('[useUserProfile] Role removed successfully:', data);
    return data as boolean;
  } catch (error) {
    console.error('[useUserProfile] Unexpected error removing user role:', error);
    return false;
  }
}

export async function userHasRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`[useUserProfile] Checking if user ${userId} has role ${role}`);
    
    const { data, error } = await supabase
      .rpc('has_role', { user_id: userId, role });

    if (error) {
      console.error('[useUserProfile] Error checking user role:', error);
      return false;
    }
    
    console.log(`[useUserProfile] User has role ${role}:`, data);
    return !!data;
  } catch (error) {
    console.error('[useUserProfile] Unexpected error checking user role:', error);
    return false;
  }
}

export async function fetchProfileStats(): Promise<{
  totalUsers: number;
  premiumUsers: number;
  adminUsers: number;
}> {
  try {
    // Get total users count
    const { count: totalCount, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Get premium users count
    const { count: premiumCount, error: premiumError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'premium');
    
    if (premiumError) throw premiumError;
    
    // Get admin users count
    const { count: adminCount, error: adminError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (adminError) throw adminError;
    
    return {
      totalUsers: totalCount || 0,
      premiumUsers: premiumCount || 0,
      adminUsers: adminCount || 0
    };
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return {
      totalUsers: 0,
      premiumUsers: 0,
      adminUsers: 0
    };
  }
}
