import { NextResponse } from 'next/server';
import { calculateVisaCost } from '@/ai/flows/visa-cost-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = await calculateVisaCost({
      originCountry: body.originCountry,
      destinationCountry: body.destinationCountry,
      visaType: body.visaType,
      dependents: body.dependents || 0,
      travelDate: body.travelDate
    });
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Cost calculator API error:', error);
    return NextResponse.json(
      { error: error.message || 'Cost calculation failed' },
      { status: 500 }
    );
  }
}
