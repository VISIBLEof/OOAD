import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Do not throw here to allow the app to run in environments where DB isn't configured yet,
  // but many routes will fail until env is provided.
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Supabase client will not be initialized.');
}

export const supabaseAdmin: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

export async function getUserByEmail(email: string) {
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  const { data, error } = await supabaseAdmin.from('users').select('id, email, password_hash, name, role').eq('email', email).limit(1).maybeSingle();
  if (error) throw error;
  return data as any | null;
}

export async function createUser({ name, email, passwordHash, role = 'student' }: { name: string; email: string; passwordHash: string; role?: string; }) {
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  const { data, error } = await supabaseAdmin.from('users').insert({ name, email, password_hash: passwordHash, role }).select('id, email, role').maybeSingle();
  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  const { data, error } = await supabaseAdmin.from('users').select('id, name, email, role').eq('id', id).limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

// Optional: small helper to run raw SQL if needed via RPC or other means. For now we rely on standard CRUD methods.
