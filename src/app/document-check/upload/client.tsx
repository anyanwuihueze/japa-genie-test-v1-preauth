'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DocumentUploadClientProps {
  user: any;
}

interface AnalysisResult {
  documentType: string;
  overallStatus: 'pass' | 'warning' | 'critical';
  criticalIssues: Array<{
    issue: string;
    impact: string;
    recommendation: string;
  }>;
  warnings: Array<{
    issue: string;
    recommendation: string;
  }>;
  passed: string[];
}

export default function DocumentUploadClient({ user }: DocumentUploadClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or image file (JPG, PNG)');
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Starting analysis for:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
      
      // Convert file to base64 data URI
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      console.log('✅ File converted to base64, sending to API...');
      
      // Call your document-check API
      const response = await fetch('/api/document-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentDataUri: dataUri,
          targetCountry: 'General',
          visaType: 'Tourist',
        }),
      });
      
      console.log('📡 API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const data = await response.json();
      console.log('📥 Received analysis:', data);
      
      // ✅ FIX: API now returns direct object (no wrapper)
      // But we still handle both formats for safety
      const analysis = data.data || data;
      
      // Validate we got the expected structure
      if (!analysis.documentType && !analysis.overallStatus) {
        console.error('❌ Invalid response structure:', analysis);
        throw new Error('Invalid response format from API');
      }
      
      setResult(analysis);
      console.log('✅ Analysis complete! Status:', analysis.overallStatus);
      
    } catch (err: any) {
      console.error('❌ Analysis failed:', err);
      setError(err.message || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload your passport, bank statement, employment letter, or any visa document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, JPG, PNG up to 10MB
              </p>
            </label>
          </div>
          
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Analyze Button */}
          <Button 
            onClick={handleAnalyze} 
            disabled={!file || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Analyzing Document...
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

      {/* Results Card */}
      {result && (
        <Card className={
          result.overallStatus === 'pass' ? 'border-green-200 bg-green-50' :
          result.overallStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>{result.documentType}</CardDescription>
              </div>
              <div className={`text-3xl ${
                result.overallStatus === 'pass' ? 'text-green-600' :
                result.overallStatus === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {result.overallStatus === 'pass' && <CheckCircle className="w-12 h-12" />}
                {result.overallStatus === 'warning' && <AlertTriangle className="w-12 h-12" />}
                {result.overallStatus === 'critical' && <XCircle className="w-12 h-12" />}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Critical Issues */}
            {result.criticalIssues && result.criticalIssues.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Critical Issues ({result.criticalIssues.length})
                </h3>
                <div className="space-y-4">
                  {result.criticalIssues.map((issue, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                      <p className="font-semibold text-red-900 mb-2">{issue.issue}</p>
                      <p className="text-sm text-red-700 mb-2">
                        <strong>Impact:</strong> {issue.impact}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Fix:</strong> {issue.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Warnings ({result.warnings.length})
                </h3>
                <div className="space-y-4">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200">
                      <p className="font-semibold text-yellow-900 mb-2">{warning.issue}</p>
                      <p className="text-sm text-green-700">
                        <strong>Recommendation:</strong> {warning.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passed Checks */}
            {result.passed && result.passed.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Passed Checks ({result.passed.length})
                </h3>
                <ul className="space-y-2">
                  {result.passed.map((check, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Analyze Another Document
              </Button>
              <Button 
                onClick={() => window.print()}
                className="flex-1"
              >
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
