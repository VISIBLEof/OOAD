#!/usr/bin/env node
// Usage:
// 1) Put SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
// 2) Run: node scripts/update-user-role.js yommongkol12@gmail.com teacher

import('dotenv').then(({ default: dotenv }) => dotenv.config()).then(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/update-user-role.js <email> <role>');
    process.exit(1);
  }

  const [email, role] = args;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) in .env.local');
    process.exit(1);
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Try to find user by email
    const listRes = await supabaseAdmin.auth.admin.listUsers();
    if (listRes.error) {
      console.error('listUsers error:', listRes.error);
      process.exit(1);
    }

    const user = (listRes.data?.users || []).find(u => u.email === email);
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const uid = user.id;
    console.log('Found user:', uid, user.email);

    const updateRes = await supabaseAdmin.auth.admin.updateUserById(uid, {
      user_metadata: { ...(user.user_metadata || {}), role },
    });

    if (updateRes.error) {
      console.error('updateUserById error:', updateRes.error);
      process.exit(1);
    }

    console.log('Updated role to', role, 'for', email);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
});
