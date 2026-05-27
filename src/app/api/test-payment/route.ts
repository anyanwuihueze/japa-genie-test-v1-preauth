import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Japa Genie Test Payment ($1)',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?test=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?test=cancel`,

      client_reference_id: user.id,

      metadata: {
        userId: user.id,
        planName: 'TEST_1_DOLLAR_PLAN',
      },

      customer_email: user.email || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Test payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create test session' },
      { status: 500 }
    );
  }
}
