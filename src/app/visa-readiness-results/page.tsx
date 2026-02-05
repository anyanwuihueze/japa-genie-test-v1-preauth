'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { analyzeEligibility } from '@/ai/flows/eligibility-analysis-flow';
import type { UserProfile } from '@/lib/visa-readiness-calculator';

interface AnalysisResults {
  topWeaknesses: string[];
  actionPlan: string[];
  countrySpecificTips: string[];
  readinessScore: number;
}

export default function VisaReadinessResults() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');

  useEffect(() => {
    async function analyze() {
      const dataJson = localStorage.getItem('visaReadinessData');
      if (!dataJson) {
        setLoading(false);
        return;
      }

      const data = JSON.parse(dataJson);
      setCountry(data.country);
      setVisaType(data.visaType);

      try {
        const aiResults = await analyzeEligibility({
          country: data.country,
          visaType: data.visaType,
          answers: data.answers
        });
        
        setResults(aiResults);
      } catch (error) {
        console.error('Analysis failed:', error);
        // Fallback results
        setResults({
          topWeaknesses: [
            'Unable to complete AI analysis',
            'Please check your internet connection',
            'Try again or contact support'
          ],
          actionPlan: [
            'Ensure all documents are complete',
            'Review financial requirements',
            'Practice interview responses'
          ],
          countrySpecificTips: [
            'Check official embassy website',
            'Allow extra processing time',
            'Consider expert consultation'
          ],
          readinessScore: 50
        });
      } finally {
        setLoading(false);
      }
    }

    analyze();
  }, []);

  if (loading || !results) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <div className="flex items-center gap-2 justify-center mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <p className="text-xl font-semibold text-gray-700">AI is analyzing your profile...</p>
          </div>
          <p className="text-gray-600">Checking {country} {visaType} requirements</p>
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

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* AI Badge */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis for {country} {visaType}
          </div>
        </div>

        {/* Score Display */}
        <Card className="p-8 md:p-12 text-center mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Visa Readiness Score</h1>
          
          <div className={`inline-block ${getScoreBg(results.readinessScore)} rounded-full p-8 mb-6`}>
            <div className={`text-6xl font-bold ${getScoreColor(results.readinessScore)}`}>
              {results.readinessScore}
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">out of 100</div>
          </div>

          <div className="mb-6">
            <span className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${getScoreBg(results.readinessScore)} ${getScoreColor(results.readinessScore)}`}>
              {getReadinessLevel(results.readinessScore)}
            </span>
          </div>

          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            {results.readinessScore >= 80
              ? `You're well-prepared for your ${country} ${visaType} application!`
              : results.readinessScore >= 60
              ? `You're on track, but some improvements will boost your chances.`
              : `Your application needs strengthening in several key areas.`}
          </p>
        </Card>

        {/* Top Weaknesses - AI Generated */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <div>
              <h2 className="text-2xl font-bold">Your Critical Weaknesses</h2>
              <p className="text-sm text-gray-600">AI-identified issues for {country} {visaType}</p>
            </div>
          </div>

          <div className="space-y-4">
            {results.topWeaknesses.map((weakness, index) => (
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

        {/* Action Plan - AI Generated */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold">Your Action Plan</h2>
          </div>

          <div className="space-y-3">
            {results.actionPlan.map((action, index) => (
              <div key={index} className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Country-Specific Tips - AI Generated */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/60 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold">{country}-Specific Tips</h2>
              <p className="text-sm text-gray-600">Tailored advice from AI analysis</p>
            </div>
          </div>

          <div className="space-y-3">
            {results.countrySpecificTips.map((tip, index) => (
              <div key={index} className="flex gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl">
          <TrendingUp className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Fix These Issues?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Get personalized guidance from our AI assistant and expert consultants.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
              asChild
            >
              <a href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              asChild
            >
              <a href="/interview">
                Practice Interview <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          
          <p className="text-sm text-purple-200 mt-6">
            Join 2,847+ applicants improving their applications
          </p>
        </Card>
      </div>
    </section>
  );
}
