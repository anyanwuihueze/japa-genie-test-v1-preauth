require('dotenv').config({path:'.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'user_profiles'"
  }).catch(e => ({error: e}));
  
  console.log('SCHEMA:', data || error);
}

check();
