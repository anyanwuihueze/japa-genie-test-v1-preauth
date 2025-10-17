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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Visa Guidance',
              description: 'Unlimited wishes + personalized visa roadmap',
            },
            unit_amount: 2900, // $29.00
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

    // Return both sessionId and checkout URL
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