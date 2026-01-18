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
  const [isAnalyzing, setIsAnalyzing] = useState(false); // ✅ NEW: Prevents double execution
  const [workerInitialized, setWorkerInitialized] = useState(false); // ✅ NEW: Track worker init
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ✅ FIX #1: Initialize PDF.js worker ONCE on component mount with timeout
  useEffect(() => {
    const initWorker = async () => {
      const WORKER_INIT_TIMEOUT = 10000; // 10 seconds
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Worker initialization timed out'));
        }, WORKER_INIT_TIMEOUT);
      });
      
      const initPromise = (async () => {
        const pdfjsLib = await import('pdfjs-dist');
        // ✅ FIX: Use unpkg.com (NOT jsdelivr) - it actually serves the worker file correctly
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        console.log('✅ Worker URL set to unpkg:', pdfjsLib.GlobalWorkerOptions.workerSrc);
        return true;
      })();
      
      try {
        await Promise.race([initPromise, timeoutPromise]);
        setWorkerInitialized(true);
        console.log('✅ PDF.js worker initialized');
      } catch (err) {
        console.error('❌ Failed to initialize PDF.js worker:', err);
        setError('PDF processor failed to load. Page refresh may be needed.');
      }
    };
    initWorker();
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  // ✅ FIX #2: Removed auto-analyze from handleFileSelect
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
    // ✅ REMOVED: void handleAnalyze(selectedFile); 
    // Now user must click "Analyze Document" button
  };

  const handleCameraClick = () => {
    if (!isMobile) {
      setError('📱 Camera feature requires a mobile device. Please use "Upload File" instead.');
      return;
    }
    cameraInputRef.current?.click();
  };

  // ✅ FIX #3: Improved convertPdfToImage with timeout protection and better error handling
  const convertPdfToImage = async (file: File): Promise<string | null> => {
    if (!workerInitialized) {
      console.error('❌ PDF.js worker not initialized yet');
      setError('PDF processor is still loading. Please wait a moment and try again.');
      return null;
    }

    setConverting(true);
    
    // ✅ TIMEOUT PROTECTION: Prevent hanging forever
    const CONVERSION_TIMEOUT = 30000; // 30 seconds
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => {
        reject(new Error('PDF conversion timed out after 30 seconds'));
      }, CONVERSION_TIMEOUT);
    });
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      
      console.log('📄 Converting PDF to image...');
      console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
      
      // ✅ Race between conversion and timeout
      const conversionPromise = (async () => {
        const arrayBuffer = await file.arrayBuffer();
        console.log('PDF size:', arrayBuffer.byteLength, 'bytes');
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log('PDF loaded, pages:', pdf.numPages);
        
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Failed to get canvas context');
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ 
          canvasContext: context, 
          viewport, 
          canvas 
        }).promise;
        
        return canvas.toDataURL('image/png');
      })();
      
      // ✅ Whichever finishes first wins (conversion or timeout)
      const dataUrl = await Promise.race([conversionPromise, timeoutPromise]);
      
      if (!dataUrl) {
        throw new Error('PDF conversion returned no data');
      }
      
      console.log('✅ PDF converted successfully');
      return dataUrl;
      
    } catch (err: any) {
      console.error('❌ PDF conversion failed:', err);
      
      // ✅ Specific error messages based on error type
      if (err.message?.includes('timed out')) {
        setError('PDF conversion timed out. Try a smaller PDF or take a photo instead.');
      } else if (err.message?.includes('Invalid PDF')) {
        setError('Invalid PDF file. Please upload a valid PDF or try taking a photo.');
      } else {
        setError('PDF conversion failed. Please try uploading as JPG/PNG instead.');
      }
      
      return null;
    } finally {
      setConverting(false);
    }
  };

  // ✅ FIX #4: Added protection against double execution
  const handleAnalyze = async (sourceFile: File) => {
    // Prevent double execution
    if (isAnalyzing) {
      console.log('⚠️ Analysis already in progress, skipping...');
      return;
    }

    setIsAnalyzing(true);
    setLoading(true);
    setError(null);
    
    try {
      let dataUri: string | null = null;
      
      if (sourceFile.type === 'application/pdf') {
        console.log('📄 PDF detected, converting...');
        dataUri = await convertPdfToImage(sourceFile);
        
        if (!dataUri) {
          setError('PDF conversion failed – try taking a photo instead');
          return;
        }
      } else {
        console.log('🖼️ Image detected, processing...');
        dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(sourceFile);
        });
      }
      
      if (!dataUri) throw new Error('Failed to process file');
      
      console.log('🚀 Sending to API for analysis...');
      
      // ✅ TIMEOUT PROTECTION: API call should not hang forever
      const API_TIMEOUT = 60000; // 60 seconds for API analysis
      
      const apiTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Analysis timed out after 60 seconds'));
        }, API_TIMEOUT);
      });
      
      const apiCallPromise = (async () => {
        const res = await fetch('/api/document-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentDataUri: dataUri, 
            targetCountry: 'General', 
            visaType: 'Tourist' 
          }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Analysis failed');
        }
        
        return await res.json();
      })();
      
      // ✅ Race between API call and timeout
      const data: AnalysisResult = await Promise.race([apiCallPromise, apiTimeoutPromise]);
      
      console.log('✅ Analysis complete:', data.documentType);
      setResult(data);
      
    } catch (err: any) {
      console.error('❌ Analysis error:', err);
      
      // ✅ Specific error messages
      if (err.message?.includes('timed out')) {
        if (err.message.includes('60 seconds')) {
          setError('Analysis took too long. Try a clearer image or smaller file.');
        } else {
          setError(err.message);
        }
      } else if (err.message?.includes('Failed to fetch')) {
        setError('Network error. Check your internet connection and try again.');
      } else {
        setError(err.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
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
          <input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileSelect} 
            disabled={loading || isAnalyzing} 
          />
          <input 
            ref={cameraInputRef} 
            type="file" 
            className="hidden" 
            accept="image/*" 
            capture="environment" 
            onChange={handleFileSelect} 
            disabled={loading || isAnalyzing} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-32 flex flex-col items-center justify-center gap-2" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={loading || isAnalyzing}
            >
              <Upload className="w-8 h-8" />
              <p className="font-semibold">Upload File</p>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG</p>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-32 flex flex-col items-center justify-center gap-2" 
              onClick={handleCameraClick} 
              disabled={loading || isAnalyzing}
            >
              <Camera className="w-8 h-8" />
              <p className="font-semibold">Take Photo</p>
              <p className="text-xs text-muted-foreground">
                {isMobile ? 'Use camera' : 'Mobile only'}
              </p>
            </Button>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium flex-1">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { 
                  setFile(null); 
                  setResult(null); 
                  setError(null); 
                }}
                disabled={loading || isAnalyzing}
              >
                Remove
              </Button>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* ✅ IMPROVED: Better button states and messaging */}
          <Button 
            onClick={() => file && void handleAnalyze(file)} 
            disabled={!file || loading || isAnalyzing || converting} 
            className="w-full" 
            size="lg"
          >
            {converting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Converting PDF...
              </>
            ) : (loading || isAnalyzing) ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2" />
                Analyze Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {result && (
        <Card className={
          result.overallStatus === 'pass' 
            ? 'border-green-200 bg-green-50' 
            : result.overallStatus === 'warning' 
            ? 'border-yellow-200 bg-yellow-50' 
            : 'border-red-200 bg-red-50'
        }>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>{result.documentType}</CardDescription>
              </div>
              <div>
                {result.overallStatus === 'pass' && <CheckCircle className="w-12 h-12 text-green-600" />}
                {result.overallStatus === 'warning' && <AlertTriangle className="w-12 h-12 text-yellow-600" />}
                {result.overallStatus === 'critical' && <XCircle className="w-12 h-12 text-red-600" />}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {result.criticalIssues?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Critical Issues
                </h3>
                {result.criticalIssues.map((issue, i) => (
                  <div key={i} className="bg-white p-4 rounded mb-2 border border-red-200">
                    <p className="font-semibold text-red-900 mb-1">{issue.issue}</p>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Impact:</strong> {issue.impact}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Fix:</strong> {issue.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {result.warnings?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Warnings
                </h3>
                {result.warnings.map((w, i) => (
                  <div key={i} className="bg-white p-4 rounded mb-2 border border-yellow-200">
                    <p className="font-semibold text-yellow-900 mb-1">{w.issue}</p>
                    <p className="text-sm text-green-700">
                      <strong>Fix:</strong> {w.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {result.passed?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Passed Checks
                </h3>
                <ul className="space-y-2">
                  {result.passed.map((check, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                      <span className="text-sm">{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => { 
                  setFile(null); 
                  setResult(null); 
                  setError(null); 
                }}
              >
                Analyze Another
              </Button>
              
              <Button 
                className="flex-1" 
                onClick={handleGenerateReport}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2" />
                    Download AI Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}