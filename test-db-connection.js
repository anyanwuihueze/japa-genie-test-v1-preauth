const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('Testing Supabase connection...');
  
  // Test auth
  const { data: authData, error: authError } = await supabase.auth.getSession();
  console.log('Auth test:', authError ? 'FAILED: ' + authError.message : 'SUCCESS');
  
  // Test database
  const { data: dbData, error: dbError } = await supabase.from('user_profiles').select('count').limit(1);
  console.log('DB test:', dbError ? 'FAILED: ' + dbError.message : 'SUCCESS');
}

test();
