import { createClient } from '@/lib/supabase/client';

async function quickTest() {
  const supabase = createClient();
  
  // Test 1: Can we connect?
  const { data: { user } } = await supabase.auth.getUser();
  console.log('✅ User:', user ? 'Logged in' : 'Not logged in');
  
  // Test 2: What tables do we have access to?
  const tables = ['profiles', 'user_profiles', 'chat_sessions', 'visa_insights', 'documents'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count').limit(1);
    console.log(`📊 ${table}:`, error ? '❌ Not found' : '✅ Exists');
  }
}

quickTest();
