'use client';

import { useState } from 'react';
import { getVisaCost } from '@/lib/ai/cost-generator';
import { JapaGenieBadge } from '@/components/ui/japa-genie-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lock, TrendingUp, AlertCircle, DollarSign, Clock, ArrowRight, CheckCircle, Mail, Sparkles, ShieldAlert } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';
import { useRouter, useSearchParams } from 'next/navigation';

const VISA_TYPES = ['Student', 'Work', 'Tourist', 'Business', 'Spouse', 'Permanent'];

export function TrueVisaCostCalculator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnlocked = searchParams?.get('unlocked') === 'true';
  
  const [country, setCountry] = useState<string>('');
  const [visaType, setVisaType] = useState<string>('');
  const [dependents, setDependents] = useState<string>('0');
  const [showResults, setShowResults] = useState(false);
  const [loadingCost, setLoadingCost] = useState(false);
  const [costData, setCostData] = useState<{total: number; breakdown: any; isEstimated: boolean} | null>(null);

  const handleCalculate = async () => {
    if (!country || !visaType) return;
    
    setLoadingCost(true);
    try {
      const { data, isEstimated } = await getVisaCost(country, visaType);
      setCostData({
        total: data.totalCost,
        breakdown: data.breakdown,
        isEstimated
      });
    } catch (error) {
      console.error('Failed to estimate cost:', error);
    } finally {
      setLoadingCost(false);
    }
    
    setShowResults(true);
  };

  const handleUnlock = () => {
    const params = new URLSearchParams();
    params.set('reason', 'cost_calculator');
    params.set('country', country);
    params.set('visa', visaType);
    params.set('returnTo', `/cost-calculator?country=${encodeURIComponent(country)}&visa=${encodeURIComponent(visaType)}&unlocked=true`);
    
    router.push(`/pricing?${params.toString()}`);
  };

  const dependentsCount = parseInt(dependents);
  const hiddenCostsPreview = costData ? Math.round(costData.total * 0.65) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-500 text-white px-4 py-2">
            FREE TOOL - No Login Required
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            True Visa Cost Calculator
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            Most applicants miss $4,850 in hidden visa costs. Calculate yours now—before embassy day. See what your visa{' '}
            <span className="text-red-400 font-bold">REALLY</span> costs—all fees,
            POF requirements, and 12+ hidden charges most people miss.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">195 countries available</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Avg hidden cost: $4,850</span>
            </div>
          </div>
        </div>

        {/* Calculator Card */}
        <Card className="shadow-2xl border-2 border-orange-500/30 bg-slate-800/50 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-b border-orange-500/20">
            <CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-orange-400" />
              Calculate Your True Cost
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Select your destination and visa type to see the complete cost breakdown
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Country Selection - FULL 195 COUNTRIES */}
              <div>
                <label className="block font-semibold mb-2 text-lg text-white flex items-center gap-2">
                  🌍 Where do you want to go?
                </label>
                <Select value={country} onValueChange={(val) => { 
                  setCountry(val); 
                  setVisaType(''); 
                  setShowResults(false);
                  setCostData(null);
                }}>
                  <SelectTrigger className="w-full text-lg p-6 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select from 195 countries" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    {ALL_COUNTRIES.map((countryName) => (
                      <SelectItem key={countryName} value={countryName}>
                        {countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visa Type */}
              {country && (
                <div>
                  <label className="block font-semibold mb-2 text-lg text-white flex items-center gap-2">
                    📋 What type of visa?
                  </label>
                  <Select value={visaType} onValueChange={(val) => { 
                    setVisaType(val); 
                    setShowResults(false);
                    setCostData(null);
                  }}>
                    <SelectTrigger className="w-full text-lg p-6 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISA_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type} Visa</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Dependents */}
              {visaType && (
                <div>
                  <label className="block font-semibold mb-2 text-lg text-white flex items-center gap-2">
                    👨‍👩‍👧‍👦 Traveling with family?
                  </label>
                  <Select value={dependents} onValueChange={(val) => { 
                    setDependents(val); 
                    setShowResults(false);
                  }}>
                    <SelectTrigger className="w-full text-lg p-6 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Just me</SelectItem>
                      <SelectItem value="1">Me + 1 dependent (+50% costs)</SelectItem>
                      <SelectItem value="2">Me + 2 dependents (+100% costs)</SelectItem>
                      <SelectItem value="3">Me + 3+ dependents (+150% costs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleCalculate} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6 font-bold"
                disabled={!country || !visaType || loadingCost}
              >
                {loadingCost ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Japa Genie is calculating...
                  </span>
                ) : (
                  '�� Reveal My True Visa Cost'
                )}
              </Button>
            </div>

            {/* JUICY RESULTS PREVIEW */}
            {showResults && costData && (
              <div className="mt-8 space-y-6">
                {/* Shocking Preview Card */}
                <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-white flex items-center gap-2">
                      <ShieldAlert className="w-6 h-6 text-red-400" />
                      🚨 Hidden Costs Alert
                    </h3>
                    {costData.isEstimated && <JapaGenieBadge />}
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-slate-300 mb-2">Most people only budget for:</p>
                    <p className="text-3xl font-bold text-green-400">
                      ${Math.round(costData.total * 0.35).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400">(Application fee + basic fees)</p>
                  </div>

                  <div className="bg-red-950/50 rounded-lg p-4 mb-4">
                    <p className="text-red-200 text-center text-lg">
                      But you're missing <span className="text-3xl font-bold text-red-400">${hiddenCostsPreview.toLocaleString()}</span> in hidden costs!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-slate-400">Flight & Travel</p>
                      <p className="text-lg font-bold text-white">~${costData.breakdown.visaFee}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-slate-400">Health Insurance</p>
                      <p className="text-lg font-bold text-white">~${costData.breakdown.insurance}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm text-center mb-4">
                    �� <strong>+ 10 more hidden costs</strong> revealed after free signup
                  </p>
                </div>

                {/* URGENCY STATS */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">68%</p>
                    <p className="text-xs text-slate-400">get shocked by hidden costs</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">$4,850</p>
                    <p className="text-xs text-slate-400">average missed in budgeting</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">15 min</p>
                    <p className="text-xs text-slate-400">to get full breakdown</p>
                  </div>
                </div>

                {/* LOCKED FULL BREAKDOWN */}
                {!isUnlocked && (
                  <div className="relative">
                    <div className="bg-slate-900/80 border-2 border-slate-700 rounded-xl p-6 blur-sm">
                      <h3 className="font-bold text-xl mb-4 text-white">Complete 12-Item Cost Breakdown</h3>
                      <div className="space-y-2 opacity-50">
                        <div className="flex justify-between text-slate-300"><span>Medical Examination:</span><span>$XXX</span></div>
                        <div className="flex justify-between text-slate-300"><span>Document Translation:</span><span>$XXX</span></div>
                        <div className="flex justify-between text-slate-300"><span>Police Clearance:</span><span>$XXX</span></div>
                        <p className="text-sm text-slate-500">+ 8 more items...</p>
                      </div>
                    </div>

                    {/* Unlock Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Card className="bg-slate-900/98 backdrop-blur-sm border-4 border-orange-500 shadow-2xl p-8 max-w-md mx-4">
                        <div className="text-center space-y-4">
                          <Lock className="w-16 h-16 text-orange-500 mx-auto" />
                          <h3 className="font-bold text-2xl text-white">🔓 Unlock Full Breakdown</h3>
                          <p className="text-slate-300">See all 12 hidden costs for {country} {visaType} visa</p>
                          
                          <div className="bg-green-900/30 border border-green-500/30 rounded p-3 text-sm">
                            <p className="font-semibold text-green-400 mb-2">✨ Free account includes:</p>
                            <ul className="text-left space-y-1 text-green-300 text-xs">
                              <li>✅ Complete 12-item cost breakdown</li>
                              <li>✅ Monthly savings plan</li>
                              <li>✅ POF seasoning timeline</li>
                              <li>✅ Cost optimization tips</li>
                            </ul>
                          </div>

                          <Button 
                            onClick={handleUnlock}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6 font-bold"
                          >
                            View Plans & Unlock
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>

                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* UNLOCKED STATE */}
                {isUnlocked && (
                  <div className="bg-green-900/20 border-2 border-green-500/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div>
                        <h3 className="font-bold text-xl text-white">🎉 Full Access Unlocked!</h3>
                        <p className="text-green-300">Here's your complete cost breakdown</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Medical Examination</span>
                        <span className="font-bold text-white">${costData.breakdown.visaFee}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Document Translation & Legalization</span>
                        <span className="font-bold text-white">${costData.breakdown.documentProcessing}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Service & Processing Fees</span>
                        <span className="font-bold text-white">${costData.breakdown.serviceFee}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Health Insurance</span>
                        <span className="font-bold text-white">${costData.breakdown.insurance}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">TOTAL ESTIMATED COST:</span>
                        <span className="text-3xl font-bold text-green-400">${costData.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <Button 
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
