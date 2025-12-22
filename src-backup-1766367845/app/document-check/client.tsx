// src/app/document-check/client.tsx - UPDATED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VisaDocumentProgress } from '@/components/documents/visa-document-progress';
import { calculateDocumentProgress } from '@/lib/visa-documents/progress-calculator';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocumentCheckClientProps {
  user: any;
  userProfile: any;
}

export default function DocumentCheckClient({ user, userProfile }: DocumentCheckClientProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const supabase = createClient();

  useEffect(() => {
    loadUserDocuments();
  }, [user]);

  const loadUserDocuments = async () => {
    try {
      const { data: documents, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUploadedDocuments(documents || []);
      
      // Calculate overall progress including document progress
      const docProgress = calculateDocumentProgress(userProfile, documents || []);
      const baseProgress = userProfile?.destination_country && userProfile?.visa_type ? 25 : 0;
      const documentProgress = docProgress.progress * 0.5; // Documents are 50% of total
      
      setOverallProgress(Math.min(100, baseProgress + documentProgress));
      
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const documentProgress = calculateDocumentProgress(userProfile, uploadedDocuments);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Document Check</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Upload and verify your visa application documents
        </p>
      </header>

      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Application Progress</CardTitle>
              <CardDescription>
                {userProfile?.destination_country && userProfile?.visa_type 
                  ? `${userProfile.visa_type} Visa to ${userProfile.destination_country}`
                  : 'Complete your profile to see requirements'
                }
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full h-3 mb-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Getting Started</span>
            <span>
              {documentProgress.completed}/{documentProgress.total} Documents
            </span>
            <span>Ready to Apply</span>
          </div>
        </CardContent>
      </Card>

      {/* Visa-Specific Document Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
          <CardDescription>
            Based on {userProfile?.visa_type} visa requirements for {userProfile?.destination_country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisaDocumentProgress 
            userProfile={userProfile}
            uploadedDocuments={uploadedDocuments}
            showDetails={true}
          />
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload your documents for verification and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drag and drop your documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG (Max 10MB each)
              </p>
              <Button>Select Files</Button>
            </div>
            
            {/* Uploaded Documents List */}
            {uploadedDocuments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Uploaded Documents</h4>
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.status === 'verified' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : doc.status === 'rejected' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      doc.status === 'verified' ? 'default' : 
                      doc.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {doc.status || 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button size="lg" asChild>
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="/chat">Ask AI About Documents</a>
        </Button>
      </div>
    </div>
  );
}