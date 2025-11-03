import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, Shield, Clock, MessageCircle, FileText, Plane } from 'lucide-react';
import Link from 'next/link';

const experts = [
  {
    name: "Sarah Chen",
    role: "Canada Study Visa Specialist",
    experience: "8+ years",
    successRate: "94%",
    specialty: "Student Visas, Proof of Funds",
    description: "Former visa officer with deep knowledge of Canadian immigration policies. Helped 500+ African students get approved.",
    features: ["Document Review", "Interview Prep", "Proof of Funds Plan", "Unlimited Q&A"]
  },
  {
    name: "David Okafor",
    role: "UK Work Visa Expert", 
    experience: "12+ years",
    successRate: "91%",
    specialty: "Skilled Worker Visas, Sponsorship",
    description: "UK immigration consultant with track record of helping tech professionals relocate from Nigeria and Ghana.",
    features: ["CV Optimization", "Sponsor Matching", "Application Strategy", "Priority Support"]
  },
  {
    name: "Amina Bello",
    role: "US Visitor Visa Specialist",
    experience: "6+ years",
    successRate: "89%",
    specialty: "B1/B2 Visas, Family Sponsorship",
    description: "Expert in overcoming visa denials and building strong cases for African families visiting the US.",
    features: ["Overcoming Rejection", "Family Applications", "Financial Documentation", "Embassy Prep"]
  }
];

const services = [
  {
    icon: FileText,
    title: "Document Review",
    description: "Get your application documents checked by experts before submission.",
  },
  {
    icon: MessageCircle,
    title: "Mock Interview",
    description: "Practice with former visa officers who know what embassies really look for.",
  },
  {
    icon: Shield,
    title: "Full Application Support",
    description: "End-to-end guidance from document prep to interview readiness.",
  },
  {
    icon: Plane,
    title: "Fast-Track Consultation", 
    description: "Quick answers to urgent questions before your interview or submission.",
  }
];

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Shield className="w-3 h-3 mr-1" />
            Verified Experts
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get Help from Trusted Visa Experts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            When AI isn't enough, connect with our network of verified immigration consultants with proven success helping African applicants.
          </p>
        </div>

        {/* Why Choose Human Experts */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Human Experts?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Proven Track Records</h3>
              <p className="text-sm text-muted-foreground">Our experts have 85%+ success rates with African applicants</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Thoroughly Vetted</h3>
              <p className="text-sm text-muted-foreground">Every expert verified through background checks and client reviews</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Specialized Knowledge</h3>
              <p className="text-sm text-muted-foreground">Country-specific expertise for your target destination</p>
            </div>
          </div>
        </div>

        {/* Featured Experts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Verified Experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl">{expert.name}</CardTitle>
                      <CardDescription>{expert.role}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {expert.successRate} Success
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      {expert.experience} experience
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      {expert.specialty}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{expert.description}</p>
                  <div className="space-y-2 mb-6">
                    {expert.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Premium Feature</Badge>
                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-sm px-3">
                      <Link href="/contact-us">Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-all">
                <CardHeader>
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/your-next-steps">Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Not Sure Which Expert to Choose?</h3>
              <p className="mb-6 opacity-90">
                Let us match you with the perfect expert for your specific situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/contact-us">Get Matched with an Expert</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/contact-us">Speak to Our Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}