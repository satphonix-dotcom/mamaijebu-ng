
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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

  const updateUser = async (updatedUser: Profile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: updatedUser.email,
          is_admin: updatedUser.is_admin,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
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

  const createUser = async (newUser: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & { password: string }) => {
    try {
      const { email, password, is_admin } = newUser;
      
      // Get the correct base URL from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Log the URL for debugging
      console.log('Supabase URL:', supabaseUrl);
      
      if (!supabaseUrl || supabaseUrl.trim() === '') {
        console.error('Supabase URL is not configured or is empty');
        throw new Error('Supabase URL not configured');
      }
      
      // Ensure URL has the proper format
      const formattedUrl = supabaseUrl.endsWith('/') 
        ? supabaseUrl.slice(0, -1) 
        : supabaseUrl;
        
      console.log('Calling edge function at:', `${formattedUrl}/functions/v1/create-user`);
      
      // Call our edge function to create the user with the full URL
      const response = await fetch(`${formattedUrl}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          email,
          password,
          is_admin
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Properly handle non-200 response
        let errorMessage = 'Failed to create user';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('User creation successful:', responseData);
      
      if (responseData.user) {
        // Instead of just adding to the local state, let's refetch all users to ensure consistency
        await fetchUsers();
        toast({
          title: 'User created',
          description: 'New user has been successfully created with authentication.',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Failed to create user',
        description: error.message || 'There was an error creating the user.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    deleteUser,
    updateUser,
    createUser
  };
}
