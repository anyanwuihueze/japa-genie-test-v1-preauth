const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://olndthagqraoynxyjcyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmR0aGFncXJhb3lueHlqY3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NzY3OTgsImV4cCI6MjA3NTQ1Mjc5OH0.MXKGldo1GANXpKe_WcullqO9qq5_90Bu3sQXQnnJ5GM'
);

async function simulate() {
  console.log('\n🧪 JAPA GENIE — PAYMENT FLOW SIMULATION\n');

  // TEST 1: Check your account subscription
  console.log('TEST 1: Checking your account subscription...');
  const { data: yourSub } = await supabase
    .from('subscriptions')
    .select('status, plan_type, current_period_end')
    .eq('user_id', 'd7452ced-3958-49cf-9c60-bdcc2c5fe50c')
    .single();
  console.log(yourSub ? `✅ Your subscription: ${yourSub.status} - ${yourSub.plan_type} - expires ${yourSub.current_period_end}` : '❌ No subscription found');

  // TEST 2: Check a random non-paying user
  console.log('\nTEST 2: Checking non-paying user gate...');
  const { data: randomSub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', '00000000-0000-0000-0000-000000000000')
    .eq('status', 'active')
    .maybeSingle();
  console.log(randomSub ? '⚠️ Non-paying user has access — LEAKAGE' : '✅ Non-paying user correctly blocked');

  // TEST 3: Count total active subscribers
  console.log('\nTEST 3: Total active subscribers...');
  const { count } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  console.log(`✅ Total active subscribers: ${count}`);

  // TEST 4: Check payments table
  console.log('\nTEST 4: Recent payments...');
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status, product_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (payments?.length) {
    payments.forEach(p => console.log(`  💳 ${p.product_name} - $${p.amount} - ${p.status} - ${p.created_at}`));
  } else {
    console.log('  No payments found');
  }

  console.log('\n✅ SIMULATION COMPLETE\n');
}

simulate().catch(console.error);
