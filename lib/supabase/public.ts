import { createClient } from "@supabase/supabase-js";

/**
 * Stateless Supabase client (anon key, no cookies) for reading public content.
 * Safe to use inside unstable_cache since it doesn't touch request cookies.
 * Returns null when env vars are absent (e.g. local dev without .env.local) so
 * the public site can fall back to default content instead of crashing.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabasePublic =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: false } })
    : null;
