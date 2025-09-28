import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function KwameStory() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <a href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Japa News
            </a>
          </Button>
        </div>
        
        <article className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Impossible Dream: From Teacher to UK Global Talent</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <span>Math Teacher from Rural Ghana</span>
            <span>•</span>
            <span>Now in London, UK</span>
            <span>•</span>
            <span>£65,000 salary</span>
          </div>

          <div className="prose max-w-none mb-8">
            <blockquote className="text-xl font-semibold text-primary border-l-4 border-primary pl-6 mb-6">
              "Everyone said teachers can't get UK Global Talent visas. I proved them wrong."
            </blockquote>

            <p className="text-lg mb-4">
              Kwame Asante taught mathematics in rural Ghana for 8 years, earning just $200 monthly. His dream of reaching the UK seemed impossible - he wasn't a tech entrepreneur or acclaimed researcher. Immigration lawyers laughed when he mentioned the Global Talent visa.
            </p>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Hidden Potential</h3>
            <p>
              But Kwame had been developing innovative math education apps in his spare time, used by over 10,000 African students. He just didn't know how to package his achievements for visa success.
            </p>

            <h3 className="text-2xl font-bold mt-6 mb-4">The AI Discovery</h3>
            <p>
              Japa Genie's AI analyzed Kwame's background and identified something remarkable: his educational technology work qualified for the "Digital Technology" category of the Global Talent visa. The AI guided him to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Document his app's impact with user testimonials and download statistics</li>
              <li>Get endorsements from education technology leaders</li>
              <li>Present his work as scalable innovation, not just teaching</li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Strategic Pivot</h3>
            <p>
              Instead of applying as a teacher (impossible for Global Talent), Kwame repositioned himself as an EdTech innovator. His apps had:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>50,000+ downloads across 12 African countries</li>
              <li>Testimonials from students who improved grades by 40%</li>
              <li>Recognition from UNESCO for innovative education solutions</li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Breakthrough</h3>
            <p>
              Six months later: <strong>Global Talent visa APPROVED.</strong>
            </p>
            <p>
              Kwame now leads educational technology initiatives at a London-based EdTech company, earning £65,000. His apps have reached over 100,000 students across Africa.
            </p>

            <blockquote className="text-lg font-medium text-gray-700 border-l-4 border-primary pl-6 mt-6">
              "I was selling myself short. Japa Genie's AI helped me see my true value and present it properly. Now I'm building the future of African education from London."
            </blockquote>
          </div>

          <div className="border-t pt-8 mt-8 text-center">
            <h3 className="text-xl font-bold mb-4">What Hidden Talents Do You Have?</h3>
            <p className="text-gray-600 mb-6">
              Like Kwame, you might be closer to your visa goal than you think. Let Japa Genie's AI analyze your unique profile and find your pathway.
            </p>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/chat">Discover Your Potential</a>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
