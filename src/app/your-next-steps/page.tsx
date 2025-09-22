import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function YourNextSteps() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Visa Journey, Simplified
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with 3 free wishes. Continue with the plan that makes sense for you.
          </p>
        </div>

        {/* 3 Free Wishes Funnel */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-amber-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Start with 3 Free Wishes</h2>
              <p className="text-gray-600 mb-4">
                Ask Japa Genie anything about visas, countries, or documents — no signup needed.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get country-specific visa advice</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Learn about proof of funds requirements</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get flight/hotel booking guidance</span>
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800 font-medium">
                  After 3 wishes, continue your journey with one of these options:
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Self-Starter */}
          <div className="rounded-xl p-6 border bg-white shadow-xl border-blue-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                Most choose this
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-2">Self-Starter</h2>
            <p className="text-gray-600 mb-4">For when you need tools and guidance</p>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-1">$19.99/month</p>
              <p className="text-sm text-gray-500">
                Everything you need to apply confidently
              </p>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited Japa Genie chat</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Country-specific visa guides</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real flight/hotel booking service</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic interview simulations</span>
              </li>
            </ul>

            <Button variant="default" className="w-full" asChild>
              <Link href="/chat">Continue with Self-Starter</Link>
            </Button>
          </div>

          {/* Hold My Hand Premium */}
          <div className="rounded-xl p-6 border bg-white border-gray-100">
            <h2 className="text-xl font-bold mb-2">Hold My Hand Premium</h2>
            <p className="text-gray-600 mb-4">For when you want full support</p>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-1">$200 one-time</p>
              <p className="text-sm text-gray-500">
                Everything in Self-Starter, plus human guidance
              </p>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Everything in Self-Starter</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Visa rejection reversal support</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Human-led mock interviews</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Personal document review</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 priority support</span>
              </li>
            </ul>

            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90" 
              asChild
            >
              <Link href="/chat">Go All-In with Premium</Link>
            </Button>
          </div>

          {/* Free Option */}
          <div className="rounded-xl p-6 border bg-white border-gray-100">
            <h2 className="text-xl font-bold mb-2">Free Wish Starter</h2>
            <p className="text-gray-600 mb-4">Try before you commit</p>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-1">Free forever</p>
              <p className="text-sm text-gray-500">
                See if Japa Genie works for you
              </p>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>3 free questions about visas</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Country-specific guidance</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No signup required</span>
              </li>
            </ul>

            <Button variant="secondary" className="w-full" asChild>
              <Link href="/chat">Start with 3 Free Wishes</Link>
            </Button>
          </div>
        </div>

        {/* Trust Builder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">No pressure, just help</h3>
              <p className="text-gray-600">
                Start with 3 free wishes. Only pay if you find real value in continuing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
