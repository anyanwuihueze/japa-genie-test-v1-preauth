
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { oneTimeCredits, subscriptionTiers } from '@/lib/pricing'; // Import from the new unified file

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden bg-genie-pattern">
      <div className="container px-4 py-12 md:py-20">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Find the Plan That's Right for You
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Start with 3 free wishes. No credit card required.
          </p>
        </header>

        <Tabs defaultValue="subscriptions" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="subscriptions">Monthly</TabsTrigger>
              <TabsTrigger value="credits">One-Time</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="subscriptions" className="mt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 max-w-3xl mx-auto justify-center">
              {subscriptionTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {oneTimeCredits.map((plan) => (
                <Card key={plan.name} className="flex flex-col h-full">
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
