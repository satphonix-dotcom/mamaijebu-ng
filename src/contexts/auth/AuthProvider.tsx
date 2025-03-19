
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType } from './types';
import { UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { updateProfileState, ...authState } = useAuthState();
  const authMethods = useAuthMethods(authState.user, updateProfileState);
  const [authInitialized, setAuthInitialized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Initialize auth state and handle route protection
  useEffect(() => {
    const initializeAuth = async () => {
      if (!authState.isLoading && !authInitialized) {
        console.log('[AuthProvider] Auth initialized with roles:', authState.roles);
        console.log('[AuthProvider] Admin status:', authState.isAdmin);
        console.log('[AuthProvider] User:', authState.user?.email);
        setAuthInitialized(true);
      }
    };
    
    initializeAuth();
  }, [authState.isLoading, authState.roles, authState.isAdmin, authState.user, authInitialized]);

  // Route protection effect
  useEffect(() => {
    // Check if auth is ready before applying route protection
    if (!authState.isLoading && authInitialized) {
      // Protect admin routes
      if (location.pathname.startsWith('/admin') && !hasRole('admin')) {
        console.log('[AuthProvider] Unauthorized access to admin route, redirecting');
        navigate('/');
      }
    }
  }, [location.pathname, hasRole, authState.isLoading, authInitialized, navigate]);

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
