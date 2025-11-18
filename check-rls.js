require('dotenv').config({path:'.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLS() {
  const testId = 'test-' + Date.now();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        id: testId,
        country: null,
        destination_country: null,
        visa_type: null
      }
    ])
    .select();
  
  console.log('INSERT TEST:');
  console.log('Error:', error);
  console.log('Data:', data);
  
  if (data) {
    await supabase.from('user_profiles').delete().eq('id', testId);
  }
}

checkRLS();
