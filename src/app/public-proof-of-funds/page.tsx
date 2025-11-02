import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, ShieldCheck, TrendingUp, HelpCircle, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PublicProofOfFunds() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Proof of Funds Made Simple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stop guessing how much money you need. Get exact embassy requirements, track your progress, and present your funds perfectly.
          </p>
          
          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">2,000+ Successful Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Country-Specific Calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Real-Time Progress Tracking</span>
            </div>
          </div>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-green-200 hover:border-green-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <Banknote className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Exact Amount Calculations</CardTitle>
                  <CardDescription>Know exactly how much to show for your target country and visa type.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Account Seasoning Guide</CardTitle>
                  <CardDescription>When to deposit funds and how long to maintain balances.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>Document Templates</CardTitle>
                  <CardDescription>Bank statements, sponsorship letters, and source explanations.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl mb-4">Ready to Master Your Proof of Funds?</CardTitle>
            <CardDescription className="text-white/90 mb-6 max-w-2xl mx-auto">
              Get personalized calculations, progress tracking, and expert guidance. 
              Everything you need to present your funds perfectly to the embassy.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                <Link href="/auth?redirect=/dashboard/proof-of-funds">
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/20">
                <Link href="/chat">
                  Ask AI Assistant First
                </Link>
              </Button>
            </div>
            <p className="text-white/70 text-sm mt-4">
              No credit card required • 7-day free trial
            </p>
          </CardHeader>
        </Card>

        {/* Country Requirements Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Sample Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-bold text-green-600">Canada Student</div>
              <div className="text-lg font-semibold">₦8.2M+</div>
              <div className="text-gray-600">90 days seasoning</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-bold text-blue-600">UK Student</div>
              <div className="text-lg font-semibold">₦6.5M+</div>
              <div className="text-gray-600">90 days seasoning</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-bold text-purple-600">USA F-1</div>
              <div className="text-lg font-semibold">₦12M+</div>
              <div className="text-gray-600">90 days seasoning</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-bold text-orange-600">Australia</div>
              <div className="text-lg font-semibold">₦7.8M+</div>
              <div className="text-gray-600">90 days seasoning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
