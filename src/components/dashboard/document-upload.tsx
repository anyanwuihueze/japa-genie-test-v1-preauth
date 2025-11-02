'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function DocumentUpload() {
  const [uploading, setUploading] = useState(false);

  const analyzeDocumentWithAI = async (file: File, documentType: string) => {
    // This would call your AI document analysis endpoint
    const analysis = {
      status: 'reviewing',
      issues: ['Blurry image detected', 'Missing signature field'],
      recommendations: ['Retake photo in better light', 'Get document signed'],
      confidence: 85
    };
    
    return analysis;
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    setUploading(true);
    
    const supabase = createClient();
    
    try {
      // 1. Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${documentType}/${Date.now()}_${file.name}`, file);

      if (error) throw error;

      // 2. AI Document Analysis
      const aiAnalysis = await analyzeDocumentWithAI(file, documentType);
      
      // 3. Save document record with AI results
      await supabase
        .from('user_documents')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          document_type: documentType,
          status: aiAnalysis.status,
          file_url: data.path,
          uploaded_at: new Date().toISOString(),
          ai_analysis_result: aiAnalysis
        });

      // 4. Show AI analysis results to user
      console.log('AI Analysis:', aiAnalysis);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          AI Document Checker
        </CardTitle>
        <CardDescription>
          Upload documents - our AI will review for errors and give expert guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">AI-Powered Review</span>
          </div>
          <p className="text-sm text-blue-700">
            Our AI checks for: blurry images, missing signatures, formatting issues, 
            expiration dates, and document authenticity flags.
          </p>
        </div>

        <Button className="w-full" disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Analyzing with AI...' : 'Upload Document for AI Review'}
        </Button>
        
        {uploading && (
          <div className="text-center text-sm text-muted-foreground">
            AI is reviewing your document for errors and compliance...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
