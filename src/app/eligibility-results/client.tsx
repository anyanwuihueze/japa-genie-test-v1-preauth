'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { calculateVisaReadiness, type UserProfile, type RiskScoreResult } from '@/lib/visa-readiness-calculator';
import Link from 'next/link';

export default function EligibilityResultsClient() {
  const [results, setResults] = useState<RiskScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const answersJson = localStorage.getItem('visaReadinessAnswers');
    if (answersJson) {
      const answers = JSON.parse(answersJson) as Partial<UserProfile>;
      
      const completeProfile: UserProfile = {
        hasValidPassport: answers.hasValidPassport ?? false,
        allFormsCompleted: answers.allFormsCompleted ?? false,
        photosMeetRequirements: true,
        employmentHistoryConsistent: true,
        bankBalanceAdequate: answers.bankBalanceAdequate ?? false,
        fundsInOwnName: true,
        savingsDurationMonths: answers.savingsDurationMonths ?? 0,
        noLargeRecentDeposits: true,
        canUnderstandBasicInstructions: true,
        hasLanguageCertification: answers.hasLanguageCertification ?? false,
        hasPreviousVisas: answers.hasPreviousVisas ?? false,
        neverOverstayed: answers.neverOverstayed ?? true,
        returnedHomeAfterTrips: true,
        internationalTravelCount: answers.hasPreviousVisas ? 2 : 0,
        educationVerified: answers.educationVerified ?? false,
        workExperienceMatchesJob: answers.workExperienceMatchesJob ?? false,
        skillsInDemand: true,
        employmentGapsExplained: true,
        knowsCommonQuestions: true,
        practicedMockInterview: answers.practicedMockInterview ?? false,
        clearPurposeStatement: true,
        dependentsInHomeCountry: answers.dependentsInHomeCountry ?? false,
        propertyOwnership: answers.propertyOwnership ?? false,
        familyObligations: answers.dependentsInHomeCountry ?? false
      };

      const calculatedResults = calculateVisaReadiness(completeProfile);
      setResults(calculatedResults);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (results) {
      const targetScore = results.totalScore;
      if (targetScore === 0) return;

      const duration = 1500; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentScore = Math.floor(progress * targetScore);
        setDisplayScore(currentScore);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [results]);


  if (loading || !results) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your readiness...</p>
        </div>
      </section>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Score Display */}
        <Card className="p-8 md:p-12 text-center mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Visa Readiness Score</h1>
          
          <div className={`inline-block ${getScoreBg(results.totalScore)} rounded-full p-8 mb-6`}>
            <div className={`text-6xl font-bold ${getScoreColor(results.totalScore)}`}>
              {displayScore}
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">out of 100</div>
          </div>

          <div className="mb-6">
            <span className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${getScoreBg(results.totalScore)} ${getScoreColor(results.totalScore)}`}>
              {results.readinessLevel}
            </span>
          </div>

          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            {results.readinessLevel === 'Excellent' 
              ? "You're in excellent shape! Your application shows strong fundamentals across all areas."
              : results.readinessLevel === 'Good'
              ? "You're on the right track! Focus on strengthening a few key areas to maximize your chances."
              : "Your application needs improvement in several areas. The good news: we can help you fix them."}
          </p>
        </Card>

        {/* Top Weaknesses */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <h2 className="text-2xl font-bold">Your 3 Critical Weaknesses</h2>
          </div>

          <div className="space-y-4">
            {results.topWeaknesses.slice(0, 3).map((weakness, index) => (
              <div key={index} className="flex gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-700 flex-1">{weakness}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Detailed Assessment</h2>
          
          <div className="space-y-6">
            {results.breakdown.map((category, index) => {
              const percentage = (category.score / category.maxScore) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">{category.category}</span>
                    <span className={`font-bold ${getScoreColor(percentage)}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl">
          <TrendingUp className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Strengthen Your Application?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Get personalized guidance from our AI assistant. Learn exactly how to fix your weaknesses and maximize your approval chances.
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
            asChild
          >
            <Link href="/kyc">
              Get Your Action Plan <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <p className="text-sm text-purple-200 mt-4">
            Join 2,847+ applicants who improved their readiness score
          </p>
        </Card>
      </div>
    </section>
  );
}
