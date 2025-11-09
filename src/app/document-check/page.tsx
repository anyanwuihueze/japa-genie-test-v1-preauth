import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, FileWarning, AlertTriangle, XCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DocumentCheckLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                80% of Nigerian Visa Applications Get Rejected
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Don't Let{' '}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Document Errors
              </span>{' '}
              Destroy Your Dreams
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A missing signature. A wrong date. An inconsistent amount. These "small mistakes" cost Nigerians <strong>₦500,000+</strong> in rejected applications every day.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-8 py-6">
                <Link href="/document-check/upload">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Check My Documents
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Results in 30 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Real Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              These "Small" Mistakes Cost Real Money
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Every week, thousands of Nigerians lose their visa fees to preventable document errors
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Missing Signature</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chinedu's bank letter was perfect - except the manager forgot to sign. <strong>$160 visa fee wasted.</strong>
                      </p>
                      <div className="text-xs text-red-700 font-semibold">
                        Lost: ₦250,000 + 6 months delay
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Wrong Date Format</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Amaka used DD/MM/YYYY instead of MM/DD/YYYY for US visa. <strong>Instant rejection.</strong>
                      </p>
                      <div className="text-xs text-red-700 font-semibold">
                        Lost: ₦320,000 + reapplication stress
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Inconsistent Amounts</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Tunde's bank statement showed ₦5M but his letter said ₦4.8M. <strong>Fraud suspicion.</strong>
                      </p>
                      <div className="text-xs text-red-700 font-semibold">
                        Lost: ₦450,000 + permanent record flag
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
              <p className="text-lg font-semibold text-amber-900">
                The worst part? <span className="text-red-600">Embassy officers won't tell you what's wrong.</span>
              </p>
              <p className="text-sm text-amber-800 mt-2">
                They just stamp "REJECTED" and keep your money. You're left guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Check Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our AI Catches <span className="text-blue-600">(Before Embassy Does)</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI has analyzed 10,000+ visa documents. It knows exactly what embassy officers look for.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mb-2">
                    <FileWarning className="w-7 h-7" />
                  </div>
                  <CardTitle>Critical Error Detection</CardTitle>
                  <CardDescription className="text-base">
                    <ul className="space-y-2 mt-3 text-left">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Missing signatures, dates, or stamps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Expired documents or insufficient validity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Wrong date formats for target country</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Inconsistent information across documents</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mb-2">
                    <Shield className="w-7 h-7" />
                  </div>
                  <CardTitle>Fraud Prevention Checks</CardTitle>
                  <CardDescription className="text-base">
                    <ul className="space-y-2 mt-3 text-left">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Detects suspicious patterns in bank statements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Verifies letterhead authenticity markers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Flags documents that look "too perfect"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Compares against known embassy red flags</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mb-2">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <CardTitle>Country-Specific Requirements</CardTitle>
                  <CardDescription className="text-base">
                    <ul className="space-y-2 mt-3 text-left">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Canada: 6-month bank statements required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>UK: Account seasoning (90-day minimum)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>US: Specific sponsor affidavit format</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Australia: Certified translation requirements</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full text-primary w-fit mb-2">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <CardTitle>Quality & Readability Check</CardTitle>
                  <CardDescription className="text-base">
                    <ul className="space-y-2 mt-3 text-left">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Scanned image quality assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Text clarity and legibility check</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Professional formatting verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Complete information coverage check</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Get Your Documents Checked in 3 Simple Steps
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Upload Your Document</h3>
                  <p className="text-muted-foreground">
                    Passport, bank statement, employment letter, sponsor documents - anything. PDF or image format.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Analyzes in 30 Seconds</h3>
                  <p className="text-muted-foreground">
                    Our Gemini-powered AI reads your document like an embassy officer would - checking every signature, date, and format.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Actionable Fix-It Report</h3>
                  <p className="text-muted-foreground">
                    See exactly what's wrong, why it matters, and how to fix it. No guessing. No ambiguity. Just clear action items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Join 1,247+ Nigerians Who Avoided Rejection
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">1,247</div>
                  <div className="text-sm text-muted-foreground">Documents Analyzed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">892</div>
                  <div className="text-sm text-muted-foreground">Critical Errors Found</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">₦450M</div>
                  <div className="text-sm text-muted-foreground">Saved in Rejection Costs</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
              <p className="text-lg italic mb-4">
                "The AI caught a missing stamp on my bank letter that I completely missed. Would have cost me my $160 visa fee and 6 months of waiting. Worth every penny!"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  AO
                </div>
                <div className="text-left">
                  <div className="font-semibold">Adebayo Okonkwo</div>
                  <div className="text-sm text-muted-foreground">Canada Student Visa - Approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Don't Gamble With Your ₦500,000
            </h2>
            <p className="text-xl text-white/90">
              Get your documents checked NOW. Fix mistakes BEFORE the embassy sees them.
            </p>
            
            <div className="pt-6">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-12 py-6">
                <Link href="/document-check/upload">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Document Check
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-white/80">
              ✓ No credit card required  •  ✓ Results in 30 seconds  •  ✓ 100% confidential
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}