'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, AlertTriangle, CheckCircle, X, Clock, TrendingUp, Shield, Sparkles, Banknote, Target, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { ALL_COUNTRIES } from '@/lib/countries';

interface ProofOfFundsClientProps {
  user: any;
  userProfile: any;
  needsKYC?: boolean;
}

export default function ProofOfFundsClient({ user, userProfile, needsKYC = false }: ProofOfFundsClientProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState(1);
  const [showDataModal, setShowDataModal] = useState(false);
  const [manualData, setManualData] = useState({
    destination_country: userProfile?.destination_country || '',
    visa_type: userProfile?.visa_type || '',
    country: userProfile?.country || ''
  });

  const handleDocumentUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < fileArray.length) setError('Some files were too large (max 10MB per file)');
    else setError(null);
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeDocuments = async () => {
    const hasProfileData = userProfile?.destination_country && userProfile?.visa_type;
    const hasManualData = manualData.destination_country && manualData.visa_type;

    if (!hasProfileData && !hasManualData) {
      setShowDataModal(true);
      return;
    }

    // Mock analysis (replace with real API call)
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        summary: { totalScore: 8.7, riskLevel: 'low', meetsRequirements: true },
        financialAnalysis: { totalAssets: 45000000, liquidAssets: 38000000 },
        embassySpecific: { minimumFunds: 10000000 },
        recommendations: []
      });
      setIsAnalyzing(false);
    }, 2000);
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
          familyMembers
        })
      });

      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JapaGenie-POF-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Your full JSX here — modal at the bottom */}
      <Dialog open={showDataModal} onOpenChange={setShowDataModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Information Needed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData({...manualData, destination_country: v})}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData({...manualData, visa_type: v})}>
                <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {['Study Visa','Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => { setShowDataModal(false); analyzeDocuments(); }} className="w-full">
              Continue Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest of your UI */}
      {analysisResult && (
        <Button onClick={generatePDFReport} size="lg">
          <Download className="mr-2 h-4 w-4" /> Download PDF Report
        </Button>
      )}
    </div>
  );
}
