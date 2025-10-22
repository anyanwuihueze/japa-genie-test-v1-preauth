import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  try {
    // Skip verification for test mode (add env check for production later)
    if (process.env.NODE_ENV === 'production' && process.env.PAYSTACK_WEBHOOK_SECRET) {
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET).update(body).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      const userId = metadata.userId;
      const planName = metadata.planName;

      const supabase = await createClient();

      // Record payment
      await supabase.from('payments').insert({
        user_id: userId,
        stripe_payment_id: reference,  // Reuse for Paystack ref
        amount: amount / 100,  // Convert from kobo to NGN
        status: 'succeeded',
        product_name: planName,
        subscription_tier: 'premium',
      });

      // Upgrade user
      await supabase.rpc('upgrade_to_premium', { user_uuid: userId });

      console.log(`Payment confirmed for user ${userId}, plan ${planName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}