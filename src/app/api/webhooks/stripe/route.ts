import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

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
      const email =
        session.customer_email || session.metadata?.email;

      if (!userId) {
        console.error('Missing userId in session metadata');
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const supabase = createAdminClient();

      // ===============================
      // IDEMPOTENCY CHECK
      // ===============================
      const paymentIntentId = (session.payment_intent as string) || (session.id as string);

      if (!paymentIntentId) {
        console.error('Missing stripe payment_intent');
        return NextResponse.json({ error: 'Invalid payment reference' }, { status: 400 });
      }

      const { data: existingPayment, error: fetchError } = await supabase
        .from('payments')
        .select('id')
        .eq('stripe_payment_id', paymentIntentId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing payment:', fetchError);
        throw fetchError;
      }

      if (existingPayment) {
        console.log('⚠️ Duplicate Stripe webhook ignored:', paymentIntentId);
        return NextResponse.json({ received: true });
      }

      // ===============================
      // INSERT PAYMENT
      // ===============================
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: userId,
        stripe_payment_id: paymentIntentId,
        amount: (session.amount_total || 0) / 100,
        status: 'succeeded',
        product_name: planName || 'Premium Plan',
        subscription_tier: 'premium',
      });

      if (paymentError) {
        console.error('Payment insert error:', paymentError);
        throw paymentError;
      }

      // ===============================
      // UPGRADE USER
      // ===============================
      const { error: upgradeError } = await supabase.rpc('upgrade_to_premium', {
        user_uuid: userId,
      });

      if (upgradeError) {
        console.error('Upgrade error:', upgradeError);
        throw upgradeError;
      }

      console.log(`✅ Stripe payment confirmed for user ${userId}, plan ${planName}`);

      // ===============================
      // RESEND RICH ONBOARDING EMAIL
      // ===============================
      if (resend && email) {
        await resend.emails.send({
          from: 'Japa Genie <onboarding@japagenie.com>',
          to: email,
          subject: `Welcome to Japa Genie Premium — ${planName}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Welcome to Japa Genie Premium 🚀</h2>

              <p>Hi there,</p>

              <p>Your payment was successful and your account has been upgraded to <b>${planName}</b>.</p>

              <h3>What happens next:</h3>
              <ul>
                <li>Full access to premium AI visa guidance</li>
                <li>Personalized migration pathway support</li>
                <li>Rejection risk insights and optimization tools</li>
                <li>Priority system processing</li>
              </ul>

              <p>
                You can now log in and start your journey immediately:
              </p>

              <p>
                <a href="https://www.japagenie.com/dashboard"
                   style="display:inline-block;padding:10px 15px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
                  Go to Dashboard
                </a>
              </p>

              <p>If you have any issues, reply to this email and our system will assist you.</p>

              <p>— Japa Genie Team</p>
            </div>
          `,
        });

        console.log('📧 Resend onboarding email sent to:', email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
