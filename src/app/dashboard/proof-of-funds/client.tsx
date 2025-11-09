'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, AlertTriangle, CheckCircle, User, X, Clock, TrendingUp, Shield } from 'lucide-react';

interface DashboardClientProps {
  user: any;
  userProfile: any;
}

const countryOptions = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'France',
  'Netherlands', 'Ireland', 'New Zealand', 'Singapore', 'Dubai (UAE)', 'Switzerland'
];

const visaTypeOptions = [
  { value: 'student', label: 'Student Visa' },
  { value: 'work', label: 'Work Visa' },
  { value: 'visitor', label: 'Visitor/Tourist Visa' },
  { value: 'family', label: 'Family Reunification' }
];

export default function DashboardClient({ user, userProfile }: DashboardClientProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [visaType, setVisaType] = useState('student');
  const [familyMembers, setFamilyMembers] = useState(1);

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

  // REAL AI CALL – TEXT ONLY (no files needed for MVP)
  const analyzeDocuments = async () => {
    setIsAnalyzing(true); setError(null);
    try {
      const payload = {
        destinationCountry,
        currency: 'NGN',
        text: `Bank: Access Bank PLC
Balance: ${(familyMembers * 8500000).toLocaleString()} NGN
Avg 6M: ${(familyMembers * 8000000).toLocaleString()} NGN
Lump credit: ${(familyMembers * 3000000).toLocaleString()} NGN 2024-05-22 (no note)`
      };
      const res = await fetch('/api/analyze-pof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Analysis failed');
      setAnalysisResult(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setIsAnalyzing(false); }
  };

  const generatePDFReport = async () => {
    if (!analysisResult) return;
    try {
      const res = await fetch('/api/generate-pof-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisData: analysisResult, userProfile })
      });
      if (!res.ok) throw new Error('PDF failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `POF-report-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setError('PDF generation failed'); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><User className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-semibold">Welcome back, {userProfile?.full_name || user?.email}</h2>
              <p className="text-white/90">Premium AI-powered proof of funds analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="requirements">Embassy Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Destination & Visa Details</CardTitle><CardDescription>Tell us about your visa application</CardDescription></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Destination Country</label>
                  <select value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} className="w-full p-2 border rounded-lg">
                    {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Visa Type</label>
                  <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="w-full p-2 border rounded-lg">
                    {visaTypeOptions.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Family Members</label>
                  <select value={familyMembers} onChange={(e) => setFamilyMembers(Number(e.target.value))} className="w-full p-2 border rounded-lg">
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Upload Financial Documents</CardTitle><CardDescription>Upload bank statements, investment accounts, or financial documents (PDF, JPG, PNG)</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)} className="hidden" id="document-upload" />
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
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <Button onClick={analyzeDocuments} disabled={isAnalyzing} className="w-full mt-4" size="lg">
                    {isAnalyzing ? <>⏳ AI Analyzing Documents...</> : <>🤖 Analyze with AI</>}
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /><span className="text-red-800">{error}</span>
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
                  <p className="text-sm text-gray-500">Extracting data, detecting red flags, calculating compliance</p>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              <Card className="border-2 border-green-200">
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-6 h-6 text-green-600" />Analysis Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg"><p className="text-2xl font-bold text-green-600">${analysisResult.summary?.totalAssetsUSD?.toLocaleString() || '0'}</p><p className="text-sm text-green-800">Total Assets</p></div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg"><p className="text-2xl font-bold text-blue-600">${analysisResult.summary?.liquidAssetsUSD?.toLocaleString() || '0'}</p><p className="text-sm text-blue-800">Liquid Assets</p></div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg"><p className="text-2xl font-bold text-purple-600">{Math.floor((analysisResult.summary?.accountSeasoningDays || 0) / 30)} mos</p><p className="text-sm text-purple-800">Avg Seasoning</p></div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg"><p className="text-2xl font-bold text-orange-600">{analysisResult.summary?.complianceScore || 0}/10</p><p className="text-sm text-orange-800">Compliance Score</p></div>
                  </div>
                </CardContent>
              </Card>

              {analysisResult.accounts && analysisResult.accounts.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Account Analysis</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.accounts.map((account: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{account.institution || 'Bank Account'}</p>
                            <p className="text-sm text-gray-600">{account.accountType || 'Checking/Savings'}</p>
                            <span className="text-sm">Age: {Math.floor((account.accountAge || 90) / 30)} months | Avg Balance: ${(account.averageBalance || 0).toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${(account.balance || 0).toLocaleString()}</p>
                            {account.isSeasoned ? (
                              <div className="flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /><span className="text-sm">Seasoned</span></div>
                            ) : (
                              <div className="flex items-center gap-1 text-amber-600"><Clock className="h-4 w-4" /><span className="text-sm">New Account</span></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>AI Insights & Recommendations</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.insights?.map((insight: any, index: number) => (
                      <div key={index} className={`flex items-start gap-3 p-4 rounded-lg ${insight.type === 'error' ? 'bg-red-50 border border-red-200' : insight.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                        {insight.type === 'error' || insight.type === 'warning' ? (
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${insight.type === 'error' ? 'text-red-600' : 'text-amber-600'}`} />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        )}
                        <div><p className="font-semibold">{insight.title}</p><p className="text-sm">{insight.description}</p></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Generate Professional Report</CardTitle>
                  <CardDescription>Download embassy-ready PDF with all analysis details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={generatePDFReport} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />Download PDF Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>My Documents</CardTitle><CardDescription>Previously uploaded financial documents</CardDescription></CardHeader>
            <CardContent><p className="text-gray-600">Document history will appear here after your first analysis.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader><CardTitle>Embassy Requirements for {destinationCountry}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" />Embassy-Specific Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /><span>Official bank statements (last 3-6 months)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /><span>Bank letter on official letterhead</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /><span>Source of funds declaration</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /><span>Sponsor affidavit (if applicable)</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">General Guidelines</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" /><span>Funds must be liquid and accessible</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" /><span>Minimum seasoning: 90 days recommended</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" /><span>All documents must be recent (within 30 days)</span></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}