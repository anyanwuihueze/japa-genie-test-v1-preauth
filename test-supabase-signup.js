const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://olndthagqraoynxyjcyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
);

async function test() {
  console.log('🧪 Testing Supabase user creation...');
  
  // Try to sign up with a new email (will fail but shows if auth works)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://japa-genie-test-v1-preauth.vercel.app/auth/callback'
    }
  });
  
  if (error) {
    console.log('❌ OAuth initiation failed:', error.message);
  } else {
    console.log('✅ OAuth initiation successful - check redirect');
  }
}

test();
