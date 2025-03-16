
import React, { createContext, useContext, useEffect } from 'react';
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
    if (role === 'admin' && authState.isAdmin) {
      console.log('[AuthProvider] User has admin role from isAdmin flag');
      return true;
    }
    if (role === 'premium' && authState.isPremium) {
      console.log('[AuthProvider] User has premium role from isPremium flag');
      return true;
    }
    return authState.roles.includes(role);
  };

  // Debug roles on mount or when they change
  useEffect(() => {
    console.log('[AuthProvider] Current roles:', authState.roles);
    console.log('[AuthProvider] Is admin from state:', authState.isAdmin);
  }, [authState.roles, authState.isAdmin]);

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
