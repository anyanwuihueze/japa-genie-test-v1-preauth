// src/components/dashboard/proof-of-funds-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface POFData {
  target_country?: string;
  visa_type?: string;
  required_amount: number;
  current_amount: number;
  currency: string;
  account_seasoning_days: number;
  target_seasoning_days: number;
  source_of_funds: string[];
  status: string;
  documents_uploaded: string[];
}

export function ProofOfFundsCard({ userId }: { userId: string }) {
  const [pofData, setPofData] = useState<POFData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPOFData();
  }, [userId]);

  const fetchPOFData = async () => {
    const supabase = createClient();
    
    try {
      // Get user's POF data
      const { data: userPof } = await supabase
        .from('user_proof_of_funds')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userPof) {
        setPofData(userPof);
      } else {
        // Create default POF data if none exists
        const defaultData: POFData = {
          required_amount: 0,
          current_amount: 0,
          currency: 'NGN',
          account_seasoning_days: 0,
          target_seasoning_days: 90,
          source_of_funds: [],
          status: 'not_started',
          documents_uploaded: []
        };
        setPofData(defaultData);
      }
    } catch (error) {
      console.error('POF data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryRequirements = async (country: string, visaType: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('proof_of_funds_requirements')
      .select('*')
      .eq('country', country)
      .eq('visa_type', visaType)
      .single();
    
    return data;
  };

  const calculatePOFProgress = () => {
    if (!pofData || pofData.required_amount === 0) return 0;
    return Math.min((pofData.current_amount / pofData.required_amount) * 100, 100);
  };

  const calculateSeasoningProgress = () => {
    if (!pofData) return 0;
    return Math.min((pofData.account_seasoning_days / pofData.target_seasoning_days) * 100, 100);
  };

  const getStatusBadge = () => {
    if (!pofData) return null;
    
    const progress = calculatePOFProgress();
    const seasoningProgress = calculateSeasoningProgress();

    if (progress >= 100 && seasoningProgress >= 100) {
      return <Badge className="bg-green-100 text-green-800">Ready to Submit</Badge>;
    } else if (progress >= 100) {
      return <Badge className="bg-yellow-100 text-yellow-800">Waiting for Seasoning</Badge>;
    } else if (progress >= 50) {
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  const progress = calculatePOFProgress();
  const seasoningProgress = calculateSeasoningProgress();

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Proof of Funds
            </CardTitle>
            <CardDescription>
              Track and manage your financial requirements
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Funds Available</span>
            <span className="text-muted-foreground">
              {pofData?.current_amount.toLocaleString()} {pofData?.currency} / {' '}
              {pofData?.required_amount > 0 ? pofData.required_amount.toLocaleString() : '?'} {pofData?.currency}
            </span>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current Balance</span>
            <span>{Math.round(progress)}% of target</span>
          </div>
        </div>

        {/* Account Seasoning */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Account Seasoning
            </span>
            <span className="text-muted-foreground">
              {pofData?.account_seasoning_days} / {pofData?.target_seasoning_days} days
            </span>
          </div>
          <Progress value={seasoningProgress} className="w-full h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Days in account</span>
            <span>{Math.round(seasoningProgress)}% complete</span>
          </div>
        </div>

        {/* Source of Funds */}
        {pofData?.source_of_funds && pofData.source_of_funds.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Source of Funds</div>
            <div className="flex flex-wrap gap-2">
              {pofData.source_of_funds.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/dashboard/proof-of-funds">
              Manage Proof of Funds
            </Link>
          </Button>

          {/* Expert Help CTA */}
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-orange-800 text-sm">
                  Need Expert Help?
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  Complex finances? Get 1-on-1 help with business income, gifts, sponsorships
                </p>
                <Button variant="link" className="h-auto p-0 text-orange-600 text-xs" asChild>
                  <Link href="/experts?service=proof-of-funds">
                    Get Funds Review with Expert →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {pofData?.documents_uploaded.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {pofData?.target_seasoning_days - (pofData?.account_seasoning_days || 0)}
            </div>
            <div className="text-xs text-muted-foreground">Days Left</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {progress >= 100 && seasoningProgress >= 100 ? '✅' : '⏳'}
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}