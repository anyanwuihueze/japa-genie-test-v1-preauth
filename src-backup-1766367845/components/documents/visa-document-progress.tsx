// src/components/documents/visa-document-progress.tsx
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Circle, Info } from 'lucide-react';
import { calculateDocumentProgress, DocumentProgress } from '@/lib/visa-documents/progress-calculator';

interface VisaDocumentProgressProps {
  userProfile: any;
  uploadedDocuments: any[];
  showDetails?: boolean;
}

export const VisaDocumentProgress: React.FC<VisaDocumentProgressProps> = ({
  userProfile,
  uploadedDocuments,
  showDetails = true
}) => {
  const progressData: DocumentProgress = calculateDocumentProgress(userProfile, uploadedDocuments);

  if (!userProfile?.visa_type || !userProfile?.destination_country) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Profile Incomplete</AlertTitle>
        <AlertDescription>
          Complete your visa profile to see specific document requirements.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">
          {userProfile.visa_type} Visa to {userProfile.destination_country}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {progressData.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Document Progress</span>
          <span className="text-sm font-bold">
            {progressData.completed}/{progressData.total} Critical Documents
          </span>
        </div>
        <Progress value={progressData.progress} className="w-full h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Started</span>
          <span>{progressData.progress}% Complete</span>
          <span>Ready to Apply</span>
        </div>
      </div>

      {/* Missing Documents Alert */}
      {progressData.missing.length > 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Missing Critical Documents</AlertTitle>
          <AlertDescription>
            You need {progressData.missing.length} more critical document(s) to complete your application.
          </AlertDescription>
        </Alert>
      )}

      {/* Document Checklist */}
      {showDetails && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Required Documents Checklist:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {progressData.requirements.map((req) => {
              const isCompleted = uploadedDocuments.some(doc => 
                doc.type === req.id && (doc.status === 'completed' || doc.status === 'verified')
              );
              
              return (
                <div 
                  key={req.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${
                      isCompleted ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {req.name}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {req.critical ? (
                      <Badge 
                        variant={isCompleted ? "outline" : "default"}
                        className={
                          isCompleted 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-red-100 text-red-800 border-red-300'
                        }
                      >
                        {isCompleted ? 'Completed' : 'Required'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {progressData.progress === 100 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>All Documents Ready!</AlertTitle>
          <AlertDescription>
            You have all critical documents required for your {userProfile.visa_type} visa application.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};