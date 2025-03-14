
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Profile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCw } from 'lucide-react';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { CreateUserDialog } from '@/components/admin/users/CreateUserDialog';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { useUsers } from '@/hooks/useUsers';

export default function Users() {
  const { users, isLoading, fetchUsers, deleteUser, updateUser, createUser } = useUsers();
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [userToEdit, setUserToEdit] = useState<Profile | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
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

  const handleCreateUser = async (newUser: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & { password: string }) => {
    const success = await createUser(newUser);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">Loading users...</div>
        ) : (
          <UsersTable 
            users={users}
            onEdit={setUserToEdit}
            onDelete={setUserToDelete}
          />
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
