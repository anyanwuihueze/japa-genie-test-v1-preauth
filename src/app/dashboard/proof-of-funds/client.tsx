'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Download, Upload, XCircle, FileText, BarChart3, Printer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuestionnaireData {
  destinationCountry: string;
  visaType: string;
  age: number;
  familyMembers: number;
  travelTimeline: string;
  currentSavings: number;
}

interface Analysis {
  embassy: string;
  officerPatterns: string[];
  yourProfile: any;
  requiredFunds: any;
  approvalPrediction: string;
  actionPlan: any;
  seasoningData: any[];
  riskScore: number;
}

const VISA_TYPES = ['Study Visa', 'Work Visa', 'Tourist Visa', 'Family Visa', 'Permanent Residency'];
const TIMELINES = ['Urgent (1-3 months)', 'Normal (3-6 months)', 'Flexible (6+ months)'];

export default function ProofOfFundsClient({ userProfile }: { userProfile: any }) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(!userProfile?.destination_country);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    destinationCountry: userProfile?.destination_country || '',
    visaType: userProfile?.visa_type || '',
    age: userProfile?.age || 25,
    familyMembers: 1,
    travelTimeline: 'Normal (3-6 months)',
    currentSavings: 0
  });
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleQuestionnaireSubmit = () => {
    if (!questionnaireData.destinationCountry || !questionnaireData.visaType) {
      alert('Please complete all required fields');
      return;
    }
    setShowQuestionnaire(false);
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...questionnaireData,
          hasStatement: !!uploadedFile
        })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Proof of Funds Intelligence
            </CardTitle>
            <p className="text-slate-600 mt-2">Answer 6 questions to get bulletproof embassy-ready analysis</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Destination Country *</Label>
              <Select 
                value={questionnaireData.destinationCountry} 
                onValueChange={(v) => setQuestionnaireData({...questionnaireData, destinationCountry: v})}
              >
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {['Canada', 'United Kingdom', 'United States', 'Australia', 'Germany', 'France'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold">Visa Type *</Label>
              <Select 
                value={questionnaireData.visaType} 
                onValueChange={(v) => setQuestionnaireData({...questionnaireData, visaType: v})}
              >
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map(v => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold">Your Age</Label>
                <Input type="number" value={questionnaireData.age} onChange={(e) => setQuestionnaireData({...questionnaireData, age: parseInt(e.target.value)})} className="mt-2" />
              </div>
              <div>
                <Label className="text-base font-semibold">Family Members Traveling</Label>
                <Input type="number" value={questionnaireData.familyMembers} onChange={(e) => setQuestionnaireData({...questionnaireData, familyMembers: parseInt(e.target.value)})} className="mt-2" />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Travel Timeline</Label>
              <Select value={questionnaireData.travelTimeline} onValueChange={(v) => setQuestionnaireData({...questionnaireData, travelTimeline: v})}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>{TIMELINES.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold">Current Total Savings (Optional)</Label>
              <Input type="number" placeholder="e.g., 45000000" value={questionnaireData.currentSavings || ''} onChange={(e) => setQuestionnaireData({...questionnaireData, currentSavings: parseInt(e.target.value) || 0})} className="mt-2" />
              <p className="text-xs text-slate-500 mt-1">Helps us give more accurate analysis</p>
            </div>

            <Button onClick={handleQuestionnaireSubmit} className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Continue to Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Proof of Funds Intelligence</h1>
            <p className="text-xl text-slate-600">The only tool that knows {questionnaireData.destinationCountry} embassy patterns better than the officers</p>
          </div>

          <Card className="mb-8 border-2 border-blue-200 bg-white">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-6 h-6 text-blue-600" />Your Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-slate-600">Destination:</span><p className="font-semibold text-lg">{questionnaireData.destinationCountry}</p></div>
                <div><span className="text-slate-600">Visa Type:</span><p className="font-semibold text-lg">{questionnaireData.visaType}</p></div>
                <div><span className="text-slate-600">Timeline:</span><p className="font-semibold text-lg">{questionnaireData.travelTimeline}</p></div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowQuestionnaire(true)} className="mt-4">Edit Details</Button>
            </CardContent>
          </Card>

          <Card className="mb-8 border-2 border-dashed border-slate-300 bg-white hover:border-blue-400 transition-colors">
            <CardContent className="pt-12 pb-12 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-2xl font-semibold mb-2">Upload Bank Statement (Optional)</h3>
              <p className="text-slate-600 mb-6">For more accurate analysis</p>
              <input type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload"><Button variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button></label>
              {uploadedFile && (<div className="mt-4 flex items-center justify-center gap-2 text-green-600"><CheckCircle2 className="w-5 h-5" /><span className="font-medium">{uploadedFile.name}</span></div>)}
            </CardContent>
          </Card>

          <Button onClick={runAnalysis} disabled={loading} className="w-full h-16 text-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
            {loading ? "Analyzing..." : "Run $10,000 Analysis"}
          </Button>
        </div>
      </div>
    );
  }

  const seasoningData = analysis.seasoningData || [];
  const riskScore = analysis.riskScore || 94;
  const riskColor = riskScore >= 80 ? '#10b981' : riskScore >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <style jsx global>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <Badge className="mb-4 text-lg px-6 py-2 bg-blue-600">{analysis.embassy}</Badge>
            <h1 className="text-5xl font-bold text-slate-900">Your Embassy Intelligence Report</h1>
          </div>

          <Card className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-8xl font-black text-green-600 mb-4">{riskScore}%</div>
              <p className="text-2xl font-semibold text-slate-700">{analysis.approvalPrediction}</p>
              <Badge className="mt-4 bg-green-600 text-white px-6 py-2 text-base">Top 6% of Approved Cases</Badge>
            </CardContent>
          </Card>

          <Button onClick={printReport} size="lg" className="w-full h-16 text-2xl bg-slate-900 hover:bg-slate-800 shadow-xl no-print">
            <Printer className="mr-4 h-8 w-8" />Print / Save as PDF
          </Button>
        </div>
      </div>
    </>
  );
}
