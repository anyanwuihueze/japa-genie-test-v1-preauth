// components/dashboard/document-checker-card.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Upload, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface DocumentCheckerCardProps {
  userId: string;
  userProgress?: any;
}

export function DocumentCheckerCard({ userId, userProgress }: DocumentCheckerCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [docStatus, setDocStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadDocumentStatus();
    }
  }, [userId]);

  const loadDocumentStatus = async () => {
    try {
      // Get recent document checks
      const { data: documents } = await supabase
        .from('user_documents')
        .select('status, created_at, file_name, ai_analysis')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (documents) {
        const total = documents.length;
        const pending = documents.filter(d => d.status === 'pending_review').length;
        const approved = documents.filter(d => d.status === 'approved').length;
        const lastCheck = documents[0]?.created_at;

        setDocStatus({
          total,
          pending,
          approved,
          lastCheck,
          needsReview: pending > 0
        });
      }
    } catch (error) {
      console.error('Error loading document status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDocuments = () => {
    router.push('/document-check');
  };

  const getStatusIcon = () => {
    if (loading) return <FileCheck className="h-4 w-4 text-gray-400" />;
    if (docStatus?.needsReview) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    if (docStatus?.total > 0) return <FileCheck className="h-4 w-4 text-green-600" />;
    return <FileCheck className="h-4 w-4 text-blue-600" />;
  };

  const getStatusText = () => {
    if (loading) return "Loading document status...";
    if (docStatus?.needsReview) return `${docStatus.pending} documents need review`;
    if (docStatus?.total > 0) return `${docStatus.approved} of ${docStatus.total} documents approved`;
    return "Upload documents for AI compliance checking";
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-purple-600" />
          AI Document Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>

          {/* Last Check */}
          {docStatus?.lastCheck && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last check: {new Date(docStatus.lastCheck).toLocaleDateString()}</span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleCheckDocuments}
            variant="outline"
            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Check Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}