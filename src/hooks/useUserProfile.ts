
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

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
    
    console.log('Profile data retrieved:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
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
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true);
    
    if (premiumError) throw premiumError;
    
    // Get admin users count
    const { count: adminCount, error: adminError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', true);
    
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
