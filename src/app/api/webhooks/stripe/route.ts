import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Stripe webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName;

      if (!userId) {
        console.error('Missing userId in session metadata');
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const supabase = createAdminClient();

      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: userId,
        stripe_payment_id: session.payment_intent as string,
        amount: (session.amount_total || 0) / 100,
        status: 'succeeded',
        product_name: planName || 'Premium Plan',
        subscription_tier: 'premium',
      });

      if (paymentError) {
        console.error('Payment insert error:', paymentError);
        throw paymentError;
      }

      const { error: upgradeError } = await supabase.rpc('upgrade_to_premium', {
        user_uuid: userId,
      });

      if (upgradeError) {
        console.error('Upgrade error:', upgradeError);
        throw upgradeError;
      }

      console.log(`✅ Stripe payment confirmed for user ${userId}, plan ${planName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
