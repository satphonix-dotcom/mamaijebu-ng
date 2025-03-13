
import { Database } from '@/integrations/supabase/types';

// Export the Database type
export type { Database };

// Define types for your tables based on the Database type
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type LottoGame = Database['public']['Tables']['lotto_games']['Row'];
export type LottoDraw = Database['public']['Tables']['lotto_draws']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type LottoType = Database['public']['Tables']['lotto_types']['Row'] & {
  configuration?: {
    has_multiple_sets: boolean;
    main_numbers: {
      count: number;
      min: number;
      max: number;
    };
    extra_numbers?: {
      count: number;
      min: number;
      max: number;
    };
  };
};

// Define insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type LottoGameInsert = Database['public']['Tables']['lotto_games']['Insert'];
export type LottoDrawInsert = Database['public']['Tables']['lotto_draws']['Insert'];
export type CountryInsert = Database['public']['Tables']['countries']['Insert'];
export type LottoTypeInsert = Database['public']['Tables']['lotto_types']['Insert'];

// Define update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type LottoGameUpdate = Database['public']['Tables']['lotto_games']['Update'];
export type LottoDrawUpdate = Database['public']['Tables']['lotto_draws']['Update'];
export type CountryUpdate = Database['public']['Tables']['countries']['Update'];
export type LottoTypeUpdate = Database['public']['Tables']['lotto_types']['Update'];
