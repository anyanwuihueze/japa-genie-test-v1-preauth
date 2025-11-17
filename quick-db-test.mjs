import { createBrowserClient } from '@supabase/ssr';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function quickTest() {
  console.log('🔌 Testing Supabase connection...\n');
  
  // Test tables
  const tables = ['profiles', 'user_profiles', 'chat_sessions', 'visa_insights', 'user_progress'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1);
    console.log(`${error ? '❌' : '✅'} ${table}`);
  }
}

quickTest();
