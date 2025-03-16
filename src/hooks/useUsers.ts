
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';
import { fetchUserRoles, addUserRole, removeUserRole } from './useUserProfile';

export function useUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching users from Supabase');
      
      // Use RPC function to fetch all profiles to bypass RLS
      const { data, error } = await supabase
        .rpc('get_all_profiles');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data?.length || 0);
      
      // If data exists, sort it before setting
      const sortedData = data ? [...data].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) : [];
      
      // Fetch roles for each user
      const rolesMap: Record<string, UserRole[]> = {};
      for (const user of sortedData) {
        rolesMap[user.id] = await fetchUserRoles(user.id);
      }
      
      setUserRoles(rolesMap);
      setUsers(sortedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Failed to load users',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: 'User deleted',
        description: 'User has been successfully deleted.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Failed to delete user',
        description: 'There was an error deleting the user.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateUser = async (updatedUser: Profile, newRoles: UserRole[]) => {
    try {
      console.log('Updating user in database:', updatedUser.id);
      console.log('New roles:', newRoles);
      
      // Update the profile information
      const { data, error } = await supabase
        .from('profiles')
        .update({
          email: updatedUser.email,
        })
        .eq('id', updatedUser.id)
        .select();

      if (error) throw error;
      
      // Get current roles for comparison
      const currentRoles = userRoles[updatedUser.id] || [];
      
      // For each role in newRoles that's not in currentRoles, add it
      const rolesToAdd = newRoles.filter(role => !currentRoles.includes(role));
      
      // For each role in currentRoles that's not in newRoles, remove it
      const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));
      
      // Add new roles
      for (const role of rolesToAdd) {
        await addUserRole(updatedUser.id, role);
      }
      
      // Remove old roles
      for (const role of rolesToRemove) {
        await removeUserRole(updatedUser.id, role);
      }
      
      // Update the local state with the new roles
      setUserRoles(prevRoles => ({
        ...prevRoles,
        [updatedUser.id]: newRoles
      }));
      
      // Refresh user list to ensure we have the latest data
      await fetchUsers();
      
      toast({
        title: 'User updated',
        description: 'User has been successfully updated.',
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Failed to update user',
        description: 'There was an error updating the user.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getUserRoles = (userId: string): UserRole[] => {
    return userRoles[userId] || [];
  };

  return {
    users,
    isLoading,
    fetchUsers,
    deleteUser,
    updateUser,
    getUserRoles
  };
}
