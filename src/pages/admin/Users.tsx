
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { CreateUserDialog } from '@/components/admin/users/CreateUserDialog';

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [userToEdit, setUserToEdit] = useState<Profile | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast({
        title: 'User deleted',
        description: 'User has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Failed to delete user',
        description: 'There was an error deleting the user.',
        variant: 'destructive',
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const handleUpdateUser = async (updatedUser: Profile) => {
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
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Failed to update user',
        description: 'There was an error updating the user.',
        variant: 'destructive',
      });
    } finally {
      setUserToEdit(null);
    }
  };

  const handleCreateUser = async (newUser: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create auth user first (this requires using an Edge Function in a real-world scenario)
      // For this implementation, we're assuming the user already exists in auth.users
      // and we're just adding them to profiles
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          email: newUser.email,
          is_admin: newUser.is_admin,
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setUsers([data[0], ...users]);
        toast({
          title: 'User created',
          description: 'New user has been successfully created.',
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Failed to create user',
        description: 'There was an error creating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">Loading users...</div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No users found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setUserToEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setUserToDelete(user)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DeleteUserDialog 
          isOpen={!!userToDelete} 
          onOpenChange={(open) => !open && setUserToDelete(null)}
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
        />

        <EditUserDialog 
          isOpen={!!userToEdit}
          onOpenChange={(open) => !open && setUserToEdit(null)}
          user={userToEdit}
          onSave={handleUpdateUser}
        />

        <CreateUserDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSave={handleCreateUser}
        />
      </div>
    </AdminLayout>
  );
}
