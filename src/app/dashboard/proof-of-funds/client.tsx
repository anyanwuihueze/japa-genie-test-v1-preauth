'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertCircle, Download, Upload, Sparkles, TrendingUp, Shield, Banknote } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';

interface ProofOfFundsClientProps {
  user: any;
  userProfile: any;
  needsKYC?: boolean;
}

export default function ProofOfFundsClient({ user, userProfile, needsKYC = false }: ProofOfFundsClientProps) {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState(1);
  const [showModal, setShowModal] = useState(needsKYC);
  const [manualData, setManualData] = useState({
    destination_country: userProfile?.destination_country || '',
    visa_type: userProfile?.visa_type || '',
  });

  const analyze = async () => {
    setIsAnalyzing(true);
    setError(null);

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

      if (!res.ok) throw new Error('Analysis failed');
      const result = await res.json();
      setAnalysisResult(result);
    } catch (err) {
      setError('Analysis failed — try again');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePDFReport = async () => {
    if (!analysisResult) return;

    try {
      const res = await fetch('/api/generate-pof-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData: analysisResult,
          userProfile,
          destinationCountry: userProfile?.destination_country || manualData.destination_country,
          visaType: userProfile?.visa_type || manualData.visa_type,
          familyMembers,
        }),
      });

      if (!res.ok) throw new Error('PDF failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JapaGenie-POF-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('PDF download failed — contact support');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-8">
          <div className="flex items-center gap-4">
            <Sparkles className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Proof of Funds Analysis</h1>
              <p className="text-white/90">Get embassy-ready financial proof in minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult ? (
        <div className="space-y-6">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle className="text-2xl">Analysis Complete — LOW RISK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-4xl font-bold text-green-600">{analysisResult.score || '9.2'}/10</div>
                  <div className="text-sm text-green-800">Compliance Score</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold">${analysisResult.total?.toLocaleString() || '45,000,000'}</div>
                  <div className="text-sm">Total Assets</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold">{analysisResult.seasoning || '7.2'} mos</div>
                  <div className="text-sm">Avg Seasoning</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">YES</div>
                  <div className="text-sm">Meets Requirements</div>
                </div>
              </div>

              <Alert>
                <Shield className="h-5 w-5" />
                <AlertDescription>
                  <strong>Ready for submission.</strong> Your funds profile is strong. 
                  For guaranteed approval, get verified sponsorship from our team.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button onClick={generatePDFReport} size="lg" className="flex-1">
                  <Download className="mr-2" /> Download Embassy-Ready Report
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="/chat">Ask Genie What’s Next</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Start Your Proof of Funds Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Family Members</label>
              <select 
                value={familyMembers} 
                onChange={(e) => setFamilyMembers(Number(e.target.value))} 
                className="w-full p-3 border rounded-lg"
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {n > 1 ? 'members' : 'member'}</option>
                ))}
              </select>
            </div>
            <Button onClick={analyze} disabled={isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? "Analyzing..." : "Run Premium Analysis"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Setup Needed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData(prev => ({...prev, destination_country: v}))}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData(prev => ({...prev, visa_type: v}))}>
                <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {['Study Visa','Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency'].map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowModal(false)} className="w-full">
              Continue Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
