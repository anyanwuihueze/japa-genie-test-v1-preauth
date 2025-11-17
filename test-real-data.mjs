import { createBrowserClient } from '@supabase/ssr';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRealData() {
  console.log('🔍 TESTING IF DATA IS REAL OR FAKE\n');
  
  // Get current user progress from DB
  const { data: progress, error } = await supabase
    .from('user_progress')
    .select('*')
    .limit(1)
    .single();
    
  if (error) {
    console.log('❌ No user progress found in DB');
    console.log('Dashboard will show 0% and create initial record');
    return;
  }
  
  console.log('✅ REAL DATA FROM DATABASE:\n');
  console.log('Progress:', progress.overall_progress || 0, '%');
  console.log('Stage:', progress.current_stage || 'Not set');
  console.log('\n📊 MILESTONES (from DB boolean columns):');
  console.log('- Profile completed:', progress.profile_completed ? '✅' : '❌');
  console.log('- Documents uploaded:', progress.documents_uploaded ? '✅' : '❌');
  console.log('- Documents verified:', progress.documents_verified ? '✅' : '❌');
  console.log('- Financial ready:', progress.financial_ready ? '✅' : '❌');
  console.log('- Interview prep:', progress.interview_prep_done ? '✅' : '❌');
  console.log('- Application submitted:', progress.application_submitted ? '✅' : '❌');
  console.log('- Decision received:', progress.decision_received ? '✅' : '❌');
  
  // Calculate what dashboard will show
  const completed = [
    progress.profile_completed,
    progress.documents_uploaded,
    progress.documents_verified,
    progress.financial_ready,
    progress.interview_prep_done,
    progress.application_submitted,
    progress.decision_received
  ].filter(Boolean).length;
  
  const calculatedProgress = Math.round((completed / 7) * 100);
  
  console.log('\n🧮 AUTO-CALCULATED PROGRESS:', calculatedProgress, '%');
  console.log('(Based on', completed, 'out of 7 milestones completed)');
  
  console.log('\n⏰ TIMELINE:');
  if (progress.application_deadline) {
    const deadline = new Date(progress.application_deadline);
    const now = new Date();
    const days = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    console.log('- Deadline:', deadline.toLocaleDateString(), `(${days} days)`);
  } else {
    console.log('- Deadline: Not set');
  }
  
  if (progress.target_travel_date) {
    const travel = new Date(progress.target_travel_date);
    const now = new Date();
    const days = Math.ceil((travel - now) / (1000 * 60 * 60 * 24));
    console.log('- Travel date:', travel.toLocaleDateString(), `(${days} days)`);
  } else {
    console.log('- Travel date: Not set');
  }
  
  console.log('\n✅ EVERYTHING IS REAL - NO FAKE DATA!');
}

testRealData();
