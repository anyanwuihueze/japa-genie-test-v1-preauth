import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HowItHelpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Japa Genie Helps You
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From document preparation to interview coaching, we've got every step covered.
          </p>
        </div>

        {/* Proof of Funds Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Proof of Funds Guidance</h2>
                <p className="text-green-100">
                  Get expert review of your financial documents to ensure they meet embassy requirements.
                </p>
              </div>
              <div className="md:w-1/3">
                <Button asChild className="mobile-btn-fix bg-white text-green-600 hover:bg-green-50 w-full md:w-auto">
                  <Link href="/public-proof-of-funds">
                    <span className="hidden sm:inline">Get Funds Review</span>
                    <span className="sm:hidden">Funds Review</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Coaching Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">1:1 Expert Coaching</h2>
                <p className="text-purple-100">
                  Book personalized sessions with immigration experts for complex cases.
                </p>
              </div>
              <div className="md:w-1/3">
                <Button asChild className="mobile-btn-fix bg-white text-purple-600 hover:bg-purple-50 w-full md:w-auto">
                  <Link href="/experts">
                    <span className="hidden sm:inline">Book Coach Session</span>
                    <span className="sm:hidden">Book Session</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Connect with Experts Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl border shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Connect with Verified Experts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Document Specialists</h3>
                <p className="text-gray-600 mb-4">
                  Get your documents reviewed by professionals who know embassy requirements.
                </p>
                <Button asChild variant="outline" className="mobile-btn-fix w-full">
                  <Link href="/verified-agents">Find Specialists</Link>
                </Button>
              </div>
              <div className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Immigration Lawyers</h3>
                <p className="text-gray-600 mb-4">
                  Legal experts for complex cases, appeals, and legal consultations.
                </p>
                <Button asChild className="mobile-btn-fix w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Link href="/talk-to-someone">
                    <span className="hidden sm:inline">Connect with Expert</span>
                    <span className="sm:hidden">Expert Help</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More Ways We Can Help
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="mobile-btn-fix h-auto py-4">
              <Link href="/visa-matchmaker">Visa Matchmaker</Link>
            </Button>
            <Button asChild variant="outline" className="mobile-btn-fix h-auto py-4">
              <Link href="/document-check">Document Check</Link>
            </Button>
            <Button asChild variant="outline" className="mobile-btn-fix h-auto py-4">
              <Link href="/interview">Mock Interview</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
