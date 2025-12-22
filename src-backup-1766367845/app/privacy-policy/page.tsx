export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

        <h3>1. Introduction</h3>
        <p>Welcome to Japa Genie. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>

        <h3>2. Information We Collect</h3>
        <p>We collect personal information that you voluntarily provide to us when you register on the app, express an interest in obtaining information about us or our products and services, when you participate in activities on the app (such as using our AI chat) or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the app, the choices you make and the products and features you use.</p>

        <h3>3. How We Use Your Information</h3>
        <p>We use personal information collected via our app for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To respond to user inquiries/offer support to users.</li>
        </ul>

        <h3>4. Will Your Information Be Shared With Anyone?</h3>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

        <h3>5. How We Keep Your Information Safe</h3>
        <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
        
        <h3>6. Contact Us</h3>
        <p>If you have questions or comments about this policy, you may email us at support@japagenie.com</p>
      </div>
    </div>
  )
}
