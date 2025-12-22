// src/app/api/paystack/create/route.ts - UPDATE SUCCESS URL ONLY
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Fixed exchange rate (update periodically)
const USD_TO_NGN_RATE = 1500;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, duration } = await request.json();

    if (!price) {
      return NextResponse.json({ error: 'Plan price required' }, { status: 400 });
    }

    // Convert USD to NGN
    const priceInNGN = price * USD_TO_NGN_RATE;
    const amount = Math.round(priceInNGN * 100); // Kobo
    const reference = `tx_${user.id}_${Date.now()}`;

    console.log(`💰 Converting: $${price} USD = ₦${priceInNGN.toLocaleString()} NGN`);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        email: user.email,
        currency: 'NGN',
        reference,
        // ✅ UPDATED: Point to our payment-success handler
        callback_url: `${request.headers.get('origin')}/api/payment-success?returnTo=/dashboard&plan=pro`,
        metadata: {
          userId: user.id,
          planName: name,
          planDuration: duration,
          usdPrice: price,
          ngnPrice: priceInNGN,
          exchangeRate: USD_TO_NGN_RATE,
        },
        channels: ['card', 'bank_transfer', 'ussd', 'mobile_money'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Paystack initialize error:', errorData);
      throw new Error(errorData.message || 'Initialize failed');
    }

    const data = await response.json();
    return NextResponse.json({
      url: data.data.authorization_url,
      reference: data.data.reference,
      ngnAmount: priceInNGN,
      usdAmount: price,
    });
  } catch (error: any) {
    console.error('Paystack error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create Paystack session' 
    }, { status: 500 });
  }
}