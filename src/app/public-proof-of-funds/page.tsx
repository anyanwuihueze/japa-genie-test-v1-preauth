"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, CheckCircle, AlertTriangle, Lock, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const countryData = {
  'United States': { flag: '🇺🇸', currency: 'USD' },
  'Canada': { flag: '🇨🇦', currency: 'CAD' },
  'United Kingdom': { flag: '🇬🇧', currency: 'GBP' },
  'Germany': { flag: '🇩🇪', currency: 'EUR' },
  'Australia': { flag: '🇦🇺', currency: 'AUD' },
  'France': { flag: '🇫🇷', currency: 'EUR' },
  'Netherlands': { flag: '🇳🇱', currency: 'EUR' },
  'Ireland': { flag: '🇮🇪', currency: 'EUR' },
  'New Zealand': { flag: '🇳🇿', currency: 'NZD' },
  'Singapore': { flag: '🇸🇬', currency: 'SGD' },
  'Dubai (UAE)': { flag: '🇦🇪', currency: 'AED' },
  'Switzerland': { flag: '🇨🇭', currency: 'CHF' },
  'Spain': { flag: '🇪🇸', currency: 'EUR' },
  'Italy': { flag: '🇮🇹', currency: 'EUR' },
  'Portugal': { flag: '🇵🇹', currency: 'EUR' },
  'Belgium': { flag: '🇧🇪', currency: 'EUR' },
  'Sweden': { flag: '🇸🇪', currency: 'SEK' },
  'Norway': { flag: '🇳🇴', currency: 'NOK' },
  'Denmark': { flag: '🇩🇰', currency: 'DKK' },
  'Finland': { flag: '🇫🇮', currency: 'EUR' },
  'Austria': { flag: '🇦🇹', currency: 'EUR' },
  'Poland': { flag: '🇵🇱', currency: 'PLN' },
  'Czech Republic': { flag: '🇨🇿', currency: 'CZK' },
  'Hungary': { flag: '🇭🇺', currency: 'HUF' },
  'Greece': { flag: '🇬🇷', currency: 'EUR' },
  'Turkey': { flag: '🇹🇷', currency: 'TRY' },
  'South Africa': { flag: '🇿🇦', currency: 'ZAR' },
  'Kenya': { flag: '🇰🇪', currency: 'KES' },
  'Ghana': { flag: '🇬🇭', currency: 'GHS' },
  'Egypt': { flag: '🇪🇬', currency: 'EGP' },
  'Japan': { flag: '🇯🇵', currency: 'JPY' },
  'South Korea': { flag: '🇰🇷', currency: 'KRW' },
  'China': { flag: '🇨🇳', currency: 'CNY' },
  'Hong Kong': { flag: '🇭🇰', currency: 'HKD' },
  'Malaysia': { flag: '🇲🇾', currency: 'MYR' },
  'Thailand': { flag: '🇹🇭', currency: 'THB' },
  'Philippines': { flag: '🇵🇭', currency: 'PHP' },
  'Vietnam': { flag: '🇻🇳', currency: 'VND' },
  'Indonesia': { flag: '🇮🇩', currency: 'IDR' },
  'India': { flag: '🇮🇳', currency: 'INR' },
  'Pakistan': { flag: '🇵🇰', currency: 'PKR' },
  'Bangladesh': { flag: '🇧🇩', currency: 'BDT' },
  'Sri Lanka': { flag: '🇱🇰', currency: 'LKR' },
  'Brazil': { flag: '🇧🇷', currency: 'BRL' },
  'Argentina': { flag: '🇦🇷', currency: 'ARS' },
  'Chile': { flag: '🇨🇱', currency: 'CLP' },
  'Mexico': { flag: '🇲🇽', currency: 'MXN' },
  'Colombia': { flag: '🇨🇴', currency: 'COP' },
  'Peru': { flag: '🇵🇪', currency: 'PEN' },
  'Israel': { flag: '🇮🇱', currency: 'ILS' },
  'Saudi Arabia': { flag: '🇸🇦', currency: 'SAR' },
  'Qatar': { flag: '🇶🇦', currency: 'QAR' },
  'Kuwait': { flag: '🇰🇼', currency: 'KWD' },
  'Bahrain': { flag: '🇧🇭', currency: 'BHD' },
  'Oman': { flag: '🇴🇲', currency: 'OMR' },
  'Lebanon': { flag: '🇱🇧', currency: 'LBP' },
  'Jordan': { flag: '🇯🇴', currency: 'JOD' },
  'Morocco': { flag: '🇲🇦', currency: 'MAD' },
  'Tunisia': { flag: '🇹🇳', currency: 'TND' },
  'Algeria': { flag: '🇩🇿', currency: 'DZD' },
};

const visaTypes = [
  { value: 'student', label: '🎓 Student Visa' },
  { value: 'work', label: '💼 Work Visa' },
  { value: 'visitor', label: '✈️ Visitor Visa' },
];

const familyOptions = [
  { value: 1, label: 'Just me (solo)' },
  { value: 2, label: 'Me + 1 family member' },
  { value: 3, label: 'Me + 2 family members' },
  { value: 4, label: 'Me + 3 family members' },
];

