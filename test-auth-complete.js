require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing env variables. Creating with hardcoded values...');
  // Use your actual values
  const supabase = createClient(
    'https://olndthagqraoynxyjcyk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
  );
  testAuthSetup(supabase);
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  testAuthSetup(supabase);
}

async function testAuthSetup(supabase) {
  console.log('🔍 CURRENT AUTH STATE\n');
  
  // Check database
  console.log('📊 Checking database...');
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('id, country, destination_country, visa_type')
    .limit(5);
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log(`✅ Found ${profiles.length} profiles`);
    profiles.forEach(p => {
      const complete = p.country && p.destination_country && p.visa_type;
      console.log(`   ${complete ? '✅' : '⚠️'} ${p.id.substring(0, 8)}... - ${complete ? 'Complete' : 'Incomplete'}`);
    });
  }
  
  console.log('\n�� NOW TEST ACTUAL LOGIN:');
  console.log('1. Go to: https://japa-genie-test-v1-preauth.vercel.app');
  console.log('2. Click "Log In"');
  console.log('3. Try with a NEW Google account');
  console.log('4. Tell me what URL you end up at');
}
