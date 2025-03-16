
import { useEffect, useState } from 'react';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
import { useUsers } from '@/hooks/useUsers';
import { Profile, UserRole } from '@/types/supabase';
import { CreateUserDialog } from '@/components/admin/users/CreateUserDialog';

const Users = () => {
  const { users, isLoading, fetchUsers, deleteUser, updateUser, getUserRoles } = useUsers();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: Profile) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: Profile) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = async (user: Profile, roles: UserRole[]) => {
    await updateUser(user, roles);
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <Button onClick={handleCreate}>Create User</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <UsersTable 
            users={users} 
            userRoles={getUserRoles}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}

        <EditUserDialog 
          isOpen={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          user={selectedUser} 
          userRoles={selectedUser ? getUserRoles(selectedUser.id) : []}
          onSave={handleSaveUser} 
        />

        <DeleteUserDialog 
          isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} 
          onDelete={handleDeleteUser} 
        />

        <CreateUserDialog 
          isOpen={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onUserCreated={() => fetchUsers()}
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
