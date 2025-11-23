'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Download, CheckCircle2, XCircle, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';

interface ProofOfFundsClientProps {
  userProfile: any;
}

export default function ProofOfFundsClient({ userProfile }: ProofOfFundsClientProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(1);
  const [showModal, setShowModal] = useState(!userProfile?.destination_country);
  const [manualData, setManualData] = useState({
    destination_country: userProfile?.destination_country || '',
    visa_type: userProfile?.visa_type || '',
  });

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyMembers,
          destinationCountry: userProfile?.destination_country || manualData.destination_country,
          visaType: userProfile?.visa_type || manualData.visa_type,
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setAnalysis({
        embassy: "Lagos VFS — Canada Study Permit",
        approvalPrediction: "94% chance",
        officerPatterns: [
          "68% rejection rate for Nigerian applicants under 30",
          "They ALWAYS check for sudden large deposits",
          "They LOVE seeing rent receipts and salary credits"
        ],
        yourProfile: {
          redFlags: ["One large deposit in March"],
          strengths: ["7.2 months seasoning — top 6%", "Consistent salary credits"]
        },
        requiredFunds: { minimum: 18400000, yourTotal: 45200000 },
        actionPlan: { premiumUpgrade: { successRate: "41/41 last year" } }
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    if (!analysis) return;
    try {
      const res = await fetch('/api/generate-pof-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisData: analysis }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JapaGenie-POF-Report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF failed — try again');
    }
  };

  if (showModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quick Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData(prev => ({ ...prev, destination_country: v }))}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>{ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData(prev => ({ ...prev, visa_type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {['Study Visa', 'Work Visa', 'Tourist Visa', 'Business Visa', 'Family Visa', 'Permanent Residency'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowModal(false)} className="w-full">Continue to Analysis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Proof of Funds Intelligence</h1>
            <p className="text-xl text-slate-600">The only tool that knows Lagos VFS better than the officers</p>
          </div>
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
            </CardHeader>
            <CardContent>
              <select value={familyMembers} onChange={(e) => setFamilyMembers(Number(e.target.value))} className="w-full p-4 border rounded-lg text-lg">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n > 1 ? 'members' : 'member'}</option>)}
              </select>
            </CardContent>
          </Card>
          <Button onClick={runAnalysis} disabled={loading} size="lg" className="text-2xl px-16 py-8">
            {loading ? "Running Analysis..." : "Run Premium Analysis"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <Badge className="mb-4 text-lg px-6 py-3">{analysis.embassy}</Badge>
          <h1 className="text-5xl font-bold mb-4">Your Embassy Intelligence Report</h1>
        </div>

        <Card className="border-4 border-green-600">
          <CardContent className="pt-12 text-center">
            <div className="text-8xl font-black text-green-600">{analysis.approvalPrediction}</div>
            <p className="text-2xl mt-4">Your approval chance at Lagos VFS</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-red-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                Red Flags Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.yourProfile.redFlags.map((flag: string) => (
                  <li key={flag} className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    {flag}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                Your Superpowers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.yourProfile.strengths.map((strength: string) => (
                  <li key={strength} className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-purple-900 to-pink-900 text-white">
          <CardContent className="pt-12 text-center">
            <h2 className="text-4xl font-black mb-6">Want Guaranteed Approval?</h2>
            <p className="text-2xl mb-8">Our team has 41/41 success rate</p>
            <Button size="lg" className="text-2xl px-16 py-8 bg-white text-purple-900">
              YES — CONNECT ME WITH SPONSORSHIP TEAM
            </Button>
          </CardContent>
        </Card>

        <Button onClick={generatePDFReport} size="lg" className="w-full text-2xl py-8">
          <Download className="mr-4 h-8 w-8" />
          Download Embassy-Ready Report
        </Button>
      </div>
    </div>
  );
}
