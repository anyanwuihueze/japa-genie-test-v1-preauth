require('dotenv').config({path:'.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
  
  console.log('user_profiles table check:');
  console.log('Error:', error);
  console.log('Data:', data);
}

checkTables();
