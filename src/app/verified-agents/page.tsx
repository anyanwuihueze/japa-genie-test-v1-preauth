import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, MessageSquare } from 'lucide-react';

const agents = [
  {
    name: 'Amina Adebayo',
    avatar: 'AA',
    specialties: ['Canada', 'UK', 'Student Visas'],
    rating: 4.9,
    reviews: 128,
    verified: true,
  },
  {
    name: 'Kwame Osei',
    avatar: 'KO',
    specialties: ['USA', 'Work Permits', 'Tech Visas'],
    rating: 4.8,
    reviews: 94,
    verified: true,
  },
  {
    name: 'Fatou Jallow',
    avatar: 'FJ',
    specialties: ['Schengen Area', 'France', 'Business Visas'],
    rating: 4.9,
    reviews: 76,
    verified: true,
  },
  {
    name: 'Chinedu Eze',
    avatar: 'CE',
    specialties: ['Australia', 'Skilled Migration', 'Family Visas'],
    rating: 4.7,
    reviews: 112,
    verified: true,
  }
];

export default function VerifiedAgentsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Japa Genie Verified Agents</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with trusted, independent immigration consultants who can provide expert guidance for your specific case.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="text-4xl bg-primary/20">{agent.avatar}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{agent.name}</CardTitle>
              {agent.verified && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <Check className="w-4 h-4 mr-1.5" />
                  Verified
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex-grow space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-2 text-center">Specialties</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {agent.specialties.map(spec => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-foreground">{agent.rating}</span>
                    </div>
                    <span>({agent.reviews} reviews)</span>
                </div>
              </div>
              <Button className="w-full mt-6">
                <MessageSquare className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
