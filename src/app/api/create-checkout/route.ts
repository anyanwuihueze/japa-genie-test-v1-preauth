import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, duration } = await request.json();

    if (!price) {
      return NextResponse.json({ error: 'Price required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              description: duration || 'Premium access',
            },
            unit_amount: Math.round(price * 100), // Dynamic price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/chat?success=true`,
      cancel_url: `${request.headers.get('origin')}/checkout?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
