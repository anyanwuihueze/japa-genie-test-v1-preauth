import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { oneTimeCredits, subscriptionTiers } from '@/lib/pricing';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container px-4 py-12 md:py-20">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Find the Plan That's Right for You
          </h1>
        </header>

        <div className="space-y-12">
          {/* ONE-TIME CREDITS */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">One-Time Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oneTimeCredits.map((plan) => (
                 <Link href="/your-next-steps" key={plan.name} className="block group">
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                      <p className="text-2xl md:text-3xl font-bold pt-2">${plan.price}</p>
                      <CardDescription className="text-sm md:text-base">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="secondary">
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* SUBSCRIPTIONS */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">Monthly Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {subscriptionTiers.map((tier) => (
                <Link href="/your-next-steps" key={tier.name} className="block group">
                  <Card
                    className={`flex flex-col h-full hover:shadow-lg transition-shadow ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}
                  >
                    {tier.popular && (
                      <div className="py-1 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg text-center">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl md:text-3xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                      <div className="pt-4">
                        <span className="text-3xl md:text-4xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">{tier.frequency}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3 md:space-y-4">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                        {tier.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}