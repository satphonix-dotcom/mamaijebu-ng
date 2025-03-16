
import React, { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType, AuthState } from './types';
import { UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { updateProfileState, ...authState } = useAuthState();
  const authMethods = useAuthMethods(authState.user, updateProfileState);

  // Implement the hasRole function here to access the current roles
  const hasRole = (role: UserRole): boolean => {
    return authState.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        ...authMethods,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
