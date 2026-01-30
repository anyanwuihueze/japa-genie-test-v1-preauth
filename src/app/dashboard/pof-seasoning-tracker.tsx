'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText, 
  Upload,
  AlertCircle,
  Star,
  Calendar
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface POFSeasoningTrackerProps {
  userId: string;
  userProfile?: any;
  className?: string;
}

interface SeasonData {
  season_number: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  target_average_balance: number;
  current_average_balance: number;
  required_statements: number;
  uploaded_statements: number;
  approved_statements: number;
  start_date: string | null;
  end_date: string | null;
  unlocked_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
}

export function POFSeasoningTracker({ userId, userProfile, className }: POFSeasoningTrackerProps) {
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (userProfile?.visa_type && userProfile?.destination_country) {
      initializeSeasons();
    }
  }, [userProfile]);

  const initializeSeasons = async () => {
    try {
      const supabase = createClient();
      
      // Check if user needs seasoning based on visa type
      const { data: requirements } = await supabase
        .from('pof_season_requirements')
        .select('*')
        .eq('country', userProfile.destination_country)
        .eq('visa_type', userProfile.visa_type)
        .order('season_number');

      if (!requirements || requirements.length === 0) {
        // No seasoning required for this visa type
        setLoading(false);
        return;
      }

      // Initialize or update seasons for this user
      const seasonsData: SeasonData[] = [];
      
      for (const req of requirements) {
        // Check if season already exists
        const { data: existingSeason } = await supabase
          .from('user_pof_seasons')
          .select('*')
          .eq('user_id', userId)
          .eq('season_number', req.season_number)
          .single();

        if (existingSeason) {
          seasonsData.push(existingSeason);
        } else {
          // Create new season
          const newSeason = {
            user_id: userId,
            season_number: req.season_number,
            status: req.season_number === 1 ? 'available' : 'locked',
            target_average_balance: req.min_average_balance,
            current_average_balance: 0,
            required_statements: req.required_statements,
            uploaded_statements: 0,
            approved_statements: 0,
            start_date: null,
            end_date: null,
            unlocked_at: req.season_number === 1 ? new Date().toISOString() : null,
            completed_at: null,
            progress_percentage: 0
          };

          const { data: createdSeason } = await supabase
            .from('user_pof_seasons')
            .insert(newSeason)
            .select()
            .single();

          seasonsData.push(createdSeason);
        }
      }

      setSeasons(seasonsData);
      
      // Find current active season
      const activeSeason = seasonsData.find(s => s.status === 'in_progress') || 
                          seasonsData.find(s => s.status === 'available');
      if (activeSeason) {
        setCurrentSeason(activeSeason.season_number);
      }

    } catch (error) {
      console.error('Error initializing seasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeasonIcon = (seasonNumber: number) => {
    const icons = ['🌱', '🌿', '🌳'];
    return icons[seasonNumber - 1] || '🌱';
  };

  const getSeasonColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'available': return 'text-orange-600';
      case 'locked': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getSeasonBgColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'in_progress': return 'bg-blue-50 border-blue-200';
      case 'available': return 'bg-orange-50 border-orange-200';
      case 'locked': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const handleUploadStatement = async (seasonNumber: number) => {
    // Navigate to document upload with POF context
    window.location.href = `/dashboard/proof-of-funds?season=${seasonNumber}&action=upload`;
  };

  const handleSeasonAction = async (seasonNumber: number) => {
    const season = seasons.find(s => s.season_number === seasonNumber);
    if (!season) return;

    if (season.status === 'locked') {
      // Show unlock requirements
      alert(`Complete Season ${seasonNumber - 1} first to unlock this season!`);
      return;
    }

    if (season.status === 'in_progress' && season.uploaded_statements < season.required_statements) {
      handleUploadStatement(seasonNumber);
      return;
    }

    if (season.status === 'completed') {
      // Show completion celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>POF Seasoning Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (seasons.length === 0) {
    return null; // No seasoning required for this visa type
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <div className="text-xl font-bold text-green-600">Season Completed!</div>
            <div className="text-sm text-gray-600">Ready for the next season</div>
          </div>
        </div>
      )}

      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
              Proof of Funds Seasoning
            </CardTitle>
            <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
              Progressive financial requirement tracking
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            <TrendingUp className="w-3 h-3 mr-1" />
            Season {currentSeason}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="space-y-4">
          {seasons.map((season, index) => (
            <div
              key={season.season_number}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${getSeasonBgColor(season.status)} ${season.status === 'in_progress' ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getSeasonIcon(season.season_number)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                        Season {season.season_number}
                      </h4>
                      {season.status === 'locked' && <Lock className="w-4 h-4 text-gray-400" />}
                      {season.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {season.status === 'locked' ? 'Complete previous season to unlock' :
                       season.status === 'available' ? 'Ready to start' :
                       season.status === 'in_progress' ? 'In progress' :
                       'Completed'}
                    </p>
                  </div>
                </div>
                <Badge className={getSeasonColor(season.status)}>
                  {Math.round(season.progress_percentage)}%
                </Badge>
              </div>

              {/* Season Details */}
              <div className="mt-4 space-y-3">
                {/* Target Balance */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Target Average Balance</span>
                    <span className="text-muted-foreground">
                      ₦{season.current_average_balance.toLocaleString()} / ₦{season.target_average_balance.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(season.current_average_balance / season.target_average_balance) * 100} className="w-full h-2" />
                </div>

                {/* Statements Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Bank Statements
                    </span>
                    <span className="text-muted-foreground">
                      {season.uploaded_statements} / {season.required_statements}
                    </span>
                  </div>
                  <Progress value={(season.uploaded_statements / season.required_statements) * 100} className="w-full h-2" />
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSeasonAction(season.season_number)}
                  disabled={season.status === 'locked'}
                  variant={season.status === 'completed' ? 'outline' : 'default'}
                  className="w-full"
                  size={isMobile ? 'sm' : 'default'}
                >
                  {season.status === 'locked' ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  ) : season.status === 'completed' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Details
                    </>
                  ) : season.uploaded_statements < season.required_statements ? (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Statements
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {/* Smart Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-blue-800 text-sm">
                  Pro Tip: Seasoning Strategy
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Maintain consistent deposits. Sudden large amounts may raise red flags. 
                  Gradual building shows financial stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
