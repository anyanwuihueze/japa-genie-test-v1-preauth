import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TalkToSomeone() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Talk to Someone Like You
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Not another agent. Not another bot. 
          Just someone who’s been where you are — ready to help.
        </p>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 mb-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Real Help. Real People.</h2>
              <p className="text-gray-600 mt-2">
                Connect with verified guides who’ve walked this path — 
                not salespeople, but supporters.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="w-full max-w-md" asChild>
            <Link href="/chat">
              Start Chatting Now <span className="ml-2">💬</span>
            </Link>
          </Button>
          
          <p className="text-sm text-gray-500">
            Available 24/7 — no wait times, no gatekeeping.
          </p>
        </div>
      </div>
    </section>
  );
}
