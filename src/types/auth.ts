
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
  upgradeToPremium: () => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
};
