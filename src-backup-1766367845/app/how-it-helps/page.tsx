"use client";  
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HowItHelps() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How Japa Genie Actually Helps You
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Not generic advice — country-specific help that works for Africans.
          </p>
        </div>

        <div className="space-y-16">
          {/* Enhanced Visa Guides Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Visa Interview Guides That Actually Work</h2>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Built from 500+ success stories
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Human Experts Available
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Get embassy-specific interview guides based on your target destination and visa type — 
                  not generic advice that ignores your unique challenges as an African applicant.
                </p>

                {/* Enhanced Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 font-semibold">🎯 Embassy Intelligence</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Actual questions from US Embassy Lagos vs UK Embassy Accra</li>
                        <li>• Interviewer preferences for each consulate</li>
                        <li>• Processing times and approval rates by location</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-600 font-semibold">🗣️ Real Interview Transcripts</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Word-for-word successful conversations</li>
                        <li>• Scripts for tricky "return home" questions</li>
                        <li>• How to explain employment gaps</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 font-semibold">📊 Success Patterns</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• What worked for 200+ student visa approvals</li>
                        <li>• Financial docs that impress officers</li>
                        <li>• Common rejections and how to avoid them</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-600 font-semibold">📋 Country-Specific Secrets</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Canada: Beyond proof of funds (what they want)</li>
                        <li>• UK: Hidden docs that boost approval 40%</li>
                        <li>• Australia: Present home ties effectively</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Success Stories */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Success Stories with Proof:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 italic">
                      "I was rejected twice before finding Japa Genie. Their guide showed me exactly what the visa officer was looking for. Third time was the charm!" — <strong>Sarah, Software Engineer, now in Toronto</strong>
                    </p>
                    <p className="text-gray-700 italic">
                      "The embassy-specific tips were gold. They told me Lagos consulate prioritizes different things than Abuja. Got approved in 2 weeks." — <strong>Emeka, Graduate Student, now in Manchester</strong>
                    </p>
                  </div>
                </div>

                {/* Human Expert CTA */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold">Need Personalized Help?</span>
                      </div>
                      <p className="text-sm opacity-90">Get 1-on-1 coaching with our verified visa experts</p>
                    </div>
                    <Button asChild className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                      <Link href="/experts">
                        Connect with Expert
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Proof of Funds Planning Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-green-100 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Proof of Funds Planning That Gets Approved</h2>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Policy-Based Calculations
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Stop guessing how much money you need. We calculate exact amounts based on embassy policies and help you present your funds convincingly.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 font-semibold">💰 Exact Amount Calculations</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Country-specific financial requirements</li>
                        <li>• Tuition + living costs breakdown</li>
                        <li>• Family member calculations</li>
                        <li>• Buffer amounts for safety</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 font-semibold">🏦 Account Seasoning Guide</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• When to deposit funds (critical timeline)</li>
                        <li>• Minimum balance periods</li>
                        <li>• Large deposit explanations</li>
                        <li>• Gift deed documentation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-600 font-semibold">📑 Document Templates</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Bank statement formatting that works</li>
                        <li>• Sponsorship letter templates</li>
                        <li>• Source of funds explanations</li>
                        <li>• Affidavit of support samples</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-600 font-semibold">🎯 Interview Preparation</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• How to explain source of funds</li>
                        <li>• Answering "Where did this money come from?"</li>
                        <li>• Handling business income questions</li>
                        <li>• Family sponsorship explanations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Real Results:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 italic">
                      "Japa Genie told me exactly how much to show for Canada study visa - ₦8.2M. My friend guessed and got rejected for insufficient funds. I got approved!" — <strong>David, Student in Vancouver</strong>
                    </p>
                    <p className="text-gray-700 italic">
                      "The account seasoning guide saved me. I almost deposited the money 2 weeks before application. They showed me I needed 3 months minimum." — <strong>Fatima, now in UK</strong>
                    </p>
                  </div>
                </div>

                {/* FIXED: Proof of Funds CTA with correct link */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-semibold">Complex Financial Situation?</span>
                      </div>
                      <p className="text-sm opacity-90">Our experts help with business income, gifts, sponsorships</p>
                    </div>
                    <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                      <Link href="/public-proof-of-funds">
                        Get Funds Review <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bookings Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-emerald-100 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Real Flight & Hotel Bookings — Zero Risk</h2>
                  <div className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
                    Embassy Approved
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Get legitimate flight and hotel confirmations for your visa application — without the financial risk of full payments.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-emerald-500 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Legitimate bookings</span>
                        <p className="text-sm text-gray-600">Real PNRs that pass embassy verification</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-emerald-500 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Hold & pay system</span>
                        <p className="text-sm text-gray-600">Only pay full price after visa approval</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-emerald-500 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Minimal service fee</span>
                        <p className="text-sm text-gray-600">$15-25 vs. $800+ ticket prices</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-emerald-500 rounded-full p-1 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">24hr delivery</span>
                        <p className="text-sm text-gray-600">Fast turnaround for urgent applications</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic mb-2">
                    "I paid $15 for a real flight booking. When my visa came through, I booked the full ticket myself. No risk, no wasted money." — <strong>Amina, now in Canada</strong>
                  </p>
                  <p className="text-sm text-emerald-700 font-medium">
                    ⚡ Over 2,000 bookings processed • 0 embassy rejections due to our bookings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mock Interviews Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-purple-100 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">AI + Human Mock Interviews</h2>
                  <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                    Confidence Builder
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Expert Coaches
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Practice with AI first, then get expert human feedback. Build confidence before your real interview.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">FREE</span>
                      <span className="font-semibold text-blue-800">AI Practice Mode</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Unlimited AI interview practice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Basic feedback on your answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Common visa questions database</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Confidence scoring system</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-purple-300 bg-purple-50 p-4 rounded-lg relative">
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-medium">PREMIUM</span>
                      <span className="font-semibold text-purple-800">Human Expert Review</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>1-on-1 mock interviews with visa experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Embassy-specific questioning style</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Personalized feedback report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Body language and confidence coaching</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold">Ready for Real Feedback?</span>
                      </div>
                      <p className="text-sm opacity-90">Book a session with our verified interview coaches</p>
                    </div>
                    <Button asChild className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                      <Link href="/experts">
                        Book Coach Session
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic text-sm">
                    "The AI practice got me comfortable, but the human mock interview was game-changing. They caught nervous habits I didn't even know I had." — <strong>Kemi, Student Visa to Germany</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}