console.log('🔍 CHECKING ENVIRONMENT VARIABLES\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('Required Variables:');
requiredVars.forEach(varName => {
  const exists = !!process.env[varName];
  const value = process.env[varName];
  console.log(`${exists ? '✅' : '❌'} ${varName}: ${exists ? value.substring(0, 20) + '...' : 'MISSING'}`);
});

console.log('\nOptional Variables:');
optionalVars.forEach(varName => {
  const exists = !!process.env[varName];
  const value = process.env[varName];
  console.log(`${exists ? '✅' : '⚠️'} ${varName}: ${exists ? value.substring(0, 20) + '...' : 'Not set'}`);
});

console.log('\n📊 If any required variables are missing:');
console.log('1. Go to Vercel Dashboard');
console.log('2. Your Project → Settings → Environment Variables');
console.log('3. Add missing variables');
console.log('4. Redeploy');
