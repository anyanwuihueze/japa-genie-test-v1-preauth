import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AmaraStory() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">From Heartbreak to Toronto: Amara's Visa Rejection Reversal</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <span>Software Engineer from Côte d'Ivoire</span>
            <span>•</span>
            <span>Now in Toronto, Canada</span>
            <span>•</span>
            <span>CAD $85,000 salary</span>
          </div>

          <div className="prose max-w-none mb-8">
            <blockquote className="text-xl font-semibold text-primary border-l-4 border-primary pl-6 mb-6">
              "They rejected me three times. The fourth time, I got my Canadian PR."
            </blockquote>

            <p className="text-lg mb-4">
              Amara Kone faced three devastating visa rejections for Canada Express Entry. Each rejection letter crushed her dreams of joining her sister in Toronto. The immigration consultants she paid $3,000 kept giving generic advice that didn't address her specific weaknesses.
            </p>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Breaking Point</h3>
            <p>
              After the third rejection, Amara was ready to give up. She had spent her life savings on consultants who couldn't identify what was wrong with her application. That's when she discovered Japa Genie's AI-powered analysis.
            </p>

            <h3 className="text-2xl font-bold mt-6 mb-4">The AI Breakthrough</h3>
            <p>
              Japa Genie's AI identified the exact issues human consultants missed:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Weak proof of funds documentation</li>
              <li>Work experience descriptions that didn't match NOC codes</li>
              <li>Incorrect settlement funds calculation</li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Transformation</h3>
            <p>
              Within 2 months of following Japa Genie's personalized roadmap, Amara:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fixed her proof of funds with proper bank statements and gift deed documentation</li>
              <li>Rewrote her work experience to perfectly match NOC 2173 requirements</li>
              <li>Increased her CRS score from 438 to 472</li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-4">The Victory</h3>
            <p>
              <strong>Fourth application: APPROVED.</strong> Amara landed in Toronto in March 2024 and now works as a Senior Developer at a fintech startup, earning CAD $85,000.
            </p>

            <blockquote className="text-lg font-medium text-gray-700 border-l-4 border-primary pl-6 mt-6">
              "Japa Genie didn't just fix my application - it rebuilt my confidence. The AI saw patterns the human consultants missed."
            </blockquote>
          </div>

          <div className="border-t pt-8 mt-8 text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Write Your Success Story?</h3>
            <p className="text-gray-600 mb-6">
              Get your personalized visa analysis like Amara did. Discover what's holding you back and get your roadmap to success.
            </p>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/chat">Start Your Japa Journey</a>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
