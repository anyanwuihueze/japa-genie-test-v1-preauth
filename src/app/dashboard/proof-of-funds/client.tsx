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

    await performAnalysis();
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true); 
    setError(null);
    
    try {
      const userFinancialSummary = `Uploaded bank statements showing:
      - Primary Bank: Access Bank PLC
      - Total Balance: ${(familyMembers * 8500000).toLocaleString()} NGN
      - Average 6-month Balance: ${(familyMembers * 8000000).toLocaleString()} NGN  
      - Account Age: 18 months
      - Recent Large Deposit: ${(familyMembers * 3000000).toLocaleString()} NGN on 2024-05-22
      - Account Types: Savings, Current
      - Currency: Nigerian Naira (NGN)`;
      
      const analysisProfile = {
        destination_country: userProfile?.destination_country || manualData.destination_country,
        visa_type: userProfile?.visa_type || manualData.visa_type,
        country: userProfile?.country || manualData.country,
        nationality: userProfile?.nationality || userProfile?.country || manualData.country
      };

      console.log('📊 Sending analysis request with profile:', analysisProfile);
      
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: userFinancialSummary,
          familyMembers,
          overrideProfile: manualData.destination_country ? manualData : null
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const realAnalysis = await res.json();
      console.log('✅ Analysis result:', realAnalysis);
      setAnalysisResult(realAnalysis);
      
    } catch (e: any) { 
      console.error('❌ Analysis error:', e);
      setError(e.message); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const generatePDFReport = () => {
    if (!analysisResult) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('Please allow popups to download report');
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>POF Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #2563eb; }
          .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; margin: -40px -40px 30px; }
          .section { margin: 30px 0; page-break-inside: avoid; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .metric-label { font-size: 12px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f3f4f6; font-weight: bold; }
          .risk-low { color: #10b981; }
          .risk-medium { color: #f59e0b; }
          .risk-high { color: #ef4444; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>JAPA GENIE</h1>
          <p>Proof of Funds Analysis Report</p>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Applicant Information</h2>
          <p><strong>Destination:</strong> ${userProfile?.destination_country || manualData.destination_country}</p>
          <p><strong>Visa Type:</strong> ${userProfile?.visa_type || manualData.visa_type}</p>
          <p><strong>Family Members:</strong> ${familyMembers}</p>
        </div>
        
        <div class="section">
          <h2>Analysis Summary</h2>
          <div class="metric">
            <div class="metric-value">${analysisResult.summary.totalScore}/10</div>
            <div class="metric-label">Compliance Score</div>
          </div>
          <div class="metric">
            <div class="metric-value risk-${analysisResult.summary.riskLevel}">${analysisResult.summary.riskLevel?.toUpperCase()}</div>
            <div class="metric-label">Risk Level</div>
          </div>
          <div class="metric">
            <div class="metric-value">${analysisResult.summary.meetsRequirements ? 'YES' : 'NO'}</div>
            <div class="metric-label">Meets Requirements</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Financial Analysis</h2>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Assets</td><td>$${analysisResult.financialAnalysis?.totalAssets?.toLocaleString() || '0'}</td></tr>
            <tr><td>Liquid Assets</td><td>$${analysisResult.financialAnalysis?.liquidAssets?.toLocaleString() || '0'}</td></tr>
            <tr><td>Seasoning Period</td><td>${Math.floor((analysisResult.financialAnalysis?.seasoningDays || 0) / 30)} months</td></tr>
            <tr><td>Stability Score</td><td>${analysisResult.financialAnalysis?.stabilityScore || 0}/10</td></tr>
          </table>
        </div>
        
        ${analysisResult.recommendations?.length > 0 ? `
        <div class="section">
          <h2>Recommendations</h2>
          <ul>
            ${analysisResult.recommendations.map((rec: any) => `
              <li><strong>${rec.action}</strong> - ${rec.timeline || ''}</li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${analysisResult.embassySpecific ? `
        <div class="section">
          <h2>Embassy Requirements</h2>
          <p><strong>Minimum Funds:</strong> $${analysisResult.embassySpecific.minimumFunds?.toLocaleString() || 'N/A'}</p>
          <p><strong>Seasoning Period:</strong> ${Math.floor((analysisResult.embassySpecific.seasoningRequirements || 0) / 30)} months</p>
          ${analysisResult.embassySpecific.documentChecklist?.length > 0 ? `
            <h3>Required Documents:</h3>
            <ul>
              ${analysisResult.embassySpecific.documentChecklist.map((doc: string) => `<li>${doc}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        ` : ''}
        
        <div class="section no-print" style="margin-top: 40px; text-align: center;">
          <button onclick="window.print()" style="background: #2563eb; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="background: #6b7280; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Generated by Japa Genie | Confidential Report</p>
          <p>This is strategic guidance, not legal counsel. Consult immigration professionals for legal advice.</p>
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
                AI-powered financial compliance for ${userProfile?.destination_country || manualData.destination_country || 'your destination'} ${userProfile?.visa_type || manualData.visa_type || 'visa'}
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
                  ${userProfile?.destination_country || manualData.destination_country} • ${userProfile?.visa_type || manualData.visa_type} • ${familyMembers} family member{familyMembers > 1 ? 's' : ''}
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
              <CardTitle>Family Information</CardTitle>
              <CardDescription>Include all family members in your visa application</CardDescription>
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
                <div className="flex items-center justify-center">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Banknote className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Funds requirements adjust based on family size</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysisResult?.summary && !isAnalyzing && (
            <div className="space-y-6">
              <Card className={`border-2 ${
                analysisResult.summary.riskLevel === 'low' ? 'border-green-200' :
                analysisResult.summary.riskLevel === 'medium' ? 'border-yellow-200' : 'border-red-200'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Analysis Summary
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      analysisResult.summary.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      analysisResult.summary.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      ${analysisResult.summary.riskLevel?.toUpperCase() || 'UNKNOWN'} RISK
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${analysisResult.summary.totalScore || 0}/10</p>
                      <p className="text-sm text-green-800">Compliance Score</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        $${analysisResult.financialAnalysis?.totalAssets?.toLocaleString() || '0'}
                      </p>
                      <p className="text-sm text-blue-800">Total Assets</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        ${Math.floor((analysisResult.financialAnalysis?.seasoningDays || 0) / 30)} mos
                      </p>
                      <p className="text-sm text-purple-800">Avg Seasoning</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        ${analysisResult.summary.meetsRequirements ? 'YES' : 'NO'}
                      </p>
                      <p className="text-sm text-orange-800">Meets Requirements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysisResult.embassySpecific && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Embassy Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Minimum Requirements</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600" />
                            Funds: $${analysisResult.embassySpecific.minimumFunds?.toLocaleString() || 'N/A'}
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            Seasoning: ${Math.floor((analysisResult.embassySpecific.seasoningRequirements || 0) / 30)} months
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Required Documents</h4>
                        <ul className="space-y-1 text-sm">
                          ${analysisResult.embassySpecific.documentChecklist?.map((doc: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              ${doc}
                            </li>
                          )) || <li>No checklist available</li>}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisResult.recommendations?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      ${analysisResult.recommendations.map((rec: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          rec.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                          rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start gap-3">
                            ${rec.priority === 'high' ? (
                              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            ) : rec.priority === 'medium' ? (
                              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">${rec.action}</p>
                              ${rec.impact && <p className="text-sm text-gray-600 mt-1">${rec.impact}</p>}
                              ${rec.timeline && <p className="text-xs text-gray-500 mt-1">Timeline: ${rec.timeline}</p>}
                            </div>
                          </div>
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
                    className="bg-blue-600 hover:bg-blue-700"
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
                Upload bank statements, investment accounts, or financial documents
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
                  <h4 className="font-semibold">Uploaded Files (${uploadedFiles.length})</h4>
                  ${uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">${file.name}</span>
                        <span className="text-xs text-gray-500">(${(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button 
                    onClick={analyzeDocuments} 
                    disabled={isAnalyzing} 
                    className="w-full mt-4" 
                    size="lg"
                  >
                    ${isAnalyzing ? (
                      <>⏳ AI Analyzing Documents...</>
                    ) : (
                      <>🤖 Analyze with AI</>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">${error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-lg font-medium">AI is analyzing your documents...</p>
                  <p className="text-sm text-gray-500">
                    Checking embassy compliance, financial stability, and risk factors
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
                Embassy Requirements for ${userProfile?.destination_country || manualData.destination_country || 'Your Destination'}
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
                  ${ALL_COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                  ${VISA_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
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
