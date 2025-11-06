// src/app/terms-and-conditions/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-center text-sm text-muted-foreground">
            <em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
          </p>

          <h2 className="text-xl font-semibold mt-6">1. DEFINITIONS</h2>
          <p><strong>“Japa Genie”, “we”, “us” or “our”</strong> means <strong>Japa Genie Inc.</strong>, a corporation incorporated under the <strong>Canada Business Corporations Act</strong>.</p>
          <p><strong>“Service”</strong> means our AI-powered visa guidance web app.</p>

          <h2 className="text-xl font-semibold mt-6">2. ACCEPTANCE</h2>
          <p>By creating an account or making a payment, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Service.</p>

          <h2 className="text-xl font-semibold mt-6">3. SERVICE DESCRIPTION & DISCLAIMERS</h2>
          <p>Japa Genie provides algorithmic recommendations, checklists, and AI-generated mock interviews. We are <strong>not</strong> a law firm or immigration consultant. Nothing provided constitutes legal advice or guarantees visa approval. Immigration authorities make independent decisions.</p>

          <h2 className="text-xl font-semibold mt-6">4. FEES, BILLING & REFUNDS</h2>
          <p>Premium features are billed as described on our pricing page. You may cancel subscriptions at any time. Our refund policy is as follows:</p>
          <ul>
            <li>Users in Québec and Ontario may cancel within 7 days for a pro-rata refund of unused full months.</li>
            <li>Outside those provinces, refunds are discretionary.</li>
            <li>Services already substantially used (e.g., AI roadmap generation, mock interviews) are considered rendered and non-refundable.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. GOVERNING LAW & DISPUTE RESOLUTION</h2>
          <p>These Terms are governed by the laws of Ontario, Canada. Disputes shall be resolved by binding arbitration in Toronto.</p>
          
          <p className="text-center font-bold mt-8">
            © {new Date().getFullYear()} Japa Genie Inc. – All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
