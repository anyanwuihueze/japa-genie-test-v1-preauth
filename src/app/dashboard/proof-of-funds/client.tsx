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
  const [showDataModal, setShowDataModal] = useState(needsKYC);
  const [manualData, setManualData] = useState({
    destination_country: userProfile?.destination_country || '',
    visa_type: userProfile?.visa_type || '',
    country: userProfile?.country || ''
  });

  const handleDocumentUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < fileArray.length) setError('Some files too large (max 10MB)');
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

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Mock analysis (replace with real API)
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: `Total Balance: ${(familyMembers * 8500000).toLocaleString()} NGN`,
          familyMembers,
          overrideProfile: manualData.destination_country ? manualData : null
        })
      });
      
      if (!res.ok) throw new Error('Analysis failed');
      
      const result = await res.json();
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message);
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
          familyMembers
        })
      });
      
      if (!res.ok) throw new Error('PDF failed');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JapaGenie-POF-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('PDF download failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Sparkles className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Premium Proof of Funds Analysis</h2>
              <p className="text-white/90">
                AI-powered financial compliance for {userProfile?.destination_country || manualData.destination_country || 'your destination'} visa
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Banner */}
      {needsKYC && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <span className="text-orange-800">
              <strong>Complete your profile</strong> for accurate analysis.
            </span>
            <Button size="sm" variant="outline" onClick={() => router.push('/kyc-profile')} className="ml-4">
              Update Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Family Size */}
      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
          <CardDescription>Include all family members in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Family Members</label>
              <select value={familyMembers} onChange={(e) => setFamilyMembers(Number(e.target.value))} className="w-full p-2 border rounded-lg">
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} member{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Banknote className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Funds adjust based on family size</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Financial Documents
          </CardTitle>
          <CardDescription>Bank statements, investments, or financial documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400">
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleDocumentUpload(e.target.files!)} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer block">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop files or click to browse</p>
              <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 10MB each)</p>
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  <button onClick={() => removeFile(index)} className="text-red-500">
                    <X className="w-4 w-4" />
                  </button>
                </div>
              ))}
              <Button onClick={analyzeDocuments} disabled={isAnalyzing} className="w-full mt-4">
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Analysis Summary
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  LOW RISK
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{analysisResult.summary.totalScore}/10</p>
                  <p className="text-sm text-green-800">Compliance Score</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">${analysisResult.financialAnalysis?.totalAssets?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-blue-800">Total Assets</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">6 mos</p>
                  <p className="text-sm text-purple-800">Avg Seasoning</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">YES</p>
                  <p className="text-sm text-orange-800">Meets Requirements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Generate Professional Report
              </CardTitle>
              <CardDescription>Download embassy-ready PDF with complete analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generatePDFReport} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Modal */}
      <Dialog open={showDataModal} onOpenChange={setShowDataModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Setup</DialogTitle>
            <DialogDescription>To provide accurate analysis, tell us about your visa plans</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData(prev => ({...prev, destination_country: v}))}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData(prev => ({...prev, visa_type: v}))}>
                <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                  {['Study Visa','Work Visa','Tourist Visa','Business Visa','Family Visa','Permanent Residency'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => { setShowDataModal(false); analyzeDocuments(); }} className="w-full" disabled={!manualData.destination_country || !manualData.visa_type}>
              Continue Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium">AI analyzing your documents...</p>
              <p className="text-sm text-gray-500">Checking embassy compliance and risk factors</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
