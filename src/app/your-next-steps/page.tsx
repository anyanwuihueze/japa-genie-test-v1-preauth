import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function YourNextSteps() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Visa Journey, Simplified
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with 3 free wishes. Join 5,200+ Africans who got real answers — no scams, no agents, no stress.
          </p>
        </div>

        {/* 3 Free Wishes Funnel */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-5 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10 text-amber-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Start with 3 Free Wishes</h2>
              <p className="text-gray-600 mb-4">
                Ask Japa Genie anything about visas, countries, or documents — no signup needed.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Get country-specific visa advice</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Learn about proof of funds requirements</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Get flight/hotel booking guidance</span>
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800 font-medium">
                  After 3 wishes, top up for more help (no monthly commitment):
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WEEKLY TOP-UP PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* 1 WEEK */}
          <div className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">1 Week Access</h2>
              <p className="text-gray-600 mb-4">Perfect for focused progress</p>
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 mb-1">$9.99</p>
                <p className="text-sm text-gray-500">No auto-renewal • 7-day access</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Unlimited AI chat</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Document checker</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Mock interviews</span>
                </li>
              </ul>
            </div>
            <Button variant="default" className="w-full" asChild>
              <Link href="/subscribe?plan=1-week">Top Up for 1 Week</Link>
            </Button>
          </div>

          {/* 2 WEEKS */}
          <div className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">2 Weeks Access</h2>
              <p className="text-gray-600 mb-4">Great for full application prep</p>
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 mb-1">$14.99</p>
                <p className="text-sm text-gray-500">No auto-renewal • 14-day access</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Everything in 1 week plan</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Prioritized response time</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Visa pathway optimization</span>
                </li>
              </ul>
            </div>
            <Button variant="default" className="w-full" asChild>
              <Link href="/subscribe?plan=2-weeks">Top Up for 2 Weeks</Link>
            </Button>
          </div>

          {/* 3 WEEKS */}
          <div className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">3 Weeks Access</h2>
              <p className="text-gray-600 mb-4">For comprehensive review</p>
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 mb-1">$24.99</p>
                <p className="text-sm text-gray-500">No auto-renewal • 21-day access</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Everything in 2 weeks plan</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Rejection risk score</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personalized pathway plan</span>
                </li>
              </ul>
            </div>
            <Button variant="default" className="w-full" asChild>
              <Link href="/subscribe?plan=3-weeks">Top Up for 3 Weeks</Link>
            </Button>
          </div>
        </div>

        {/* MONTHLY PLANS */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold">Trusted by 5,200+ Africans</h3>
          <p className="text-gray-600">From Lagos to Accra to Nairobi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* PRO PLAN */}
          <div className="relative rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 mt-4">Pro Plan</h2>
              <p className="text-gray-600 mb-4">Continuous access + tools</p>
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 mb-1">$20/month</p>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Everything in weekly plans</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Priority email support</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Monthly updates on new opportunities</span>
                </li>
              </ul>
            </div>
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
              asChild
            >
              <Link href="/subscribe?plan=pro">Continue with Pro Plan</Link>
            </Button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="rounded-xl p-6 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Hold My Hand Premium</h2>
              <p className="text-gray-600 mb-4">Full support + verified experts</p>
              <div className="mb-6">
                <p className="text-2xl font-bold text-purple-600 mb-1">$39.99/month</p>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Everything in Pro Plan</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div className="inline-block relative">
                    <span className="font-medium text-purple-600 underline cursor-pointer hover:text-purple-800 transition-colors duration-200">
                      Verified Agent Consultation
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-max max-w-xs bg-gray-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:block group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                      Book a 30-minute call with a vetted immigration expert. Fees start at $49/session. Pay only when you book.
                    </div>
                  </div>{' '}
                  (separate fee)
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>1-on-1 Onboarding Call</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Weekly progress tracking</span>
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
              asChild
            >
              <Link href="/subscribe?plan=premium">Go All-In with Premium</Link>
            </Button>
          </div>
        </div>

        {/* FREE OPTION */}
        <div className="max-w-md mx-auto mb-16">
          <div className="rounded-xl p-6 border bg-white border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-xl font-bold mb-2">Free Wish Starter</h2>
            <p className="text-gray-600 mb-4">Try before you commit</p>
            <div className="mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-1">Free forever</p>
              <p className="text-sm text-gray-500">No payment, no signup</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>3 free questions about visas</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Country-specific guidance</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>No signup required</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/chat">Start with 3 Free Wishes</Link>
            </Button>
          </div>
        </div>

        {/* TRUST BUILDER + WHATSAPP OPT-IN */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
          <div className="flex items-start space-x-4 justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">No pressure, just help</h3>
              <p className="text-gray-600">
                Start with 3 free wishes. Only pay if you find real value in continuing.
              </p>
            </div>
          </div>

          {/* WhatsApp Opt-In */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Want updates via WhatsApp?</p>
                <p className="text-sm text-gray-600">Get real-time alerts when new visa opportunities open. <strong>No spam.</strong></p>
                <button className="mt-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200">
                  Yes, add my number
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}