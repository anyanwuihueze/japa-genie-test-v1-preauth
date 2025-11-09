// src/app/visa-matchmaker/page.tsx - PRODUCTION READY VERSION
'use client';
import { useState, useCallback } from 'react';
import { Crown, Sparkles, CheckCircle, Loader2, X, Lock, ChevronDown, ChevronUp, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

const QuickQuiz = ({ answers, updateAnswer, isLoading, getRealAIMatches }) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-amber-700">AI Visa Assessment</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-blue-500 bg-clip-text text-transparent">
        Find Your Best Visa Match
      </h1>
      <p className="text-lg text-gray-600">
        Answer key questions for personalized AI analysis against global visa requirements.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      {/* Age Range */}
      <div>
        <label className="block text-lg font-semibold mb-3">1. Age range? 🎂</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['18-24', '25-34', '35-44', '45-54', '55+'].map(age => (
            <button
              key={age}
              onClick={() => updateAnswer('age', age)}
              className={`p-4 rounded-xl border-2 transition-all ${
                answers.age === age ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-medium">{age}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      {answers.age && (
        <div>
          <label className="block text-lg font-semibold mb-3">2. Work experience? 💼</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['0-2', '3-5', '6-10', '10+'].map(exp => (
              <button
                key={exp}
                onClick={() => updateAnswer('experience', exp)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  answers.experience === exp ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{exp} years</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* English Level */}
      {answers.experience && (
        <div>
          <label className="block text-lg font-semibold mb-3">3. English level? 🗣️</label>
          <div className="grid grid-cols-2 gap-3">
            {['Basic', 'Intermediate', 'Advanced', 'Native'].map(level => (
              <button
                key={level}
                onClick={() => updateAnswer('englishLevel', level)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  answers.englishLevel === level ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{level}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profession */}
      {answers.englishLevel && (
        <div>
          <label className="block text-lg font-semibold mb-3">4. Profession? 💼</label>
          <input
            type="text"
            placeholder="Software Engineer, Nurse, Accountant"
            value={answers.profession}
            onChange={(e) => updateAnswer('profession', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
      )}

      {/* Education */}
      {answers.profession && (
        <div>
          <label className="block text-lg font-semibold mb-3">5. Education? 🎓</label>
          <div className="grid grid-cols-2 gap-3">
            {['High School', 'Bachelors', 'Masters', 'PhD'].map(education => (
              <button
                key={education}
                onClick={() => updateAnswer('education', education)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  answers.education === education ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{education}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Goal */}
      {answers.education && (
        <div>
          <label className="block text-lg font-semibold mb-3">6. Primary goal? 🎯</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Study', 'Work', 'Business', 'Family', 'Tourism'].map(goal => (
              <button
                key={goal}
                onClick={() => updateAnswer('goal', goal)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  answers.goal === goal ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{goal}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {answers.goal && (
        <button
          onClick={() => getRealAIMatches(answers)}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI Analyzing Your Profile...
            </>
          ) : (
            <>
              Get AI-Powered Matches
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  </div>
);

export default function VisaMatchmakerReal() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: '', experience: '', englishLevel: '', profession: '', education: '', goal: ''
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  const updateAnswer = useCallback((field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  }, []);

  const getAgeFromRange = (ageRange: string) => ({
    '18-24': 21, '25-34': 29, '35-44': 39, '45-54': 49, '55+': 57
  }[ageRange] || 30);

  const getExperienceFromRange = (expRange: string) => ({
    '0-2': 1, '3-5': 4, '6-10': 8, '10+': 12
  }[expRange] || 3);

  const getRealAIMatches = async (userProfile: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/visa-matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            age: getAgeFromRange(userProfile.age),
            education: userProfile.education,
            profession: userProfile.profession,
            workExperience: getExperienceFromRange(userProfile.experience),
            englishProficiency: userProfile.englishLevel,
            budget: 15000,
            primaryGoal: userProfile.goal,
            preferredRegions: ['North America', 'Europe'],
            currentCountry: 'Nigeria',
            hasSpouse: false,
            hasDependents: false,
          },
          isPremium: false
        })
      });
      
      if (!response.ok) throw new Error('API call failed');
      const results = await response.json();
      setAiResults(results);
      setStep(2);
    } catch (error) {
      console.error('AI Error:', error);
      alert('AI service temporarily down. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const TeaserResults = () => {
    const visibleMatches = aiResults?.topMatches?.slice(0, 2) || [];
    const hiddenMatches = aiResults?.topMatches?.slice(2) || [];
    const hiddenMatchesCount = hiddenMatches.length;

    // Fallback values for missing data
    const getSuccessRate = (match: any) => match.successRate || match.successProbability || 70;
    const getProcessingTime = (match: any) => match.processingTime || "4-6 months";
    const getStrengths = (match: any) => match.strengths?.slice(0, 3) || ["Good education match", "Favorable age", "English proficiency"];

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">AI Analysis Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Your Visa Matches
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your profile, we found {aiResults?.topMatches?.length || 0} countries where you have strong visa opportunities
          </p>
        </div>

        {/* Visible Matches */}
        <div className="grid md:grid-cols-2 gap-6">
          {visibleMatches.map((match: any, index: number) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{match.country}</h3>
                      <p className="text-gray-600 text-sm">{match.visaType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">{match.matchScore}%</div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">✅ Key Advantages</h4>
                    <ul className="space-y-1">
                      {getStrengths(match).map((strength: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-gray-700">Success Rate: {getSuccessRate(match)}%</span>
                    </div>
                    <div className="text-blue-600 font-medium">
                      Processing: {getProcessingTime(match)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hidden Matches Teaser */}
        {!isPremium && hiddenMatchesCount > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">
              🔒 Unlock {hiddenMatchesCount} More Premium Matches
            </h3>
            <p className="text-purple-100 mb-4 max-w-md mx-auto">
              Get complete access to all {aiResults?.topMatches?.length} countries with detailed analysis
            </p>
            
            {/* Expandable Features */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <button
                onClick={() => setExpandedFeatures(!expandedFeatures)}
                className="flex items-center justify-center gap-2 w-full text-purple-100 font-semibold"
              >
                What you're missing {expandedFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedFeatures && (
                <div className="mt-4 grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">All {aiResults?.topMatches?.length} country matches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Step-by-step visa roadmaps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Rejection risk analysis</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Document checklist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Mock interviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">AI chat support</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main CTA */}
            <div className="space-y-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">$10<span className="text-lg font-normal">/week</span></div>
                <div className="text-purple-100 text-sm">Full access to all countries + tools</div>
              </div>
              
              <Link 
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
              >
                <Crown className="w-5 h-5" />
                Unlock Complete Results & Visa Roadmaps
              </Link>
              
              <p className="text-purple-200 text-sm mt-2">
                Everything you need to continue your visa journey
              </p>
            </div>
          </div>
        )}

        {/* Additional Value Proposition */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Ready to Start Your Visa Journey?</h3>
            </div>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Get personalized visa roadmaps, document checklists, and expert guidance for all matched countries
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">Step-by-Step Roadmaps</div>
                <div className="text-amber-100 text-sm">Clear guidance for each country</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">Risk Analysis</div>
                <div className="text-amber-100 text-sm">Avoid common rejection reasons</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">AI Support</div>
                <div className="text-amber-100 text-sm">24/7 visa expert assistance</div>
              </div>
            </div>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              View All Pricing Plans
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-white py-12 px-4">
      {step === 1 && (
        <QuickQuiz 
          answers={answers}
          updateAnswer={updateAnswer}
          isLoading={isLoading}
          getRealAIMatches={getRealAIMatches}
        />
      )}
      {step === 2 && <TeaserResults />}
    </div>
  );
}