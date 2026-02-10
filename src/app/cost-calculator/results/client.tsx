'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, CheckCircle, TrendingUp, Sparkles, Loader2, 
  Lock, Mail, Gift, Zap, Eye, EyeOff, Plane, Shield, Wallet,
  FileText, Calendar, AlertCircle, DollarSign, Download, Copy,
  ChevronDown, ChevronUp, AlertTriangle, CheckSquare, Clock,
  MapPin, Users, PiggyBank, Receipt, PlaneTakeoff, HeartPulse,
  Briefcase, GraduationCap, Camera, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

interface CostData {
  totalCost: number;
  totalCostLocal: number;
  localCurrency: string;
  hiddenCostsTotal: number;
  visibleCostsTotal: number;
  pofRequirement: {
    amount: number;
    currency: string;
    seasoningPeriod: number;
    deadline: string;
    accountType: string;
    monthlySavingsNeeded: number;
  };
  flightEstimate: {
    economy: number;
    business: number;
    currency: string;
    route: string;
  };
  insuranceEstimate: {
    health: number;
    travel: number;
    currency: string;
    duration: string;
  };
  aiAnalysis: {
    shockingFact: string;
    criticalInsight: string;
    urgencyFactor: string;
    savingsTimeline: string;
    optimizationTips: string[];
  };
  breakdown: Array<{
    category: string;
    item: string;
    cost: number;
    currency: string;
    frequency: string;
    isHidden: boolean;
    description: string;
    deadline?: string;
  }>;
  visaSpecificRequirements: string[];
  timeline: {
    startBy: string;
    pofDeadline: string;
    applicationDeadline: string;
    estimatedDecision: string;
  };
}

interface CalculatorData {
  originCountry: string;
  destinationCountry: string;
  visaType: string;
  dependents: string;
  costData: CostData;
  timestamp: string;
}

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

