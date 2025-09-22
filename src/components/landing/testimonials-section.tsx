
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JapaGenieLogo } from '@/components/icons';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Adekunle O.',
    avatar: 'AO',
    location: 'Lagos, Nigeria',
    destination: 'Canada',
    story: "After two rejections, I thought my dream of studying in Canada was over. Japa Genie analyzed my old applications and gave me a clear strategy. My student visa was approved in just 8 weeks!",
    rating: 5,
  },
  {
    name: 'Brenda M.',
    avatar: 'BM',
    location: 'Nairobi, Kenya',
    destination: 'United Kingdom',
    story: "The document checker is a lifesaver! It caught a mistake in my financial proof that would have definitely caused a delay. I got my UK work permit without any issues. Thank you!",
    rating: 5,
  },
  {
    name: 'Samuel K.',
    avatar: 'SK',
    location: 'Accra, Ghana',
    destination: 'USA',
    story: "I was completely lost about which visa to apply for. The AI Matchmaker recommended the O-1 visa based on my tech background, which I hadn't even considered. Japa Genie made the impossible feel possible.",
    rating: 5,
  },
    {
    name: 'Fatima Z.',
    avatar: 'FZ',
    location: 'Dakar, Senegal',
    destination: 'France',
    story: "The 24/7 AI assistant answered all my questions instantly. It was like having a personal visa consultant in my pocket. I felt so confident during my interview and got my visa for France.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Real Results from Real People
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Japa Genie is helping people achieve their dreams.
          </p>
        </header>
        
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-1 h-full">
                    <Card className="h-full flex flex-col">
                        <CardContent className="p-6 flex flex-col flex-grow">
                             <div className="flex mb-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-base text-muted-foreground flex-grow mb-6">"{testimonial.story}"</p>
                            <div className="flex items-center gap-4 mt-auto">
                                <Avatar>
                                    <AvatarFallback className="bg-primary text-primary-foreground">{testimonial.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.location} &rarr; {testimonial.destination}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </div>
    </section>
  );
}
