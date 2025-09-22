
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProofOfFundsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">
          Master Your Proof of Funds
        </h1>
        <p className="text-lg text-muted-foreground">
          Your financial documents are critical. We provide trusted, embassy-compliant strategies to present your funds, ensuring your application is seen as low-risk and credible.
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Banknote className="w-7 h-7" />
                </div>
                <div>
                    <CardTitle>Structuring Your Funds</CardTitle>
                    <CardDescription>Learn how to properly season funds and document large transactions to avoid suspicion.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                    <CardTitle>Verifiable Statements</CardTitle>
                    <CardDescription>We guide you on obtaining bank statements and letters that meet strict embassy standards for verification.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                    <CardTitle>Sponsorship & Gifts</CardTitle>
                    <CardDescription>Correctly document financial support from family or sponsors with legally sound gift deeds and affidavits.</CardDescription>
                </div>
            </div>
          </CardHeader>
        </Card>
      </div>

       <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
            </div>
            <CardTitle>Confused About Your Financials?</CardTitle>
            <CardDescription className="max-w-xl mx-auto mb-4">
                Our AI assistant can analyze your specific situation and provide a personalized financial documentation strategy.
            </CardDescription>
            <Button asChild>
                <Link href="/chat">Ask Japa Genie</Link>
            </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
