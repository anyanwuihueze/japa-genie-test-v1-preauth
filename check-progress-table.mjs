import { createBrowserClient } from '@supabase/ssr';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProgress() {
  // Get table structure
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .limit(1);
    
  console.log('user_progress table sample:', data);
  console.log('Columns:', data ? Object.keys(data[0] || {}) : 'No data');
}

checkProgress();
