
import React, { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType, AuthState } from './types';
import { UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { updateProfileState, ...authState } = useAuthState();
  const authMethods = useAuthMethods(authState.user, updateProfileState);

  // Implement hasRole directly in the provider to use the actual state
  const hasRole = (role: UserRole): boolean => {
    console.log(`[AuthProvider] Checking for role ${role} in:`, authState.roles);
    return authState.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        ...authMethods,
        // Override the hasRole from authMethods with our implementation
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
