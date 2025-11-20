const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://olndthagqraoynxyjcyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
);

async function test() {
  console.log('🧪 Testing messages table...');
  
  // Check messages table structure
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log('❌ Messages table error:', error.message);
  } else {
    console.log(`✅ Messages table accessible - ${messages.length} records found`);
    if (messages.length > 0) {
      console.log('Sample message:', messages[0]);
    }
  }
}

test();
