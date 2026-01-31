'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentCheckerCardProps {
  className?: string;
}

export function DocumentCheckerCard({ className }: DocumentCheckerCardProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData('');

  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading document data
        </CardContent>
      </Card>
    );
  }

  const documentPercentage = dashboardData.documentCount > 0 ? (dashboardData.documentCount / 8) * 100 : 0;
  const hasDocuments = dashboardData.documentCount > 0;

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <FileText className="w-5 h-5" />
          AI Document Check
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
          Upload documents for AI compliance checking
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          {/* Stats Overview - DYNAMIC VALUES */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
                {dashboardData.documentCount}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Uploaded
              </div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-green-600`}>
                {dashboardData.approvedDocuments}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Approved
              </div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
                {8 - dashboardData.documentCount}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Remaining
              </div>
            </div>
          </div>

          {/* Progress Bar - DYNAMIC VALUE */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{Math.round(documentPercentage)}%</span>
            </div>
            <Progress value={documentPercentage} className="w-full h-2" />
          </div>

          {/* Document Status - DYNAMIC VALUES */}
          {hasDocuments ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dashboardData.documents.slice(0, 5).map((doc: any) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {doc.document_type || 'Document'}
                      </p>
                      <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${
                    doc.status === 'approved' ? 'bg-green-50 text-green-700' :
                    doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {doc.status || 'pending'}
                  </Badge>
                </div>
              ))}
              {dashboardData.documentCount > 5 && (
                <p className="text-center text-muted-foreground text-sm">
                  +{dashboardData.documentCount - 5} more documents
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>
                No Documents Yet
              </h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                Upload your first document to get AI-powered compliance checking
              </p>
            </div>
          )}

          {/* Action Button - DYNAMIC LABEL */}
          <Button asChild className="w-full" size={isMobile ? "lg" : "default"}>
            <Link href="/document-check">
              {hasDocuments ? 'Check More Documents' : 'Upload First Document'}
            </Link>
          </Button>

          {/* Last Check Info - DYNAMIC VALUE */}
          {hasDocuments && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                Last check: {getLastCheckTime(dashboardData.documents)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getLastCheckTime(documents: any[]): string {
  if (!documents.length) return 'Never';
  const latest = documents.reduce((latest, doc) => 
    new Date(doc.updated_at || doc.created_at) > new Date(latest.updated_at || latest.created_at) ? doc : latest
  );
  return new Date(latest.updated_at || latest.created_at).toLocaleDateString();
}
