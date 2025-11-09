import { NextRequest, NextResponse } from 'next/server';
import { analyzeProofOfFunds } from '@/ai/flows/analyze-proof-of-funds';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let destinationCountry: string;
    let currency: string;
    let visaType: string;
    let familyMembers: number;
    let fileList: Array<{ name: string; buffer: Buffer; mimetype: string }> = [];
    let isPremium = false;

    // Check if user is authenticated (premium)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isPremium = !!user;

    if (contentType.includes('multipart/form-data')) {
      // Premium: Handle file uploads
      if (!isPremium) {
        return NextResponse.json(
          { error: 'File upload requires premium access' },
          { status: 403 }
        );
      }

      const formData = await request.formData();
      destinationCountry = formData.get('destinationCountry') as string;
      currency = formData.get('currency') as string;
      visaType = formData.get('visaType') as string || 'student';
      familyMembers = parseInt(formData.get('familyMembers') as string) || 1;

      const files = formData.getAll('files') as File[];
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        fileList.push({
          name: file.name,
          buffer: Buffer.from(bytes),
          mimetype: file.type,
        });
      }
    } else {
      // Free/Premium: Handle JSON requests
      const body = await request.json();
      destinationCountry = body.destinationCountry;
      currency = body.currency;
      visaType = body.visaType || 'student';
      familyMembers = body.familyMembers || 1;

      // Create synthetic text input for basic analysis
      const syntheticText = `
        Destination: ${destinationCountry}
        Visa Type: ${visaType}
        Family Members: ${familyMembers}
        Currency: ${currency}
      `;
      
      fileList = [{
        name: 'requirements-request.txt',
        buffer: Buffer.from(syntheticText),
        mimetype: 'text/plain'
      }];
    }

    // Call AI analysis (with extended params for context)
    const fullResult = await analyzeProofOfFunds({
      fileList,
      destinationCountry,
      currency
    } as any);

    // Filter results based on premium status
    if (!isPremium) {
      // FREE VERSION: Return limited teaser
      const calculatedMinimum = calculateMinimum(destinationCountry, visaType, familyMembers);
      
      return NextResponse.json({
        isPremium: false,
        summary: {
          destinationCountry,
          visaType,
          familyMembers,
          minimumAmountUSD: calculatedMinimum,
          minimumAmountNGN: calculatedMinimum * 1500,
          seasoningDays: 90,
          currency
        },
        basicRequirements: fullResult.requirements?.generic?.slice(0, 3) || [
          'Official bank statements (last 6 months)',
          'Bank letter on official letterhead',
          'Source of funds declaration'
        ],
        criticalWarnings: fullResult.insights?.filter((i: any) => i.type === 'error').slice(0, 2) || [
          {
            type: 'warning',
            title: 'Account Seasoning Critical',
            description: 'Embassy requires funds to be in account for minimum 90 days. Recent deposits often trigger rejections.'
          },
          {
            type: 'warning',
            title: 'Large Unexplained Deposits',
            description: 'Deposits over 30% of average balance within 60 days need detailed explanation.'
          }
        ],
        hiddenIssuesCount: (fullResult.insights?.length || 4) - 2,
        rejectionStats: getRejectionStats(destinationCountry),
        upgradeMessage: 'Upgrade to see full compliance analysis, document scanning, and all red flags'
      });
    }

    // PREMIUM VERSION: Return full analysis
    return NextResponse.json({
      isPremium: true,
      ...fullResult,
      canGeneratePDF: true
    });

  } catch (err: any) {
    console.error('POF API error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}

function calculateMinimum(country: string, visaType: string, familyMembers: number): number {
  const baseRates: Record<string, Record<string, number>> = {
    'United States': { student: 12000, work: 15000, visitor: 8000 },
    'Canada': { student: 10000, work: 12500, visitor: 5000 },
    'United Kingdom': { student: 9200, work: 12000, visitor: 3000 },
    'Germany': { student: 8700, work: 11000, visitor: 4500 },
    'Australia': { student: 17000, work: 21000, visitor: 5000 },
    'France': { student: 8200, work: 10500, visitor: 4000 }
  };

  const base = baseRates[country]?.[visaType] || 10000;
  const multipliers: Record<string, number> = {
    student: 0.3,
    work: 0.25,
    visitor: 0.2
  };
  
  return Math.round(base * (1 + (familyMembers - 1) * (multipliers[visaType] || 0.3)));
}

function getRejectionStats(country: string): any {
  const stats: Record<string, any> = {
    'United States': {
      rate: '41%',
      topReason: 'Insufficient proof of funds',
      year: 2024
    },
    'Canada': {
      rate: '38%',
      topReason: 'Inadequate financial documentation',
      year: 2024
    },
    'United Kingdom': {
      rate: '35%',
      topReason: 'Poor account seasoning',
      year: 2024
    },
    default: {
      rate: '43%',
      topReason: 'Proof of funds issues',
      year: 2024
    }
  };

  return stats[country] || stats.default;
}