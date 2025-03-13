
import { Database } from '@/integrations/supabase/types';

// Export the Database type
export type { Database };

// Define types for your tables based on the Database type
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type LottoGame = Database['public']['Tables']['lotto_games']['Row'];
export type LottoDraw = Database['public']['Tables']['lotto_draws']['Row'];

// Define insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type LottoGameInsert = Database['public']['Tables']['lotto_games']['Insert'];
export type LottoDrawInsert = Database['public']['Tables']['lotto_draws']['Insert'];

// Define update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type LottoGameUpdate = Database['public']['Tables']['lotto_games']['Update'];
export type LottoDrawUpdate = Database['public']['Tables']['lotto_draws']['Update'];
