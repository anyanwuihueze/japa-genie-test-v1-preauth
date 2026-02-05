'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Upload,
  Eye,
  Download
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface DocumentAIAnalysisProps {
  userId: string;
  className?: string;
}

interface DocumentAnalysis {
  id: string;
  document_name: string;
  document_type: string;
  status: 'approved' | 'rejected' | 'needs_review' | 'pending';
  confidence_score: number;
  issues_found: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
  warnings: string[];
  recommendations: string[];
  processing_time_ms: number;
  created_at: string;
}

export function DocumentAIAnalysis({ userId, className }: DocumentAIAnalysisProps) {
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentAnalysis | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchDocumentAnalyses();
  }, [userId]);

  const fetchDocumentAnalyses = async () => {
    try {
      const supabase = createClient();
      
      // Get recent document analyses
      const { data: analyses } = await supabase
        .from('document_ai_analysis')
        .select(`
          *,
          user_documents!inner(
            file_name,
            document_type,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (analyses) {
        const formattedAnalyses = analyses.map(analysis => ({
          id: analysis.id,
          document_name: analysis.user_documents?.file_name || 'Unknown Document',
          document_type: analysis.user_documents?.document_type || 'unknown',
          status: analysis.overall_assessment || 'pending',
          confidence_score: analysis.confidence_score || 0,
          issues_found: analysis.issues_found || [],
          warnings: analysis.warnings || [],
          recommendations: analysis.recommendations || [],
          processing_time_ms: analysis.processing_time_ms || 0,
          created_at: analysis.created_at
        }));

        setAnalyses(formattedAnalyses);
      }
    } catch (error) {
      console.error('Error fetching document analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'needs_review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'needs_review': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Document AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}>
            No Document Analysis Yet
          </h3>
          <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
            Upload documents for AI compliance checking and intelligent analysis
          </CardDescription>
          <Button asChild className="mt-4" size={isMobile ? 'sm' : 'default'}>
            <Link href="/document-check">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
              Document Intelligence
            </CardTitle>
            <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
              AI-powered compliance analysis
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-50">
            <FileText className="w-3 h-3 mr-1" />
            {analyses.length} Analyzed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${getStatusColor(analysis.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {analysis.document_type === 'passport' ? '🛂' :
                     analysis.document_type === 'bank_statement' ? '🏦' :
                     analysis.document_type === 'photo' ? '📸' :
                     '📄'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {analysis.document_name}
                      </h4>
                      {getStatusIcon(analysis.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(analysis.status)}>
                        {analysis.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className={`text-xs font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
                        {analysis.confidence_score}% Confidence
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(analysis.processing_time_ms)}ms
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoc(selectedDoc?.id === analysis.id ? null : analysis)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* Detailed Analysis */}
              {selectedDoc?.id === analysis.id && (
                <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                  {/* Issues Found */}
                  {analysis.issues_found.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-sm mb-2">Issues Found:</h5>
                      <div className="space-y-2">
                        {analysis.issues_found.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-md border text-sm ${getIssueSeverityColor(issue.severity)}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{issue.type}</span>
                              <Badge variant="outline" className="text-xs">
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="mb-1">{issue.description}</p>
                            <p className="text-xs opacity-75">
                              <strong>Recommendation:</strong> {issue.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {analysis.warnings.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-sm mb-2">Warnings:</h5>
                      <div className="space-y-1">
                        {analysis.warnings.map((warning, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">Recommendations:</h5>
                      <div className="space-y-1">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-blue-700">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Quick Actions */}
          <div className="mt-6 flex gap-3">
            <Button asChild className="flex-1" size={isMobile ? 'sm' : 'default'}>
              <Link href="/document-check">
                <Upload className="w-4 h-4 mr-2" />
                Upload More
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" size={isMobile ? 'sm' : 'default'}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
