
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';
import { UserRole } from '@/types/auth';

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  roles: UserRole[];
}

export interface AuthMethods {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  addRole: (userId: string, role: UserRole) => Promise<boolean>;
  removeRole: (userId: string, role: UserRole) => Promise<boolean>;
  upgradeToPremium: () => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthMethods;
