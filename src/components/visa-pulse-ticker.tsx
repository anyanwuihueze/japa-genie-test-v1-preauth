'use client';
import useVisaPulse from '@/lib/useVisaPulse';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const colour: Record<string, string> = {
approval: 'bg-green-100 text-green-700 border-green-300',
refusal:  'bg-red-100 text-red-700 border-red-300',
tip:      'bg-blue-100 text-blue-700 border-blue-300',
};
export default function VisaPulseTicker() {
const { pulse } = useVisaPulse();
if (!pulse.length) return null;
return (
<div className="w-full overflow-hidden whitespace-nowrap py-3 border-y"><div className="inline-block animate-ticker"><span className="mr-1 font-bold">}
{p.headline}

))}


);
}
