// src/app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { createClient } from '@/lib/supabase/server';
import { findPlanByKeyOrName } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const plan = findPlanByKeyOrName({
      planKey: body.planKey,
      key: body.key,
      name: body.name,
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!plan.priceId || !plan.priceId.startsWith('price_')) {
      console.error('Stripe price ID missing/malformed for plan:', {
        key: plan.key,
        name: plan.name,
        hasPriceId: !!plan.priceId,
      });

      return NextResponse.json(
        { error: `Stripe price is not configured for ${plan.name}` },
        { status: 500 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get('origin') ||
      'https://www.japagenie.com';

    const successUrl = new URL('/api/payment-success', origin);
    successUrl.searchParams.set('returnTo', '/dashboard');
    successUrl.searchParams.set('plan', plan.key);

    const cancelUrl = new URL('/pricing', origin);
    cancelUrl.searchParams.set('canceled', 'true');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: plan.checkoutMode,
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      client_reference_id: user.id,
      customer_email: user.email || undefined,
      metadata: {
        userId: user.id,
        planKey: plan.key,
        planName: plan.name,
        checkoutMode: plan.checkoutMode,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
