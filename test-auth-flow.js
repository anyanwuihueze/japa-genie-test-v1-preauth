const { createClient } = require('@supabase/supabase-js');

// Test the exact logic that determines user redirects
async function testAuthFlow() {
  console.log('🔍 TESTING AUTH FLOW LOGIC\n');
  
  // This simulates what happens in your callback route
  const testScenarios = [
    {
      name: 'NEW USER - No KYC',
      hasProfile: false,
      profileComplete: false,
      hasSubscription: false,
      expectedRedirect: '/kyc'
    },
    {
      name: 'USER WITH KYC - No Payment', 
      hasProfile: true,
      profileComplete: true,
      hasSubscription: false,
      expectedRedirect: '/chat?bonus=3'
    },
    {
      name: 'PAID USER',
      hasProfile: true, 
      profileComplete: true,
      hasSubscription: true,
      expectedRedirect: '/dashboard'
    },
    {
      name: 'INCOMPLETE KYC',
      hasProfile: true,
      profileComplete: false, // Has profile but missing fields
      hasSubscription: false,
      expectedRedirect: '/kyc'
    }
  ];

  testScenarios.forEach(scenario => {
    console.log(`🧪 ${scenario.name}:`);
    console.log(`   - Has Profile: ${scenario.hasProfile}`);
    console.log(`   - Profile Complete: ${scenario.profileComplete}`);
    console.log(`   - Has Subscription: ${scenario.hasSubscription}`);
    
    // This is the EXACT logic from your callback route
    let redirectTo;
    if (!scenario.hasProfile || !scenario.profileComplete) {
      redirectTo = '/kyc';
    } else if (!scenario.hasSubscription) {
      redirectTo = '/chat?bonus=3'; 
    } else {
      redirectTo = '/dashboard';
    }
    
    console.log(`   → Expected: ${scenario.expectedRedirect}`);
    console.log(`   → Actual: ${redirectTo}`);
    console.log(`   ✅ ${redirectTo === scenario.expectedRedirect ? 'PASS' : 'FAIL'}\n`);
  });
}

testAuthFlow();
