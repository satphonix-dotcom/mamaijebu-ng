
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    console.log('Fetching profile for user ID:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    // Convert is_admin to proper boolean to avoid type issues (legacy support)
    if (data) {
      data.is_admin = data.is_admin === true;
      data.is_premium = data.is_premium === true;
      console.log('Profile data retrieved:', data);
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

export async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  try {
    console.log('Fetching roles for user ID:', userId);
    
    const { data, error } = await supabase
      .rpc('get_user_roles', { user_id: userId });

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
    
    console.log('User roles retrieved:', data);
    return data as UserRole[];
  } catch (error) {
    console.error('Unexpected error fetching user roles:', error);
    return [];
  }
}

export async function addUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`Adding role ${role} to user ${userId}`);
    
    const { data, error } = await supabase
      .rpc('add_role', { user_id: userId, role });

    if (error) {
      console.error('Error adding user role:', error);
      return false;
    }
    
    console.log('Role added successfully:', data);
    return data as boolean;
  } catch (error) {
    console.error('Unexpected error adding user role:', error);
    return false;
  }
}

export async function removeUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`Removing role ${role} from user ${userId}`);
    
    const { data, error } = await supabase
      .rpc('remove_role', { user_id: userId, role });

    if (error) {
      console.error('Error removing user role:', error);
      return false;
    }
    
    console.log('Role removed successfully:', data);
    return data as boolean;
  } catch (error) {
    console.error('Unexpected error removing user role:', error);
    return false;
  }
}

export async function userHasRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    console.log(`Checking if user ${userId} has role ${role}`);
    
    const { data, error } = await supabase
      .rpc('has_role', { user_id: userId, role });

    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    console.log(`User has role ${role}:`, data);
    return data as boolean;
  } catch (error) {
    console.error('Unexpected error checking user role:', error);
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
