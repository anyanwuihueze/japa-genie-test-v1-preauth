// src/app/visa-matchmaker/page.tsx - REAL AI VERSION
'use client';
import { useState, useCallback } from 'react';
import { Crown, Sparkles, CheckCircle, Loader2, X, Lock } from 'lucide-react';

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
    const visibleMatches = isPremium ? aiResults?.topMatches : aiResults?.topMatches?.slice(0, 2);
    const hiddenMatchesCount = aiResults?.topMatches?.length - (visibleMatches?.length || 0);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">AI Analysis Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Your Visa Matches
          </h1>
        </div>

        <div className="space-y-6">
          {visibleMatches?.map((match: any, index: number) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{match.country}</h3>
                  <p className="text-gray-600">{match.visaType}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-500">{match.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match Score</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">✅ Requirements</h4>
                  <ul className="space-y-2">
                    {match.requirements.mustHave.map((req: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">💪 Strengths</h4>
                  <ul className="space-y-2">
                    {match.strengths.map((strength: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">⚠️ Important Notes</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {match.redFlags.map((flag: string, i: number) => (
                    <li key={i}>• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {!isPremium && hiddenMatchesCount > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-center text-white">
            <Lock className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">🔒 Unlock {hiddenMatchesCount} More Premium Matches</h3>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Upgrade to See All Matches
            </button>
          </div>
        )}

        {!isPremium && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 text-center text-white">
            <Crown className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Unlock Full Analysis</h3>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-amber-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Upgrade to Premium - $49/month
            </button>
          </div>
        )}
      </div>
    );
  };

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upgrade to Premium</h3>
          <button onClick={() => setShowUpgradeModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>All country matches</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Detailed document checklist</span>
          </div>
          <button 
            onClick={() => {
              setIsPremium(true);
              setShowUpgradeModal(false);
            }}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600"
          >
            Upgrade Now - $49/month
          </button>
        </div>
      </div>
    </div>
  );

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
      {showUpgradeModal && <UpgradeModal />}
    </div>
  );
}
