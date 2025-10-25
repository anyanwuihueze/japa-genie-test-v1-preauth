'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CheckoutButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/your-next-steps');
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
        <p className="text-sm text-gray-600">Unlock unlimited wishes and personalized visa guidance</p>
      </div>

      <div className="space-y-3 py-4 border-t border-b border-purple-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Premium Visa Guidance</span>
          <span className="text-xl font-bold text-gray-900">$29.00</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Unlimited AI wishes & guidance
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Personalized visa roadmap
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Document checklist & templates
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Priority support
          </li>
        </ul>
      </div>

      <Button 
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
      >
        Sign Up
      </Button>

      <p className="text-xs text-center text-gray-500">Choose your plan on the next page</p>
    </div>
  );
}
