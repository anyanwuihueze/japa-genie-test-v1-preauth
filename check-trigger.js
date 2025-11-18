const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 CHECKING SUPABASE CONFIGURATION\n');
  
  // Check if we can connect
  const { data: connection, error: connError } = await supabase
    .from('user_profiles')
    .select('count')
    .limit(1);
  
  if (connError) {
    console.error('❌ Cannot connect to Supabase:', connError.message);
    return;
  }
  
  console.log('✅ Connected to Supabase\n');
  
  // Check user_profiles table structure
  console.log('📋 Checking user_profiles table...');
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(5);
  
  if (profileError) {
    console.error('❌ Error fetching profiles:', profileError.message);
  } else {
    console.log(`✅ Found ${profiles.length} profiles`);
    if (profiles.length > 0) {
      console.log('Sample profile:', profiles[0]);
    }
  }
  
  console.log('\n📊 DIAGNOSIS:');
  console.log('The "Database error saving new user" happens DURING OAuth signup');
  console.log('This means the error is in Supabase auth configuration, NOT in your callback route');
  console.log('\nThe callback route never runs if signup fails!\n');
}

checkDatabase();
