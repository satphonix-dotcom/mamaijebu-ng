
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType } from './types';
import { UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { updateProfileState, ...authState } = useAuthState();
  const authMethods = useAuthMethods(authState.user, updateProfileState);

  // Create a robust hasRole implementation that checks both roles array and legacy flags
  const hasRole = (role: UserRole): boolean => {
    // Always log the role check for debugging
    console.log(`[AuthProvider] Checking for role ${role}, roles:`, authState.roles);
    
    // Check legacy flags first - maintain backward compatibility
    if (role === 'admin' && authState.isAdmin) {
      console.log('[AuthProvider] User has admin role from isAdmin flag');
      return true;
    }
    
    if (role === 'premium' && authState.isPremium) {
      console.log('[AuthProvider] User has premium role from isPremium flag');
      return true;
    }
    
    // Then check the roles array from the new roles system
    const hasRoleInArray = authState.roles.includes(role);
    console.log(`[AuthProvider] Role ${role} found in roles array: ${hasRoleInArray}`);
    
    return hasRoleInArray;
  };

  useEffect(() => {
    console.log('[AuthProvider] Mounted with roles:', authState.roles);
    console.log('[AuthProvider] Admin status:', authState.isAdmin);
    console.log('[AuthProvider] User:', authState.user?.email);
  }, [authState.roles, authState.isAdmin, authState.user]);

  // Create a single merged context value
  const contextValue: AuthContextType = {
    ...authState,
    ...authMethods,
    // Override hasRole with our implementation
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
