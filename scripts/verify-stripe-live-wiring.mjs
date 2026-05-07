import fs from 'fs';

function loadEnv(path) {
  if (!fs.existsSync(path)) return;

  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv('.env.local');

const checks = [
  ['STRIPE_SECRET_KEY', 'sk_live_'],
  ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_live_'],
  ['STRIPE_WEBHOOK_SECRET', 'whsec_'],
  ['STRIPE_PRICE_ONE_WEEK', 'price_'],
  ['STRIPE_PRICE_TWO_WEEKS', 'price_'],
  ['STRIPE_PRICE_THREE_WEEKS', 'price_'],
  ['STRIPE_PRICE_PRO_MONTHLY', 'price_'],
  ['STRIPE_PRICE_HOLD_MY_HAND', 'price_'],
];

let failed = false;

console.log('=== Stripe Live Wiring Check ===');

for (const [name, prefix] of checks) {
  const value = process.env[name] || '';
  const ok = value.startsWith(prefix);

  console.log(`${ok ? '✅' : '❌'} ${name}: ${ok ? prefix + '***' : 'missing or wrong prefix'}`);

  if (!ok) failed = true;
}

const pricing = fs.readFileSync('src/lib/pricing.ts', 'utf8');
const checkout = fs.readFileSync('src/app/api/create-checkout/route.ts', 'utf8');

if (pricing.includes('price_1PX2hYRxp7zXO3s9o2r5dC0h')) {
  console.log('❌ Old hardcoded test/shared price ID still exists in src/lib/pricing.ts');
  failed = true;
} else {
  console.log('✅ Old hardcoded shared price ID removed from src/lib/pricing.ts');
}

if (checkout.includes('price_data')) {
  console.log('❌ create-checkout still uses client-driven price_data');
  failed = true;
} else {
  console.log('✅ create-checkout uses Stripe price IDs, not client-driven price_data');
}

if (checkout.includes('mode: plan.checkoutMode')) {
  console.log('✅ create-checkout uses payment/subscription mode from server plan');
} else {
  console.log('❌ create-checkout does not use server plan checkoutMode');
  failed = true;
}

if (failed) {
  console.error('\nStripe live wiring check FAILED.');
  process.exit(1);
}

console.log('\nStripe live wiring check PASSED.');