export default function PublicProofOfFunds() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisa, setSelectedVisa] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRequirements = async () => {
    if (!selectedCountry || !selectedVisa) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Sample bank statement text for the MVP
      const sampleText = `Bank: Access Bank PLC
Balance: ${(selectedFamily * 8500000).toLocaleString()} NGN
Avg 6M: ${(selectedFamily * 8000000).toLocaleString()} NGN
Lump credit: ${(selectedFamily * 3000000).toLocaleString()} NGN 2024-05-22 (no note)`;

      const response = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCountry: selectedCountry,
          currency: countryData[selectedCountry as keyof typeof countryData]?.currency || 'USD',
          visaType: selectedVisa,
          familyMembers: selectedFamily,
          text: sampleText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Proof of Funds Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get AI-powered embassy requirements in 30 seconds. Stop guessing — know exactly what you need.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">2,000+ Successful Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">60+ Countries Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </div>
          </div>
        </header>

        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0 shadow-2xl mb-16">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl mb-4">Get Your AI-Powered Analysis</CardTitle>
            <CardDescription className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
              Answer 3 questions. AI analyzes embassy requirements in real-time.
            </CardDescription>
            
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="text-left">
                <label className="text-white/80 text-sm font-medium mb-2 block">🎯 Target Country</label>
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  <option value="" className="text-gray-900">Select your destination...</option>
                  {Object.entries(countryData).map(([name, data]) => (
                    <option key={name} value={name} className="text-gray-900">
                      {data.flag} {name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-left">
                <label className="text-white/80 text-sm font-medium mb-2 block">📝 Visa Type</label>
                <select 
                  value={selectedVisa} 
                  onChange={(e) => setSelectedVisa(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  <option value="" className="text-gray-900">What's your visa goal?</option>
                  {visaTypes.map(visa => (
                    <option key={visa.value} value={visa.value} className="text-gray-900">
                      {visa.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-left">
                <label className="text-white/80 text-sm font-medium mb-2 block">👨‍👩‍👧‍👦 Family Members</label>
                <select 
                  value={selectedFamily} 
                  onChange={(e) => setSelectedFamily(Number(e.target.value))}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  {familyOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold text-lg py-6 px-8 shadow-lg"
              onClick={analyzeRequirements}
              disabled={!selectedCountry || !selectedVisa || isAnalyzing}
            >
              {isAnalyzing ? (
                <>⏳ AI Analyzing...</>
              ) : (
                <>🤖 Get AI Analysis</>
              )}
            </Button>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-300">
                <p className="text-white font-semibold">⚠️ {error}</p>
                <p className="text-white/80 text-sm mt-1">Please make sure your API endpoint is working correctly.</p>
              </div>
            )}
          </CardHeader>
        </Card>

        {results && !isAnalyzing && (
          <>
            <Card className="mb-8 border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Based on current {results.summary?.destinationCountry || selectedCountry} embassy requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <div className="text-sm text-green-800 mb-2">Minimum Required</div>
                    <div className="text-3xl font-bold text-green-600">
                      ${results.summary?.minimumAmountUSD?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      ≈ ₦{results.summary?.minimumAmountNGN?.toLocaleString() || '0'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <div className="text-sm text-blue-800 mb-2">Account Seasoning</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {results.summary?.seasoningDays || 90} days
                    </div>
                    <div className="text-sm text-blue-700 mt-1">Minimum required</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <div className="text-sm text-purple-800 mb-2">Visa Type</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {visaTypes.find(v => v.value === selectedVisa)?.label}
                    </div>
                    <div className="text-sm text-purple-700 mt-1">
                      {results.summary?.familyMembers || selectedFamily} {(results.summary?.familyMembers || selectedFamily) === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Basic Requirements
                  </h3>
                  <ul className="space-y-2">
                    {(results.basicRequirements || []).map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Critical Warnings Detected
                  </h3>
                  
                  {(results.criticalWarnings || []).map((warning: any, i: number) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900">{warning.title}</p>
                          <p className="text-sm text-amber-800 mt-1">{warning.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">
                      {results.hiddenIssuesCount || 5} more critical issues detected
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Upgrade to see full compliance analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results.rejectionStats && (
              <Card className="mb-8 bg-red-50 border-2 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-900 text-lg mb-2">
                        {results.rejectionStats.rate} Rejection Rate
                      </h3>
                      <p className="text-red-800">
                        <strong>{results.rejectionStats.rate}</strong> of Nigerian applicants were rejected for 
                        {' '}<strong>{results.summary?.destinationCountry || selectedCountry}</strong> visas in {results.rejectionStats.year}.
                      </p>
                      <p className="text-sm text-red-700 mt-2">
                        Top reason: {results.rejectionStats.topReason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-amber-600" />
            </div>
            <CardTitle className="text-3xl mb-4">Upgrade for Full Analysis</CardTitle>
            <CardDescription className="text-lg text-gray-700">
              This free version shows basics. Premium unlocks AI document analysis, red flag detection, and embassy-ready reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Free Version (Current):
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2 opacity-60">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>Basic minimum amount calculation</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-60">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>Generic requirements list</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-60">
                    <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>2 critical warnings (partial)</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-60">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span className="line-through">No document upload</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-60">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span className="line-through">No AI statement analysis</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-60">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span className="line-through">No compliance score</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Premium Features:
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">Upload & analyze bank statements (PDF/images)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">AI detects ALL red flags (suspicious transactions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">Account-by-account breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">Compliance score (0-10) for your embassy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">Professional PDF report generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="font-semibold">Bank letter templates</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-lg py-6 px-12 shadow-xl">
                  Unlock Full AI Analysis
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-gray-600 mt-4">Starting at $10 for 1 week access</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Real Requirements from Popular Destinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl text-center border-2 border-green-100">
              <div className="font-bold text-green-600 text-lg">🇨🇦 Canada Student</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦15M+</div>
              <div className="text-gray-600">90 days seasoning required</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center border-2 border-blue-100">
              <div className="font-bold text-blue-600 text-lg">🇬🇧 UK Student</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦13.8M+</div>
              <div className="text-gray-600">90 days seasoning required</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center border-2 border-purple-100">
              <div className="font-bold text-purple-600 text-lg">🇺🇸 USA F-1</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦18M+</div>
              <div className="text-gray-600">90 days seasoning required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}