export default function CostResultsClient() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnlocked = searchParams?.get('unlocked') === 'true';
  
  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailGate, setShowEmailGate] = useState(!isUnlocked);
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Visa Fees']);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '', name: '', phone: '' },
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem('costCalculatorResults');
    const emailProvided = sessionStorage.getItem('cost_email_provided');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        
        if (emailProvided === 'true' || isUnlocked) {
          setShowEmailGate(false);
          setUnlocked(true);
        }
      } catch (error) {
        console.error('Failed to parse cost data:', error);
        toast({
          variant: 'destructive',
          title: 'Data Error',
          description: 'Could not load your cost analysis'
        });
        router.push('/cost-calculator');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'No Analysis Found',
        description: 'Please complete the cost calculator first'
      });
      router.push('/cost-calculator');
    }
    setLoading(false);
  }, [toast, router, isUnlocked]);

  async function handleEmailSubmit(values: z.infer<typeof emailSchema>) {
    setEmailSubmitting(true);
    
    try {
      const response = await fetch('/api/leads/cost-calculator', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...values, 
          originCountry: data?.originCountry,
          destinationCountry: data?.destinationCountry,
          visaType: data?.visaType,
          dependents: data?.dependents,
          costData: data?.costData
        }) 
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      sessionStorage.setItem('cost_email_provided', 'true');
      sessionStorage.setItem('user_email', values.email);
      sessionStorage.setItem('user_name', values.name);
      sessionStorage.setItem('user_phone', values.phone);
      
      setShowEmailGate(false);
      setUnlocked(true);
      
      toast({
        title: 'Full Report Unlocked!',
        description: 'Check your email for your complete cost breakdown',
        duration: 5000,
      });
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to unlock report. Please try again.'
      });
    } finally {
      setEmailSubmitting(false);
    }
  }

  const copyFullReport = () => {
    if (!data) return;
    const reportText = generateReportText(data);
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    toast({ title: 'Report Copied!', description: 'Full analysis copied to clipboard' });
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Visa Fees': return <FileText className="w-5 h-5" />;
      case 'Proof of Funds': return <Wallet className="w-5 h-5" />;
      case 'Insurance': return <HeartPulse className="w-5 h-5" />;
      case 'Travel': return <Plane className="w-5 h-5" />;
      case 'Documents': return <Receipt className="w-5 h-5" />;
      case 'Settlement': return <Home className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Visa Fees': return 'bg-blue-500';
      case 'Proof of Funds': return 'bg-purple-500';
      case 'Insurance': return 'bg-green-500';
      case 'Travel': return 'bg-cyan-500';
      case 'Documents': return 'bg-yellow-500';
      case 'Settlement': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Sparkles className="w-20 h-20 text-orange-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Loading Your Cost Analysis...</h2>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { costData } = data;

  // Group breakdown by category
  const groupedBreakdown = (costData.breakdown || []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof costData.breakdown>);

  const hiddenCosts = costData.breakdown.filter(item => item.isHidden);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">

        {/* 50% PREVIEW - ALWAYS SHOWN */}
        <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-900/20 via-slate-800 to-red-900/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-orange-400" />
              <div>
                <CardTitle className="text-3xl text-white">Your {data.destinationCountry} {data.visaType} Visa Cost Analysis</CardTitle>
                <CardDescription className="text-orange-200">AI-powered breakdown from {data.originCountry}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Cost Teaser */}
            <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-xl p-6 text-center">
              <p className="text-slate-300 mb-2">Complete Relocation Cost</p>
              <p className="text-5xl font-bold text-orange-400">{formatCurrency(costData.totalCost)}</p>
              <p className="text-sm text-slate-400 mt-2">{formatCurrency(costData.totalCostLocal, costData.localCurrency)} {costData.localCurrency}</p>
            </div>

            {/* Shocking Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{formatCurrency(costData.hiddenCostsTotal)}</p>
                <p className="text-xs text-slate-400">Hidden Costs</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">{costData.breakdown.length}</p>
                <p className="text-xs text-slate-400">Cost Items</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{costData.pofRequirement.seasoningPeriod}mo</p>
                <p className="text-xs text-slate-400">POF Seasoning</p>
              </div>
            </div>

            {/* AI Insight Preview */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-yellow-300 mb-2">🚨 Critical Insight</p>
                  <p className="text-slate-200">{costData.aiAnalysis.shockingFact}</p>
                </div>
              </div>
            </div>

            {/* POF Requirement Preview */}
            <Card className="border border-purple-500/30 bg-purple-900/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-purple-400" />
                  Proof of Funds Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Amount Required</p>
                    <p className="text-2xl font-bold text-purple-400">{formatCurrency(costData.pofRequirement.amount, costData.pofRequirement.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Monthly Savings</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(costData.pofRequirement.monthlySavingsNeeded)}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-200">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Deadline: {formatDate(costData.pofRequirement.deadline)} • {costData.pofRequirement.seasoningPeriod} months seasoning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Top 3 Hidden Costs */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Top 3 Hidden Costs You're Missing
              </h3>
              <div className="space-y-3">
                {hiddenCosts.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.item}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-red-400 ml-4">{formatCurrency(item.cost)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-slate-300">+ {costData.breakdown.length - 3} more cost items below 👇</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EMAIL GATE */}
        {showEmailGate && (
          <Card className="border-4 border-purple-500/50 bg-gradient-to-br from-purple-900/30 via-slate-800 to-pink-900/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="inline-block mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl text-white">Unlock Your Complete Budget</CardTitle>
              <CardDescription className="text-lg text-slate-300">
                Get instant access to your full cost breakdown including:
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Complete {costData.breakdown.length}-Item Breakdown</p>
                    <p className="text-sm text-slate-400">Every cost item with deadlines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <PiggyBank className="w-6 h-6 text-pink-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Monthly Savings Plan</p>
                    <p className="text-sm text-slate-400">Exact amounts to save each month</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <Clock className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">POF Timeline Tracker</p>
                    <p className="text-sm text-slate-400">Never miss a seasoning deadline</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Money-Saving Tips</p>
                    <p className="text-sm text-slate-400">Save up to $2,000 on your journey</p>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-white">Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Amara Okonkwo" 
                              className="h-12 bg-slate-700 border-slate-600 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-white">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="your.email@example.com" 
                              className="h-12 bg-slate-700 border-slate-600 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-white">
                            Phone Number (WhatsApp)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="+234 XXX XXX XXXX" 
                              className="h-12 bg-slate-700 border-slate-600 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-slate-500 mt-1">
                            Get POF deadline reminders via WhatsApp
                          </p>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      disabled={emailSubmitting}
                    >
                      {emailSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Unlocking Full Report...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-5 w-5" />
                          Unlock My Complete Budget
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                      We respect your privacy. No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Cost Breakdown - Only when unlocked */}
        {unlocked && (
          <>
            <Card className="border-2 border-slate-700 bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-8 h-8 text-blue-400" />
                    <div>
                      <CardTitle className="text-2xl text-white">Complete Cost Breakdown</CardTitle>
                      <CardDescription className="text-slate-400">
                        {costData.breakdown.length} cost items across {Object.keys(groupedBreakdown).length} categories
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={copyFullReport}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {copiedReport ? (
                      <><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy Report</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(groupedBreakdown).map(([category, items]) => {
                  const categoryTotal = items.reduce((sum, item) => sum + item.cost, 0);
                  const isExpanded = expandedCategories.includes(category);
                  
                  return (
                    <div key={category} className="border border-slate-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                            {getCategoryIcon(category)}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white">{category}</p>
                            <p className="text-sm text-slate-400">{items.length} items</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-white">{formatCurrency(categoryTotal)}</span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="divide-y divide-slate-700">
                          {items.map((item, idx) => (
                            <div key={idx} className={`p-4 flex items-start justify-between ${item.isHidden ? 'bg-red-900/10' : 'bg-slate-800/30'}`}>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-white">{item.item}</p>
                                  {item.isHidden && (
                                    <Badge className="bg-red-500/20 text-red-300 text-xs">HIDDEN COST</Badge>
                                  )}
                                  {item.frequency !== 'one-time' && (
                                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">{item.frequency}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                                {item.deadline && (
                                  <p className="text-sm text-orange-400 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Due: {formatDate(item.deadline)}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-white ml-4">
                                {formatCurrency(item.cost)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Grand Total */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
                  <div>
                    <p className="text-lg font-semibold text-white">Total Estimated Cost</p>
                    <p className="text-sm text-slate-400">Including all fees, POF, insurance and travel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-400">{formatCurrency(costData.totalCost)}</p>
                    <p className="text-sm text-slate-400">
                      {formatCurrency(costData.totalCostLocal, costData.localCurrency)} {costData.localCurrency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight and Insurance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-cyan-500/30 bg-cyan-900/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <PlaneTakeoff className="w-8 h-8 text-cyan-400" />
                    <div>
                      <CardTitle className="text-xl text-white">Flight Estimate</CardTitle>
                      <CardDescription className="text-cyan-200">{costData.flightEstimate.route}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Economy Class</p>
                      <p className="text-sm text-slate-400">Standard baggage included</p>
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">
                      {formatCurrency(costData.flightEstimate.economy)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Business Class</p>
                      <p className="text-sm text-slate-400">Priority boarding and extra baggage</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-400">
                      {formatCurrency(costData.flightEstimate.business)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/30 bg-green-900/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-green-400" />
                    <div>
                      <CardTitle className="text-xl text-white">Insurance Estimate</CardTitle>
                      <CardDescription className="text-green-200">{costData.insuranceEstimate.duration} coverage</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Health Insurance</p>
                      <p className="text-sm text-slate-400">Mandatory for visa approval</p>
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                      {formatCurrency(costData.insuranceEstimate.health)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Travel Insurance</p>
                      <p className="text-sm text-slate-400">Trip cancellation and baggage</p>
                    </div>
                    <span className="text-2xl font-bold text-yellow-400">
                      {formatCurrency(costData.insuranceEstimate.travel)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Optimization Tips */}
            <Card className="border-2 border-yellow-500/30 bg-yellow-900/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">AI Money-Saving Tips</CardTitle>
                    <CardDescription className="text-yellow-200">
                      Save up to $2,000 on your visa journey
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {costData.aiAnalysis.optimizationTips.map((tip, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-yellow-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-400 font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-slate-200">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visa-Specific Requirements */}
            <Card className="border-2 border-blue-500/30 bg-blue-900/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">{data.visaType} Visa Requirements</CardTitle>
                    <CardDescription className="text-blue-200">
                      Specific to {data.destinationCountry} {data.visaType.toLowerCase()} visa
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costData.visaSpecificRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-200">{req}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                <div className="mb-4 inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Track Your Progress</h3>
                <p className="text-slate-300 mb-6">
                  Save this cost calculation to your dashboard and track your savings progress
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer"
                onClick={() => router.push('/eligibility-check')}
              >
                <div className="mb-4 inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Check Eligibility</h3>
                <p className="text-slate-300 mb-6">
                  Now check if you qualify for the {data.visaType} visa with AI analysis
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  Check Eligibility
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </div>

            {/* WhatsApp Support */}
            <WhatsAppButtons destinationCountry={data.destinationCountry} />
          </>
        )}
      </div>
    </div>
  );
}

function generateReportText(data: CalculatorData): string {
  const { costData, originCountry, destinationCountry, visaType } = data;
  
  return `
JAPA GENIE AI VISA COST ANALYSIS REPORT

JOURNEY DETAILS
From: ${originCountry}
To: ${destinationCountry}
Visa Type: ${visaType} Visa
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TOTAL COST BREAKDOWN
Total Estimated Cost: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.totalCost)}
Visible Costs: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.visibleCostsTotal)}
Hidden Costs: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.hiddenCostsTotal)}

PROOF OF FUNDS REQUIREMENT
Amount Required: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: costData.pofRequirement.currency }).format(costData.pofRequirement.amount)} ${costData.pofRequirement.currency}
Account Type: ${costData.pofRequirement.accountType}
Seasoning Period: ${costData.pofRequirement.seasoningPeriod} months
Deadline: ${new Date(costData.pofRequirement.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Monthly Savings Needed: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.pofRequirement.monthlySavingsNeeded)}

FLIGHT ESTIMATE
Route: ${costData.flightEstimate.route}
Economy: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.flightEstimate.economy)}
Business: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.flightEstimate.business)}

INSURANCE ESTIMATE
Health Insurance: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.insuranceEstimate.health)}
Travel Insurance: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costData.insuranceEstimate.travel)}
Duration: ${costData.insuranceEstimate.duration}

COMPLETE COST ITEMIZATION
${costData.breakdown.map((item, i) => `${i + 1}. [${item.category}] ${item.item} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.cost)}${item.isHidden ? ' (HIDDEN)' : ''}`).join('\n')}

CRITICAL TIMELINE
Start By: ${new Date(costData.timeline.startBy).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
POF Deadline: ${new Date(costData.pofRequirement.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Application Deadline: ${new Date(costData.timeline.applicationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Estimated Decision: ${new Date(costData.timeline.estimatedDecision).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

AI RECOMMENDATIONS
${costData.aiAnalysis.optimizationTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

Generated by Japa Genie AI
Get your visa approved: japagenie.com
  `.trim();
}

function WhatsAppButtons({ destinationCountry }: { destinationCountry: string }) {
  const whatsappLinks: Record<string, string> = {
    'Nigeria': 'https://wa.me/2349031622709?text=Hi%20Japa%20Genie,%20I%20need%20help%20with%20my%20visa%20application',
    'Canada': 'https://wa.me/12042901895?text=Hi%20Japa%20Genie,%20I%20need%20help%20with%20my%20Canada%20visa',
    'default': 'https://wa.me/2349031622709?text=Hi%20Japa%20Genie,%20I%20need%20help%20with%20my%20visa%20application'
  };

  const link = whatsappLinks[destinationCountry] || whatsappLinks.default;

  return (
    <Card className="border-2 border-green-500/30 bg-green-900/20 mt-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500 rounded-full">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div>
            <CardTitle className="text-xl text-white">Need Help? Chat on WhatsApp</CardTitle>
            <CardDescription className="text-green-200">
              Get instant answers from our visa experts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Chat with Japa Genie on WhatsApp
        </a>
        <p className="text-center text-sm text-slate-400 mt-3">
          Typical response time: Under 5 minutes
        </p>
      </CardContent>
    </Card>
  );
}
