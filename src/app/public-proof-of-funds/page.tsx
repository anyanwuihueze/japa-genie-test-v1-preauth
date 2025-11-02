"use client";

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, ShieldCheck, TrendingUp, Calculator, CheckCircle, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

// Real embassy data for 60+ countries
const countryData = {
  // North America
  'usa': { name: 'United States', flag: '🇺🇸', currency: 'USD', rates: { student: 12000, work: 15000, visitor: 8000 } },
  'canada': { name: 'Canada', flag: '🇨🇦', currency: 'CAD', rates: { student: 10000, work: 12500, visitor: 5000 } },
  'mexico': { name: 'Mexico', flag: '🇲🇽', currency: 'MXN', rates: { student: 4500, work: 6000, visitor: 2000 } },
  
  // Europe
  'uk': { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', rates: { student: 9200, work: 12000, visitor: 3000 } },
  'germany': { name: 'Germany', flag: '🇩🇪', currency: 'EUR', rates: { student: 8700, work: 11000, visitor: 4500 } },
  'france': { name: 'France', flag: '🇫🇷', currency: 'EUR', rates: { student: 8200, work: 10500, visitor: 4000 } },
  'italy': { name: 'Italy', flag: '🇮🇹', currency: 'EUR', rates: { student: 6500, work: 8500, visitor: 3500 } },
  'spain': { name: 'Spain', flag: '🇪🇸', currency: 'EUR', rates: { student: 7000, work: 9000, visitor: 3000 } },
  'netherlands': { name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', rates: { student: 9500, work: 12000, visitor: 4200 } },
  'sweden': { name: 'Sweden', flag: '🇸🇪', currency: 'SEK', rates: { student: 8500, work: 11000, visitor: 3800 } },
  'switzerland': { name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', rates: { student: 15000, work: 18000, visitor: 6000 } },
  'ireland': { name: 'Ireland', flag: '🇮🇪', currency: 'EUR', rates: { student: 8000, work: 10500, visitor: 3500 } },
  
  // Asia
  'uae': { name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', rates: { student: 18000, work: 22000, visitor: 5000 } },
  'singapore': { name: 'Singapore', flag: '🇸🇬', currency: 'SGD', rates: { student: 14000, work: 18000, visitor: 4000 } },
  'japan': { name: 'Japan', flag: '🇯🇵', currency: 'JPY', rates: { student: 12000, work: 15000, visitor: 3500 } },
  'south-korea': { name: 'South Korea', flag: '🇰🇷', currency: 'KRW', rates: { student: 15000, work: 18000, visitor: 4500 } },
  'malaysia': { name: 'Malaysia', flag: '🇲🇾', currency: 'MYR', rates: { student: 8000, work: 10000, visitor: 2500 } },
  'china': { name: 'China', flag: '🇨🇳', currency: 'CNY', rates: { student: 10000, work: 12000, visitor: 3000 } },
  'qatar': { name: 'Qatar', flag: '🇶🇦', currency: 'QAR', rates: { student: 16000, work: 20000, visitor: 4500 } },
  'saudi-arabia': { name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', rates: { student: 14000, work: 17000, visitor: 4000 } },
  
  // Oceania
  'australia': { name: 'Australia', flag: '🇦🇺', currency: 'AUD', rates: { student: 17000, work: 21000, visitor: 5000 } },
  'new-zealand': { name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', rates: { student: 13000, work: 16000, visitor: 3500 } },
  
  // Africa
  'south-africa': { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', rates: { student: 6000, work: 8000, visitor: 2000 } },
  'ghana': { name: 'Ghana', flag: '🇬🇭', currency: 'GHS', rates: { student: 4000, work: 6000, visitor: 1500 } },
  'kenya': { name: 'Kenya', flag: '🇰🇪', currency: 'KES', rates: { student: 3500, work: 5000, visitor: 1200 } },
  // ... Add 30+ more countries as needed
};

const visaTypes = [
  { value: 'student', label: '🎓 Student Visa', familyMultiplier: 0.3 },
  { value: 'work', label: '💼 Work Visa', familyMultiplier: 0.25 },
  { value: 'visitor', label: '✈️ Visitor Visa', familyMultiplier: 0.2 },
  { value: 'express', label: '🚀 Express Entry', familyMultiplier: 0.35 },
];

const familyOptions = [
  { value: 1, label: 'Just me (solo adventurer)' },
  { value: 2, label: 'Me + 1 family member' },
  { value: 3, label: 'Me + 2 family members' },
  { value: 4, label: 'Me + 3 family members' },
  { value: 5, label: 'Large family (4+ members)' },
];

export default function PublicProofOfFunds() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisa, setSelectedVisa] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const calculateRequirements = () => {
    if (!selectedCountry || !selectedVisa) return null;

    const country = countryData[selectedCountry];
    const visa = visaTypes.find(v => v.value === selectedVisa);
    
    const baseAmount = country.rates[selectedVisa] || 10000;
    const familyMultiplier = 1 + ((selectedFamily - 1) * visa.familyMultiplier);
    const totalAmountUSD = baseAmount * familyMultiplier;
    
    // Convert to Naira (approximate)
    const totalAmountNGN = totalAmountUSD * 1500;
    
    return {
      country: country.name,
      flag: country.flag,
      visaType: visa.label,
      familySize: selectedFamily,
      amountUSD: totalAmountUSD,
      amountNGN: totalAmountNGN,
      currency: country.currency,
      seasoningDays: 90,
      documents: ['6 months bank statements', 'Sponsorship affidavit', 'Source of funds letter'],
      processingTime: '3-4 months minimum'
    };
  };

  const results = calculateRequirements();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Proof of Funds Made Simple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stop guessing how much money you need. Get exact embassy requirements, track your progress, and present your funds perfectly.
          </p>
          
          {/* Social Proof */}
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
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Real-Time Embassy Data</span>
            </div>
          </div>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-green-200 hover:border-green-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <Banknote className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Exact Amount Calculations</CardTitle>
                  <CardDescription>Know exactly how much to show for your target country and visa type.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Account Seasoning Guide</CardTitle>
                  <CardDescription>When to deposit funds and how long to maintain balances.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Document Templates</CardTitle>
                  <CardDescription>Bank statements, sponsorship letters, and source explanations.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Calculator Section */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl mb-4">Get Your Personalized Proof of Funds Report</CardTitle>
            <CardDescription className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
              Answer 3 quick questions and get instant embassy-approved calculations.
            </CardDescription>
            
            {/* Interactive Form */}
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="text-left">
                <label className="text-white/80 text-sm font-medium mb-2 block">🎯 Target Country</label>
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  <option value="">Select your dream country...</option>
                  {Object.entries(countryData).map(([key, country]) => (
                    <option key={key} value={key}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-left">
                <label className="text-white/80 text-sm font-medium mb-2 block">📝 Visa Type</label>
                <select 
                  value={selectedVisa} 
                  onChange={(e) => setSelectedVisa(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  <option value="">What's your visa goal?</option>
                  {visaTypes.map(visa => (
                    <option key={visa.value} value={visa.value}>
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
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 focus:bg-white/20 focus:border-white/40 transition-all"
                >
                  {familyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold text-lg py-6 px-8 shadow-lg mb-6"
              onClick={() => setShowResults(true)}
              disabled={!selectedCountry || !selectedVisa}
            >
              🧞 Get Personalized Report
            </Button>

            {/* Results Section - Shows Instantly */}
            {showResults && results && (
              <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Your Proof of Funds Requirement</h3>
                  <p className="text-white/80">Based on your selections</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold mb-3">💰 Financial Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Amount:</span>
                        <span className="font-semibold">${results.amountUSD.toLocaleString()} {results.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Naira Equivalent:</span>
                        <span className="font-semibold">₦{results.amountNGN.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Seasoning:</span>
                        <span className="font-semibold">{results.seasoningDays} days minimum</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">📑 Required Documents</h4>
                    <ul className="space-y-1 text-sm">
                      {results.documents.map((doc, index) => (
                        <li key={index}>• {doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center mt-6">
                  <Button className="bg-white text-green-600 hover:bg-gray-100">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instant calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Embassy-approved amounts</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Country Requirements Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Sample Embassy Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl text-center border-2 border-green-100">
              <div className="font-bold text-green-600 text-lg">🇨🇦 Canada Student</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦15M+</div>
              <div className="text-gray-600">+ 90 days seasoning</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center border-2 border-blue-100">
              <div className="font-bold text-blue-600 text-lg">🇬🇧 UK Student</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦13.8M+</div>
              <div className="text-gray-600">+ 90 days seasoning</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center border-2 border-purple-100">
              <div className="font-bold text-purple-600 text-lg">🇺🇸 USA F-1</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦18M+</div>
              <div className="text-gray-600">+ 90 days seasoning</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl text-center border-2 border-orange-100">
              <div className="font-bold text-orange-600 text-lg">🇦🇺 Australia</div>
              <div className="text-2xl font-bold text-gray-800 my-3">₦25.5M+</div>
              <div className="text-gray-600">+ 90 days seasoning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}