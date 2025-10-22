import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/stripe-server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json();
    const { planName, planPrice, planDuration } = body;

    if (!planPrice) {
      return NextResponse.json({ error: 'Plan price required' }, { status: 400 });
    }

    const unitAmount = planPrice * 100;  // Convert to cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: planDuration,
            },
            unit_amount: unitAmount,  // Dynamic price
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/chat?success=true`,
      cancel_url: `${request.headers.get('origin')}/chat?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email,
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}