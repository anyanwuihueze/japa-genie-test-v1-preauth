'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Calendar,
  MapPin,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  order: number;
  estimatedDuration: string;
  actualDuration?: string;
  completedAt?: string;
  startedAt?: string;
  dueDate?: string;
  prerequisites: string[];
  deliverables: string[];
  expertTip?: string;
  commonMistakes?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'guide' | 'tool' | 'expert' | 'checklist';
  }[];
  progress: number; // 0-100
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
    required: boolean;
  }[];
}

interface ApplicationTimelineProps {
  userId: string;
  userProfile?: any;
  currentProgress?: number;
  className?: string;
}

export function ApplicationTimeline({ userId, userProfile, currentProgress, className }: ApplicationTimelineProps) {
  const [stages, setStages] = useState<TimelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch user's timeline progress
        const { data: timelineData } = await supabase
          .from('user_timeline')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Fetch user progress to calculate current stage
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Generate timeline based on user data
        const generatedStages = generateTimelineStages(userProfile, progressData, currentProgress || 0);
        
        setStages(generatedStages);
        
      } catch (error) {
        console.error('Error fetching timeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [userId, userProfile, currentProgress]);

  const generateTimelineStages = (profile: any, progress: any, overallProgress: number): TimelineStage[] => {
    const stages: TimelineStage[] = [
      {
        id: 'onboarding',
        title: 'Getting Started',
        description: 'Complete your profile and understand your visa requirements',
        status: overallProgress >= 20 ? 'completed' : overallProgress >= 5 ? 'in-progress' : 'pending',
        order: 1,
        estimatedDuration: '1-2 days',
        prerequisites: [],
        deliverables: ['Completed profile', 'Visa type selected', 'Basic requirements understood'],
        expertTip: 'Take your time to understand the requirements - rushing here causes 40% of rejections',
        commonMistakes: ['Choosing wrong visa type', 'Incomplete profile information'],
        resources: [
          { title: 'Visa Type Guide', url: '/guides/visa-types', type: 'guide' },
          { title: 'Eligibility Checker', url: '/eligibility', type: 'tool' }
        ],
        progress: Math.min(overallProgress, 100),
        subtasks: [
          { id: 'profile-complete', title: 'Complete personal profile', completed: !!profile?.country, required: true },
          { id: 'visa-selected', title: 'Select visa type', completed: !!profile?.visa_type, required: true },
          { id: 'destination-set', title: 'Set destination country', completed: !!profile?.destination_country, required: true },
          { id: 'requirements-reviewed', title: 'Review visa requirements', completed: overallProgress >= 10, required: true }
        ]
      },
      {
        id: 'document-preparation',
        title: 'Document Preparation',
        description: 'Gather and prepare all required documents for your application',
        status: overallProgress >= 50 ? 'completed' : overallProgress >= 25 ? 'in-progress' : 'pending',
        order: 2,
        estimatedDuration: '2-3 weeks',
        prerequisites: ['Completed profile', 'Visa type selected'],
        deliverables: ['Passport ready', 'Photos taken', 'Financial documents prepared', 'Supporting documents collected'],
        expertTip: 'Start with financial documents - they take the longest to prepare properly',
        commonMistakes: ['Expired passport', 'Wrong photo specifications', 'Insufficient bank balance'],
        resources: [
          { title: 'Document Checklist', url: '/documents/checklist', type: 'checklist' },
          { title: 'Photo Requirements', url: '/guides/photos', type: 'guide' },
          { title: 'AI Document Checker', url: '/document-check', type: 'tool' }
        ],
        progress: overallProgress >= 20 ? Math.min((overallProgress - 20) * 2, 100) : 0,
        subtasks: [
          { id: 'passport-ready', title: 'Ensure passport validity', completed: progress?.documents_completed >= 1, required: true },
          { id: 'photos-done', title: 'Get visa photos', completed: progress?.documents_completed >= 2, required: true },
          { id: 'bank-statements', title: 'Prepare bank statements', completed: progress?.documents_completed >= 3, required: true },
          { id: 'support-docs', title: 'Collect supporting documents', completed: progress?.documents_completed >= 4, required: false }
        ]
      },
      {
        id: 'application-submission',
        title: 'Application Submission',
        description: 'Complete and submit your visa application with professional review',
        status: overallProgress >= 70 ? 'completed' : overallProgress >= 55 ? 'in-progress' : 'pending',
        order: 3,
        estimatedDuration: '1 week',
        prerequisites: ['All documents ready', 'Application forms completed'],
        deliverables: ['Completed application form', 'All documents uploaded', 'Professional review completed', 'Application submitted'],
        expertTip: 'Have an expert review your application before submission - 30% of applications have errors',
        commonMistakes: ['Incomplete forms', 'Wrong fee payment', 'Missing signatures'],
        resources: [
          { title: 'Application Review Service', url: '/experts/application-review', type: 'expert' },
          { title: 'Fee Calculator', url: '/tools/fee-calculator', type: 'tool' },
          { title: 'Submission Guide', url: '/guides/submission', type: 'guide' }
        ],
        progress: overallProgress >= 55 ? Math.min((overallProgress - 55) * 3, 100) : 0,
        subtasks: [
          { id: 'forms-completed', title: 'Complete application forms', completed: overallProgress >= 60, required: true },
          { id: 'documents-uploaded', title: 'Upload all documents', completed: progress?.documents_completed >= 6, required: true },
          { id: 'expert-review', title: 'Get expert review', completed: progress?.expert_sessions >= 1, required: false },
          { id: 'fees-paid', title: 'Pay application fees', completed: overallProgress >= 65, required: true }
        ]
      },
      {
        id: 'interview-preparation',
        title: 'Interview Preparation',
        description: 'Prepare for your visa interview with mock sessions and expert guidance',
        status: overallProgress >= 85 ? 'completed' : overallProgress >= 75 ? 'in-progress' : 'pending',
        order: 4,
        estimatedDuration: '1-2 weeks',
        prerequisites: ['Application submitted', 'Interview scheduled'],
        deliverables: ['Mock interview completed', 'Common questions practiced', 'Confidence built', 'Expert feedback received'],
        expertTip: 'Practice makes perfect - do at least 3 mock interviews before the real one',
        commonMistakes: ['Not preparing for common questions', 'Inconsistent answers', 'Nervous body language'],
        resources: [
          { title: 'Mock Interview Tool', url: '/interview', type: 'tool' },
          { title: 'Common Questions', url: '/guides/interview-questions', type: 'guide' },
          { title: 'Interview Coach', url: '/experts/interview-coach', type: 'expert' }
        ],
        progress: overallProgress >= 75 ? Math.min((overallProgress - 75) * 4, 100) : 0,
        subtasks: [
          { id: 'interview-scheduled', title: 'Schedule interview', completed: overallProgress >= 80, required: true },
          { id: 'mock-interview', title: 'Complete mock interview', completed: progress?.expert_sessions >= 2, required: true },
          { id: 'questions-practiced', title: 'Practice common questions', completed: overallProgress >= 82, required: true },
          { id: 'expert-feedback', title: 'Get expert feedback', completed: progress?.expert_sessions >= 3, required: false }
        ]
      },
      {
        id: 'final-preparation',
        title: 'Final Preparation',
        description: 'Last steps before your interview and travel preparation',
        status: overallProgress >= 95 ? 'completed' : overallProgress >= 90 ? 'in-progress' : 'pending',
        order: 5,
        estimatedDuration: '3-5 days',
        prerequisites: ['Interview preparation complete', 'All documents ready'],
        deliverables: ['Final document check', 'Interview confirmation', 'Travel arrangements', 'Backup plan ready'],
        expertTip: 'Have a backup plan and arrive early - unexpected issues happen 20% of the time',
        commonMistakes: ['Last-minute changes', 'Not checking document validity', 'Poor travel planning'],
        resources: [
          { title: 'Final Checklist', url: '/guides/final-checklist', type: 'checklist' },
          { title: 'Travel Guide', url: '/guides/travel-preparation', type: 'guide' },
          { title: 'Emergency Support', url: '/support/emergency', type: 'expert' }
        ],
        progress: overallProgress >= 90 ? Math.min((overallProgress - 90) * 5, 100) : 0,
        subtasks: [
          { id: 'final-check', title: 'Final document check', completed: overallProgress >= 92, required: true },
          { id: 'travel-ready', title: 'Prepare for travel', completed: overallProgress >= 94, required: false },
          { id: 'backup-plan', title: 'Have backup plan', completed: overallProgress >= 95, required: false }
        ]
      },
      {
        id: 'visa-approval',
        title: 'Visa Approval & Travel',
        description: 'Celebrate your approval and prepare for your journey',
        status: overallProgress >= 100 ? 'completed' : 'pending',
        order: 6,
        estimatedDuration: '1-2 weeks',
        prerequisites: ['Successful interview', 'Visa approved'],
        deliverables: ['Visa received', 'Travel plans confirmed', 'Accommodation booked', 'Ready to travel'],
        expertTip: 'Start preparing for your move immediately after approval - there\'s a lot to organize!',
        commonMistakes: ['Waiting too long to travel', 'Not understanding visa conditions'],
        resources: [
          { title: 'Relocation Guide', url: '/guides/relocation', type: 'guide' },
          { title: 'Settling In Support', url: '/support/settling-in', type: 'expert' }
        ],
        progress: overallProgress >= 100 ? 100 : 0,
        subtasks: [
          { id: 'visa-received', title: 'Receive your visa', completed: overallProgress >= 100, required: true },
          { id: 'travel-plans', title: 'Confirm travel plans', completed: overallProgress >= 100, required: true }
        ]
      }
    ];

    return stages;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const currentStage = stages.find(stage => stage.status === 'in-progress');
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const totalStages = stages.length;

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} pb-4`}>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Calendar className="w-5 h-5" />
            Application Timeline
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {completedStages}/{totalStages} Complete
          </Badge>
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round((completedStages / totalStages) * 100)}%</span>
          </div>
          <Progress value={(completedStages / totalStages) * 100} className="h-2" />
        </div>

        {currentStage && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className={`text-blue-800 ${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                Current Stage: {currentStage.title}
              </span>
            </div>
            <p className={`text-blue-700 mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {currentStage.description}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        
        {/* Timeline Visualization */}
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              
              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-16 ${isMobile ? 'left-5' : ''} ${stage.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'}`}></div>
              )}

              <div className="flex gap-4">
                {/* Stage Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-green-100' : 
                  stage.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {getStatusIcon(stage.status)}
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      stage.status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 
                      stage.status === 'completed' ? 'bg-green-50 border-green-200' : 
                      'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                            {stage.title}
                          </h4>
                          <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {stage.estimatedDuration}
                          </Badge>
                        </div>
                        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                          {stage.description}
                        </p>
                      </div>
                      <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedStage === stage.id ? 'rotate-90' : ''
                      }`} />
                    </div>

                    {/* Progress Bar for In-Progress Stages */}
                    {stage.status === 'in-progress' && (
                      <div className="mt-3">
                        <Progress value={stage.progress} className="h-2" />
                        <p className={`text-xs text-muted-foreground mt-1`}>
                          {stage.progress}% Complete
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedStage === stage.id && (
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                      
                      {/* Subtasks */}
                      <div>
                        <h5 className={`font-medium mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>Tasks:</h5>
                        <div className="space-y-2">
                          {stage.subtasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                              }`}>
                                {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`${task.completed ? 'text-gray-500 line-through' : ''} ${isMobile ? 'text-sm' : 'text-base'}`}>
                                {task.title}
                                {task.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expert Tip */}
                      {stage.expertTip && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className={`text-yellow-800 ${isMobile ? 'text-sm' : 'text-base'}`}>
                              <span className="font-medium">Expert Tip:</span> {stage.expertTip}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Resources */}
                      {stage.resources && stage.resources.length > 0 && (
                        <div>
                          <h5 className={`font-medium mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>Helpful Resources:</h5>
                          <div className="flex flex-wrap gap-2">
                            {stage.resources.map((resource, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                asChild
                                className={`${isMobile ? 'text-xs' : 'text-sm'}`}
                              >
                                <a href={resource.url}>
                                  {resource.title}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedStages}</div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stages.filter(s => s.status === 'in-progress').length}
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {stages.filter(s => s.status === 'pending').length}
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedStages / stages.length) * 100)}%
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Complete</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
