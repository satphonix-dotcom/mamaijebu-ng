
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Profile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Users() {
  const { users, isLoading, fetchUsers, deleteUser, updateUser } = useUsers();
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [userToEdit, setUserToEdit] = useState<Profile | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch users on initial mount
  useEffect(() => {
    console.log('Users component mounted, fetching users');
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const success = await deleteUser(userToDelete.id);
    if (success) {
      setUserToDelete(null);
    }
  };

  const handleUpdateUser = async (updatedUser: Profile) => {
    const success = await updateUser(updatedUser);
    if (success) {
      setUserToEdit(null);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing user list');
    await fetchUsers();
    toast({
      title: 'User list refreshed',
      description: 'The user list has been updated with the latest data.'
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">Loading users...</div>
        ) : (
          <>
            <div className="mb-4">
              <p>Total users: <span className="font-bold">{users.length}</span></p>
              <p className="text-sm text-muted-foreground">Currently logged in as: {user?.email}</p>
            </div>
            <UsersTable 
              users={users}
              onEdit={setUserToEdit}
              onDelete={setUserToDelete}
            />
          </>
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
      </div>
    </AdminLayout>
  );
}
