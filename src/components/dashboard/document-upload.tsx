// src/components/dashboard/document-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const documentTypes = [
  { type: 'passport', label: 'Passport', required: true },
  { type: 'bank_statement', label: 'Bank Statement', required: true },
  { type: 'degree_certificate', label: 'Degree Certificate', required: true },
  { type: 'work_experience', label: 'Work Experience Letters', required: true },
  { type: 'police_clearance', label: 'Police Clearance', required: true },
  { type: 'medical_report', label: 'Medical Exam', required: true },
];

export function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeType, setActiveType] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File, documentType: string) => {
    setUploading(true);
    setUploadProgress(0);
    setActiveType(documentType);

    const supabase = createClient();

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${documentType}/${Date.now()}_${file.name}`, file);

      if (error) throw error;

      // Save metadata
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from('user_documents').upsert({
        user_id: user?.id,
        document_type: documentType,
        status: 'uploaded',
        file_url: data.path,
        uploaded_at: new Date().toISOString(),
      });

      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setActiveType('');
      }, 1000); // let the 100 % bar show briefly
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Document Center
        </CardTitle>
        <CardDescription>
          Upload and verify your visa documents. AI will check for errors automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {documentTypes.map((doc) => (
          <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  doc.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {doc.required ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div>
                <div className="font-medium">{doc.label}</div>
                <div className="text-sm text-muted-foreground">
                  {doc.required ? 'Required' : 'Optional'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pending</Badge>
              <Button
                size="sm"
                onClick={() => {
                  setActiveType(doc.type);
                  inputRef.current?.click();
                }}
              >
                Upload
              </Button>
            </div>
          </div>
        ))}

        {uploading && activeType && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <div className="text-sm text-center mt-2">
              {uploadProgress === 100 ? 'Upload complete!' : `Uploading… ${Math.round(uploadProgress)}%`}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, activeType);
            e.target.value = ''; // reset so same file can be re-selected
          }}
        />
      </CardContent>
    </Card>
  );
}