import { NextRequest, NextResponse } from 'next/server';
import Paystack from 'paystack';  // Install via npm
import { createClient } from '@/lib/supabase/server';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planName, planPrice, planDuration } = body;

    if (!planPrice) {
      return NextResponse.json({ error: 'Plan price required' }, { status: 400 });
    }

    const amount = Math.round(planPrice * 100);  // Convert to kobo (NGN subunits)

    const transaction = await paystack.transaction.initialize({
      amount,
      currency: 'NGN',
      email: user.email,
      reference: `tx_${user.id}_${Date.now()}`,  // Unique ref
      callback_url: `${request.headers.get('origin')}/chat?success=true`,
      metadata: {
        planName,
        planDuration,
        userId: user.id,
      },
      channels: ['card', 'bank_transfer', 'ussd', 'mobile_money'],  // Non-card options
    });

    return NextResponse.json({
      url: transaction.data.authorization_url,
      reference: transaction.data.reference,
    });
  } catch (error) {
    console.error('Paystack error:', error);
    return NextResponse.json({ error: 'Failed to create Paystack session' }, { status: 500 });
  }
}