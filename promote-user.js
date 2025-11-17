const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hippmmotshyilrbrvwmh.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHBtbW90c2h5aWxyYnJ2d21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM2MDY5NCwiZXhwIjoyMDc4OTM2Njk0fQ.wXeb6YAB1ztje_aqqBUIA2WKnO2lR-qCgn2BhtrvRZM';
const email = process.argv[2] || 'yommongkol12@gmail.com';

console.log('Promoting user to teacher...');
console.log('Email:', email);

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

(async () => {
  try {
    // List users
    const { data: listRes, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listErr) {
      console.error('❌ Error listing users:', listErr);
      process.exit(1);
    }

    const user = listRes.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User ${email} not found`);
      process.exit(1);
    }

    console.log('✓ Found user:', user.email);
    console.log('  Current role:', user.user_metadata?.role || 'not set');

    // Update user metadata to set role as teacher
    const { data: updateRes, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, role: 'teacher' } }
    );

    if (updateErr) {
      console.error('❌ Error updating user:', updateErr);
      process.exit(1);
    }

    console.log('✓ User promoted to teacher!');
    console.log('  New role:', updateRes.user.user_metadata?.role);
    console.log('\n✓ Done! User will redirect to /teacher on next login.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
})();
