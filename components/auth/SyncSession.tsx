'use client';
import { useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export default function SyncSession() {
  useEffect(() => {
    let mounted = true;

    async function sync() {
      try {
        const { data } = await supabase.auth.getSession();
        const accessToken = (data as any)?.session?.access_token;
        if (accessToken) {
          await fetch('/api/auth/sync', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: accessToken }),
          });
        }
      } catch (err) {
        // swallow — sync is best-effort
        console.error('SyncSession error:', err);
      }
    }

    if (mounted) sync();

    return () => { mounted = false };
  }, []);

  return null;
}
