'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, FileText, Loader2, CheckCircle, AlertTriangle, XCircle, FileDown } from 'lucide-react';

interface AnalysisResult {
  documentType: string;
  overallStatus: 'pass' | 'warning' | 'critical';
  criticalIssues: Array<{ issue: string; impact: string; recommendation: string }>;
  warnings: Array<{ issue: string; recommendation: string }>;
  passed: string[];
}

export default function DocumentCheckClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (JPG, PNG)');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
    void handleAnalyze(selectedFile);
  };

  const handleCameraClick = () => {
    if (!isMobile) {
      setError('📱 Camera feature requires a mobile device. Please use "Upload File" instead.');
      return;
    }
    cameraInputRef.current?.click();
  };

  const convertPdfToImage = async (file: File): Promise<string | null> => {
    setConverting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('PDF conversion failed:', err);
      return null;
    } finally {
      setConverting(false);
    }
  };

  const handleAnalyze = async (sourceFile: File) => {
    setLoading(true); setError(null);
    try {
      let dataUri: string | null = null;
      if (sourceFile.type === 'application/pdf') {
        dataUri = await convertPdfToImage(sourceFile);
        if (!dataUri) { setError('PDF conversion failed – try taking a photo instead'); return; }
      } else {
        dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(sourceFile);
        });
      }
      if (!dataUri) throw new Error('Failed to process file');
      const res = await fetch('/api/document-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentDataUri: dataUri, targetCountry: 'General', visaType: 'Tourist' }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Analysis failed');
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!result) return;
    
    setGeneratingReport(true);
    setError(null);
    
    try {
      console.log('🚀 Generating personalized report...');
      
      // Step 1: Generate AI letter
      const reportRes = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisResult: result,
          targetCountry: 'General',
          visaType: 'Tourist'
        }),
      });
      
      if (!reportRes.ok) throw new Error('Failed to generate report');
      const reportData = await reportRes.json();
      
      console.log('✅ AI letter generated, creating PDF...');
      
      // Step 2: Generate PDF
      const pdfRes = await fetch('/api/generate-report-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterHTML: reportData.letterHTML,
          analysisResult: result,
          targetCountry: 'General',
          visaType: 'Tourist'
        }),
      });
      
      if (!pdfRes.ok) throw new Error('Failed to generate PDF');
      
      // Step 3: Download PDF
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Document-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Report downloaded successfully!');
      
    } catch (err: any) {
      console.error('❌ Report generation failed:', err);
      setError(`Report generation failed: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Choose a file or take a photo of your visa document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} disabled={loading} />
          <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} disabled={loading} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-32 flex flex-col items-center justify-center gap-2" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              <Upload className="w-8 h-8" /><p className="font-semibold">Upload File</p><p className="text-xs text-muted-foreground">PDF, JPG, PNG</p>
            </Button>
            <Button variant="outline" size="lg" className="h-32 flex flex-col items-center justify-center gap-2" onClick={handleCameraClick} disabled={loading}>
              <Camera className="w-8 h-8" /><p className="font-semibold">Take Photo</p><p className="text-xs text-muted-foreground">{isMobile ? 'Use camera' : 'Mobile only'}</p>
            </Button>
          </div>
          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="w-5 h-5" /><span className="text-sm font-medium flex-1">{file.name}</span>
              <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResult(null); setError(null); }}>Remove</Button>
            </div>
          )}
          {error && (
            <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
          )}
          <Button onClick={() => file && void handleAnalyze(file)} disabled={!file || loading} className="w-full" size="lg">
            {converting ? (<><Loader2 className="animate-spin mr-2" />Converting PDF...</>) : loading ? (<><Loader2 className="animate-spin mr-2" />Analyzing...</>) : (<><FileText className="mr-2" />Analyze Document</>)}
          </Button>
        </CardContent>
      </Card>
      {result && (
        <Card className={result.overallStatus === 'pass' ? 'border-green-200 bg-green-50' : result.overallStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Analysis Results</CardTitle><CardDescription>{result.documentType}</CardDescription></div>
              <div>{result.overallStatus === 'pass' && <CheckCircle className="w-12 h-12 text-green-600" />}{result.overallStatus === 'warning' && <AlertTriangle className="w-12 h-12 text-yellow-600" />}{result.overallStatus === 'critical' && <XCircle className="w-12 h-12 text-red-600" />}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.criticalIssues?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center"><XCircle className="w-5 h-5 mr-2" />Critical Issues</h3>
                {result.criticalIssues.map((issue, i) => (
                  <div key={i} className="bg-white p-4 rounded mb-2 border border-red-200"><p className="font-semibold text-red-900 mb-1">{issue.issue}</p><p className="text-sm text-red-700 mb-2"><strong>Impact:</strong> {issue.impact}</p><p className="text-sm text-green-700"><strong>Fix:</strong> {issue.recommendation}</p></div>
                ))}
              </div>
            )}
            {result.warnings?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />Warnings</h3>
                {result.warnings.map((w, i) => (
                  <div key={i} className="bg-white p-4 rounded mb-2 border border-yellow-200"><p className="font-semibold text-yellow-900 mb-1">{w.issue}</p><p className="text-sm text-green-700"><strong>Fix:</strong> {w.recommendation}</p></div>
                ))}
              </div>
            )}
            {result.passed?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center"><CheckCircle className="w-5 h-5 mr-2" />Passed Checks</h3>
                <ul className="space-y-2">{result.passed.map((check, i) => (<li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" /><span className="text-sm">{check}</span></li>))}</ul>
              </div>
            )}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => { setFile(null); setResult(null); setError(null); }}>Analyze Another</Button>
              <Button 
                className="flex-1" 
                onClick={handleGenerateReport}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <><Loader2 className="animate-spin mr-2" />Generating Report...</>
                ) : (
                  <><FileDown className="mr-2" />Download AI Report</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
