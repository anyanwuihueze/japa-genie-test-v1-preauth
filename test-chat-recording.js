const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://olndthagqraoynxyjcyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
);

async function test() {
  console.log('🧪 Testing chat recording...');
  
  // Check if chat_messages table exists and has data
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log('❌ Chat messages error:', error.message);
  } else {
    console.log(`✅ Chat messages table accessible - ${messages.length} records found`);
    console.log('Sample messages:', messages);
  }
}

test();
