#!/usr/bin/env node
/*
  Usage:
    1) Put your Supabase service role key in .env.local as SUPABASE_SERVICE_ROLE_KEY
    2) Run: node scripts/create-teacher.js yommongkol12@gmail.com "Teacher Name" "Teacher123!"

  This script creates a confirmed Supabase Auth user with role=teacher in user_metadata.
  Keep your service role key secret.
*/

import('dotenv').then(({ default: dotenv }) => dotenv.config());

(async function() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node scripts/create-teacher.js <email> [name] [password]');
    process.exit(1);
  }

  const email = args[0];
  const name = args[1] || 'Teacher User';
  const password = args[2] || 'Teacher123!';

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) in .env.local');
    process.exit(1);
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  try {
    console.log('Creating teacher user:', email);
    const res = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'teacher' },
      email_confirm: true,
    });

    if (res.error) {
      console.error('Error creating user:', res.error);
      process.exit(1);
    }

    console.log('Created user:', res.data?.user?.email);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
