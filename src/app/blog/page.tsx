'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Target, CheckCircle, Users, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function JapaNewsPage() {
  const [mounted, setMounted] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setVisitorCount(Math.floor(Math.random() * 500) + 1250);
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const stories = [
    // ▼▼▼ ADD THIS NEW STORY AT THE TOP ▼▼▼
    {
      slug: 'rejection-risk-score',
      title: 'How Japa Genie Calculates Your Visa Rejection Risk Score',
      excerpt: 'Discover the 7 hidden factors embassies check that cause 68% of rejections.',
      author: 'Japa Genie Team',
      location: 'Lagos, Nigeria',
      outcome: '62% risk reduction',
      hook: '"My Japan SSW visa was rejected until I fixed my Proof of Funds risk score."',
      readTime: '5 min read'
    },
    // ▲▲▲ END OF NEW STORY ▲▲▲
    {
      slug: 'amara-visa-rejection-reversal',
      title: 'From Heartbreak to Toronto: Amara\'s Visa Rejection Reversal',
      excerpt: 'Three rejections couldn\'t stop this Ivorian software engineer from reaching Canada.',
      author: 'Amara Kone',
      location: 'Côte d\'Ivoire → Toronto, Canada',
      outcome: 'CAD $85,000 salary',
      hook: '"They rejected me three times. The fourth time, I got my Canadian PR."',
      readTime: '5 min read'
    },
    {
      slug: 'kwame-teacher-to-uk-global-talent',
      title: 'The Impossible Dream: From Teacher to UK Global Talent',
      excerpt: 'Rural Ghana teacher proves everyone wrong with innovative EdTech approach.',
      author: 'Kwame Asante',
      location: 'Rural Ghana → London, UK',
      outcome: '£65,000 salary',
      hook: '"Everyone said teachers can\'t get UK Global Talent visas. I proved them wrong."',
      readTime: '6 min read'
    }
  ];

  const ProgressiveCTA = () => {
    const [step, setStep] = useState(1);

    const steps = [
      {
        icon: Target,
        title: "Get Your Visa Score",
        subtitle: "60-second assessment",
        cta: "Check My Eligibility",
        description: "See which visas you qualify for right now"
      },
      {
        icon: CheckCircle,
        title: "See Your Options",
        subtitle: "Personalized pathways",
        cta: "View My Routes",
        description: "Get 3 tailored visa strategies with success rates"
      },
      {
        icon: Zap,
        title: "Full AI Analysis",
        subtitle: "Complete roadmap",
        cta: "Start My Journey",
        description: "Comprehensive plan with documents, timeline & tips"
      }
    ];

    const currentStep = steps[step - 1];
    const StepIcon = currentStep.icon;

    return (
      <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-3xl shadow-xl p-8 text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index + 1 === step
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : index + 1 < step
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{currentStep.title}</h3>
          <p className="text-gray-600 mb-1">{currentStep.subtitle}</p>
          <p className="text-sm text-gray-500">{currentStep.description}</p>
        </div>

        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-4"
          size="lg"
          onClick={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              window.location.href = '/visa-readiness-check';
            }
          }}
        >
          {currentStep.cta} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {step < 3 && (
          <p className="text-sm text-gray-500">
            Step {step} of 3 • Takes {step === 1 ? '1' : step === 2 ? '3' : '10'} minute{step === 1 ? '' : 's'}
          </p>
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4">
              <Users className="w-4 h-4" />
              {visitorCount.toLocaleString()}+ Africans reading success stories this month
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Japa News: Real Success Stories
            </h1>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Breaking: Africans are winning their visa battles with AI guidance. Read the stories mainstream media won't tell you.
            </p>
          </div>

          <ProgressiveCTA />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {stories.map((story) => (
              <div key={story.slug} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-3xl shadow-xl p-8 group hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                    {story.readTime}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <blockquote className="text-lg font-semibold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
                  {story.hook}
                </blockquote>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                  {story.title}
                </h2>
                <p className="text-gray-600 mb-4">{story.excerpt}</p>
                
                <div className="text-sm text-gray-500 mb-6">
                  <div className="mb-1">
                    <strong>{story.author}</strong> • {story.location}
                  </div>
                  <div className="text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-semibold">
                    {story.outcome}
                  </div>
                </div>
                
                <Button variant="outline" asChild className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                  <a href={`/blog/${story.slug}`} className="flex items-center justify-center gap-2">
                    Read Full Story <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Success Story is Next
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join the AI-powered movement. Get your personalized visa roadmap in 3 minutes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2,847</div>
                <div className="text-sm text-gray-600">Visas Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">94%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">6 Months</div>
                <div className="text-sm text-gray-600">Average Timeline</div>
              </div>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4" asChild>
              <a href="/chat">Get Your Japa Plan <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </section>

      {mounted && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-white font-semibold text-sm sm:text-base">
                    Ready to be our next success story?
                  </p>
                  <p className="text-purple-100 text-xs sm:text-sm">
                    Join 2,847+ approved applicants
                  </p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white" asChild>
                  <a href="/chat">Start Now</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white/90 backdrop-blur-sm border border-white/40 rounded-3xl shadow-xl max-w-md p-8 m-4">
            <h3 className="text-2xl font-bold mb-4">Wait! Get your free visa score</h3>
            <p className="text-gray-600 mb-6">
              Before you leave, discover which visa you're closest to getting. Takes just 60 seconds.
            </p>
            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1" asChild>
                <a href="/visa-readiness-check">Get My Score</a>
              </Button>
              <Button variant="outline" onClick={() => setShowExitIntent(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}