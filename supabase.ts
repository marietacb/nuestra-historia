import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** En producción, si faltan VITE_* en el build de Vercel, las peticiones a Supabase fallan con "Failed to fetch". */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Si `VITE_SUPABASE_URL` es tipo `https://ref.co` en vez de `https://ref.supabase.co`,
 * el DNS falla (ERR_NAME_NOT_RESOLVED). La URL correcta está en Supabase → Settings → API.
 */
export function isLikelyWrongSupabaseHost(): boolean {
  if (!supabaseUrl) return false;
  try {
    const { hostname } = new URL(supabaseUrl);
    return hostname !== 'localhost' && !hostname.endsWith('.supabase.co');
  } catch {
    return true;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
