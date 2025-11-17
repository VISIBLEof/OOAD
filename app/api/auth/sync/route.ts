import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json();
    if (!access_token) return NextResponse.json({ success: false, error: 'access_token required' }, { status: 400 });

    let user: any = null;

    // Prefer using the admin client if it's configured with a service role key
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseAdmin && hasServiceRole) {
      const { data, error } = await supabaseAdmin.auth.getUser(access_token as string);
      if (error || !data?.user) {
        console.error('supabase admin getUser error:', error);
        return NextResponse.json({ success: false, error: 'Invalid access token (admin)' }, { status: 401 });
      }
      user = data.user;
    } else {
      // Fallback: call the Supabase auth REST endpoint with the access token to get the user
      // This works even when we don't have a service_role key because the access token authenticates as the user
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_KEY = process.env.SUPABASE_KEY;
      try {
        const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            apikey: SUPABASE_KEY || '',
            'Content-Type': 'application/json',
          },
        });
        if (!resp.ok) {
          const txt = await resp.text().catch(() => '');
          console.error('supabase REST get user failed', resp.status, txt);
          return NextResponse.json({ success: false, error: 'Invalid access token (rest)' }, { status: 401 });
        }
        user = await resp.json();
      } catch (restErr) {
        console.error('supabase REST get user error:', restErr);
        return NextResponse.json({ success: false, error: 'Invalid access token (rest-error)' }, { status: 401 });
      }
    }
  const role = (user.user_metadata as any)?.role || (user.user_metadata?.role) || 'student';

    // Create our app JWT and set cookie
    let cookieSet = false;
    try {
      const token = await createToken(user.id, user.email || '', role);
      await setAuthCookie(token);
      cookieSet = true;
    } catch (cookieErr) {
      console.error('setAuthCookie error:', cookieErr);
    }

    return NextResponse.json({ success: true, data: { userId: user.id, email: user.email, role }, cookieSet });
  } catch (err: any) {
    console.error('auth/sync error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Sync failed' }, { status: 500 });
  }
}
