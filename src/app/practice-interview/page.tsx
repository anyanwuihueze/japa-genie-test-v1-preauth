import { Metadata } from 'next';
import ProductionMockInterview from './client';

export const metadata: Metadata = {
  title: 'Production Mock Interview Studio | Japa Genie',
  description: 'Real-time AI interview simulation with adaptive questioning and professional feedback. Practice with consular, employer, and university interview modes.',
};

export default function PracticeInterviewPage() {
  return (
    <div className="container py-12 space-y-8">
      <ProductionMockInterview />
    </div>
  );
}
