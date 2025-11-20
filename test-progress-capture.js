const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://olndthagqraoynxyjcyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
);

async function test() {
  console.log('🔍 TESTING PROGRESS CAPTURE...\n');

  // 1. Check if user_progress table has data
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .limit(5);

  console.log('📊 User Progress Table:');
  console.log('Records:', progress?.length || 0);
  if (progress?.length > 0) {
    console.log('Sample:', progress[0]);
  }

  // 2. Check user_documents table
  const { data: documents, error: docError } = await supabase
    .from('user_documents')
    .select('*')
    .limit(5);

  console.log('\n📄 User Documents Table:');
  console.log('Records:', documents?.length || 0);
  if (documents?.length > 0) {
    console.log('Sample:', documents[0]);
  }

  // 3. Check messages table
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .limit(5);

  console.log('\n💬 Messages Table:');
  console.log('Records:', messages?.length || 0);
  if (messages?.length > 0) {
    console.log('Sample:', messages[0]);
  }

  // 4. Check if there's integration between them
  console.log('\n🔗 INTEGRATION STATUS:');
  console.log('Progress ← Documents:', progress?.some(p => p.documents_uploaded) ? '✅' : '❌');
  console.log('Progress ← Messages:', progress?.some(p => p.total_chat_messages > 0) ? '✅' : '❌');
  console.log('Documents → Progress:', documents?.some(d => d.user_id && progress?.some(p => p.user_id === d.user_id)) ? '✅' : '❌');
}

test();
