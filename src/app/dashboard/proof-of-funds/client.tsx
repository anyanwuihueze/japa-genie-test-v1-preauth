// src/app/dashboard/proof-of-funds/client.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, AlertTriangle, CheckCircle, X, Clock, TrendingUp, Shield, Sparkles, Banknote, Target, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ALL_COUNTRIES } from '@/lib/countries';

interface ProofOfFundsClientProps {
  user: any;
  userProfile: any;
  needsKYC?: boolean;
}

const VISA_TYPES = ['Study Visa', 'Work Visa', 'Tourist Visa', 'Business Visa', 'Family Visa', 'Permanent Residency'];

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
    age: userProfile?.age || 25,
    currentSavings: 45000000,
    travelTimeline: '3-6 months'
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

    await performAnalysis();
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true); 
    setError(null);
    
    try {
      // Convert uploaded files to base64 data URIs
      const filesData = await Promise.all(
        uploadedFiles.map(async (file) => {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          return {
            dataUri: base64,
            mimeType: file.type,
            name: file.name
          };
        })
      );

      // Format data to match what the API expects
      const apiPayload = {
        destinationCountry: userProfile?.destination_country || manualData.destination_country,
        visaType: userProfile?.visa_type || manualData.visa_type,
        age: userProfile?.age || manualData.age,
        familyMembers: familyMembers,
        travelTimeline: manualData.travelTimeline,
        currentSavings: manualData.currentSavings,
        hasStatement: uploadedFiles.length > 0,
        files: filesData.length > 0 ? filesData : undefined
      };

      console.log('📊 Sending analysis request:', {
        ...apiPayload,
        files: filesData.length > 0 ? `${filesData.length} files` : 'none'
      });
      
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const analysis = await res.json();
      console.log('✅ Analysis result:', analysis);
      setAnalysisResult(analysis);
      
    } catch (e: any) { 
      console.error('❌ Analysis error:', e);
      setError(e.message); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const generatePDFReport = () => {
    if (!analysisResult) {
      setError('No analysis results available to generate report');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('Please allow popups to download report');
      return;
    }
    
    // Pre-format all values to avoid template literal issues
    const destCountry = userProfile?.destination_country || manualData.destination_country;
    const visaType = userProfile?.visa_type || manualData.visa_type;
    const embassy = analysisResult.embassy || `${destCountry} ${visaType}`;
    const approvalChance = analysisResult.approvalPrediction || 'N/A';
    const minimumFunds = (analysisResult.requiredFunds?.minimum / 1000000).toFixed(1);
    const recommendedFunds = (analysisResult.requiredFunds?.recommended / 1000000).toFixed(1);
    const yourTotal = (analysisResult.requiredFunds?.yourTotal / 1000000).toFixed(1);
    const buffer = analysisResult.requiredFunds?.buffer || 'N/A';
    
    const officerPatterns = analysisResult.officerPatterns || [];
    const redFlags = analysisResult.yourProfile?.redFlags || [];
    const strengths = analysisResult.yourProfile?.strengths || [];
    const actionPlan = analysisResult.actionPlan?.immediate || [];
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>POF Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
          h1 { color: #2563eb; }
          .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; margin: -40px -40px 30px; border-radius: 0 0 20px 20px; }
          .section { margin: 30px 0; page-break-inside: avoid; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; min-width: 150px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .metric-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f3f4f6; font-weight: bold; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; margin: 4px; }
          .badge-red { background: #fee2e2; color: #991b1b; }
          .badge-green { background: #d1fae5; color: #065f46; }
          .badge-blue { background: #dbeafe; color: #1e40af; }
          ul { list-style: none; padding: 0; }
          ul li { padding: 8px 0; padding-left: 24px; position: relative; }
          ul li:before { content: "•"; position: absolute; left: 0; color: #2563eb; font-weight: bold; font-size: 20px; }
          .officer-quote { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 10px 0; font-style: italic; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛂 JAPA GENIE</h1>
          <p style="font-size: 18px; margin: 10px 0;">Proof of Funds Analysis Report</p>
          <p style="opacity: 0.9;">Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="section">
          <h2>📋 Application Overview</h2>
          <table>
            <tr><th>Field</th><th>Details</th></tr>
            <tr><td><strong>Embassy/VFS</strong></td><td>${embassy}</td></tr>
            <tr><td><strong>Applicant Age</strong></td><td>${analysisResult.yourProfile?.age || 'N/A'} years</td></tr>
            <tr><td><strong>Family Members</strong></td><td>${familyMembers}</td></tr>
            <tr><td><strong>Approval Prediction</strong></td><td><span class="badge badge-blue">${approvalChance}</span></td></tr>
          </table>
        </div>
        
        <div class="section">
          <h2>💰 Financial Requirements</h2>
          <div class="metric">
            <div class="metric-value">₦${minimumFunds}M</div>
            <div class="metric-label">Minimum Required</div>
          </div>
          <div class="metric">
            <div class="metric-value">₦${recommendedFunds}M</div>
            <div class="metric-label">Recommended</div>
          </div>
          <div class="metric">
            <div class="metric-value">₦${yourTotal}M</div>
            <div class="metric-label">Your Total</div>
          </div>
          <p style="margin-top: 20px;"><strong>Buffer:</strong> ${buffer}</p>
        </div>
        
        ${officerPatterns.length > 0 ? `
        <div class="section">
          <h2>🎯 Visa Officer Intelligence</h2>
          ${officerPatterns.map((quote: string) => `
            <div class="officer-quote">"${quote}"</div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="section">
          <h2>⚠️ Red Flags Detected</h2>
          ${redFlags.length > 0 ? redFlags.map((flag: string) => `
            <span class="badge badge-red">${flag}</span>
          `).join('') : '<p style="color: #059669;">✓ No critical red flags detected</p>'}
        </div>
        
        <div class="section">
          <h2>✅ Your Strengths</h2>
          ${strengths.length > 0 ? strengths.map((strength: string) => `
            <span class="badge badge-green">${strength}</span>
          `).join('') : '<p>Building your profile...</p>'}
        </div>
        
        ${actionPlan.length > 0 ? `
        <div class="section">
          <h2>📝 Action Plan</h2>
          <ul>
            ${actionPlan.map((action: string) => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${analysisResult.actionPlan?.premiumUpgrade ? `
        <div class="section" style="background: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 12px;">
          <h2>🚀 ${analysisResult.actionPlan.premiumUpgrade.offer}</h2>
          <p><strong>Success Rate:</strong> ${analysisResult.actionPlan.premiumUpgrade.successRate}</p>
          <ul>
            ${analysisResult.actionPlan.premiumUpgrade.includes.map((item: string) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div class="section no-print" style="margin-top: 40px; text-align: center;">
          <button onclick="window.print()" style="background: #2563eb; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 5px;">
            🖨️ Print / Save as PDF
          </button>
          <button onclick="window.close()" style="background: #6b7280; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 5px;">
            Close
          </button>
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p><strong>Generated by Japa Genie</strong> | Confidential Report</p>
          <p>This is strategic guidance based on embassy patterns, not legal counsel.</p>
          <p>Consult licensed immigration professionals for legal advice.</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="space-y-6">
      {needsKYC && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-800">
              <strong>Complete your profile</strong> for the most accurate analysis tailored to your visa journey.
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => router.push('/kyc-profile')}
              className="ml-4"
            >
              Update Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Premium Proof of Funds Analysis</h2>
              <p className="text-white/90">
                AI-powered financial compliance for {userProfile?.destination_country || manualData.destination_country || 'your destination'} {userProfile?.visa_type || manualData.visa_type || 'visa'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(userProfile?.destination_country || manualData.destination_country) && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Analysis Context
                </h3>
                <p className="text-sm text-gray-600">
                  {userProfile?.destination_country || manualData.destination_country} • {userProfile?.visa_type || manualData.visa_type} • {familyMembers} family member{familyMembers > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{needsKYC ? 'Manual Entry' : 'KYC Integrated'}</p>
                <p className="text-xs text-gray-500">{needsKYC ? 'Update profile for better results' : 'Personalized embassy analysis'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="documents">Upload Documents</TabsTrigger>
          <TabsTrigger value="requirements">Embassy Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Your current financial situation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Family Members</label>
                  <select 
                    value={familyMembers} 
                    onChange={(e) => setFamilyMembers(Number(e.target.value))} 
                    className="w-full p-2 border rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} member{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Savings (₦)</label>
                  <Input 
                    type="number"
                    value={manualData.currentSavings}
                    onChange={(e) => setManualData({...manualData, currentSavings: Number(e.target.value)})}
                    placeholder="45000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    {analysisResult.approvalPrediction}
                  </CardTitle>
                  <CardDescription>{analysisResult.embassy}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-2xl font-bold text-blue-600">₦{(analysisResult.requiredFunds?.minimum / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">Minimum</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-2xl font-bold text-purple-600">₦{(analysisResult.requiredFunds?.recommended / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">Recommended</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-2xl font-bold text-green-600">₦{(analysisResult.requiredFunds?.yourTotal / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">Your Total</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-sm"><strong>Buffer:</strong> {analysisResult.requiredFunds?.buffer}</p>
                  </div>
                </CardContent>
              </Card>

              {analysisResult.officerPatterns?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Visa Officer Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.officerPatterns.map((quote: string, index: number) => (
                        <div key={index} className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                          <p className="text-sm italic">"{quote}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Red Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.yourProfile?.redFlags?.map((flag: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.yourProfile?.strengths?.map((strength: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysisResult.actionPlan?.immediate?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.actionPlan.immediate.map((action: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                          <p className="text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Generate Professional Report
                  </CardTitle>
                  <CardDescription>Print or save as PDF with complete analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={generatePDFReport} 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Print / Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Financial Documents
              </CardTitle>
              <CardDescription>
                Upload bank statements, investment accounts, or financial documents (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)} 
                  className="hidden" 
                  id="document-upload" 
                />
                <label htmlFor="document-upload" className="cursor-pointer block">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG supported (Max 10MB each)</p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Uploaded Files ({uploadedFiles.length})</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={analyzeDocuments} 
                disabled={isAnalyzing} 
                className="w-full" 
                size="lg"
              >
                {isAnalyzing ? (
                  <>⏳ AI Analyzing...</>
                ) : (
                  <>🤖 Analyze with AI</>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-lg font-medium">AI is analyzing your profile...</p>
                  <p className="text-sm text-gray-500">
                    Checking embassy requirements, financial stability, and risk factors
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document History</CardTitle>
              <CardDescription>Previously analyzed financial documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Document history and analysis records will appear here after your first analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>
                Embassy Requirements for {userProfile?.destination_country || manualData.destination_country || 'Your Destination'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    General Financial Requirements
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Official bank statements (last 3-6 months)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Bank letter on official letterhead</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Source of funds declaration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Sponsor affidavit (if applicable)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDataModal} onOpenChange={setShowDataModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Information Needed</DialogTitle>
            <DialogDescription>
              To provide accurate analysis, please tell us about your visa plans:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Destination Country</Label>
              <Select value={manualData.destination_country} onValueChange={(v) => setManualData({...manualData, destination_country: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visa Type</Label>
              <Select value={manualData.visa_type} onValueChange={(v) => setManualData({...manualData, visa_type: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Your Age</Label>
              <Input 
                type="number"
                value={manualData.age}
                onChange={(e) => setManualData({...manualData, age: Number(e.target.value)})}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label>Current Savings (₦)</Label>
              <Input 
                type="number"
                value={manualData.currentSavings}
                onChange={(e) => setManualData({...manualData, currentSavings: Number(e.target.value)})}
                placeholder="45000000"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDataModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowDataModal(false);
                performAnalysis();
              }}
              disabled={!manualData.destination_country || !manualData.visa_type}
              className="flex-1"
            >
              Continue Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}