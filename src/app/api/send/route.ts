import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 EMAIL API: Processing request');
    
    const body = await request.json();
    const { to, firstName, eligibilityData } = body;

    if (!to || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔵 EMAIL API: Sending to', to, 'for', eligibilityData?.destination);

    // Create HTML email
    const score = eligibilityData?.aiResults?.score || 0;
    const destination = eligibilityData?.destination || 'your destination';
    const visaType = eligibilityData?.visaType || 'visa';
    const summary = eligibilityData?.aiResults?.summary || 'Your AI analysis is complete.';
    
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Japa Genie AI Eligibility Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6; 
      color: #1f2937; 
      background: #f9fafb;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); 
      color: white; 
      padding: 50px 30px; 
      text-align: center; 
      position: relative;
    }
    .header h1 { 
      font-size: 36px; 
      font-weight: 800; 
      margin-bottom: 12px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .header p { 
      font-size: 18px; 
      opacity: 0.95; 
      margin-bottom: 0;
    }
    .score-hero {
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 30px;
      margin-top: 30px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255,255,255,0.3);
    }
    .score-hero-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    .score-hero-amount {
      font-size: 72px;
      font-weight: 900;
      text-shadow: 0 4px 12px rgba(0,0,0,0.3);
      margin: 10px 0;
    }
    .readiness-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 10px 24px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 16px;
      margin-top: 10px;
      border: 2px solid rgba(255,255,255,0.4);
    }
    .content { 
      padding: 40px; 
    }
    .greeting {
      font-size: 20px;
      color: #111827;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .section {
      margin: 40px 0;
    }
    .section-title {
      font-size: 24px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .analysis-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 28px;
      margin: 20px 0;
      border-left: 5px solid #7C3AED;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
    }
    .analysis-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: #7C3AED;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .strengths-grid, .weaknesses-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    @media (max-width: 500px) {
      .strengths-grid, .weaknesses-grid { grid-template-columns: 1fr; }
    }
    .strength-item, .weakness-item {
      background: white;
      padding: 20px;
      border-radius: 10px;
      border: 2px solid #e5e7eb;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .strength-item:hover, .weakness-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .strength-item {
      border-color: #10b981;
      border-left-width: 4px;
    }
    .weakness-item {
      border-color: #ef4444;
      border-left-width: 4px;
    }
    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .strength-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .weakness-icon { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .item-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .strength-title { color: #065f46; }
    .weakness-title { color: #991b1b; }
    .item-desc {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .recommendations {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 16px;
      padding: 32px;
      color: white;
      margin: 32px 0;
    }
    .recommendations h3 {
      font-size: 24px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 24px;
      color: white;
    }
    .recommendation-item {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }
    .recommendation-number {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      color: #3b82f6;
      text-align: center;
      line-height: 32px;
      font-weight: 800;
      margin-right: 12px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
      color: white;
      padding: 20px 40px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 18px;
      text-align: center;
      margin: 32px 0;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      cursor: pointer;
    }
    .cta-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(124, 58, 237, 0.5);
    }
    .footer {
      background: #f9fafb;
      text-align: center;
      padding: 32px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #7C3AED, #EC4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    @media only screen and (max-width: 600px) {
      .header { padding: 40px 20px; }
      .header h1 { font-size: 28px; }
      .score-hero-amount { font-size: 56px; }
      .content { padding: 30px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎯 Your AI Eligibility Report</h1>
      <p>${destination} • ${visaType} Visa</p>
      <div class="score-hero">
        <div class="score-hero-label">AI Eligibility Score</div>
        <div class="score-hero-amount">${score}%</div>
        <div class="readiness-badge">
          ${score >= 80 ? '🎉 Strong Candidate' : score >= 60 ? '💪 Moderate Potential' : '📚 Needs Preparation'}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Hi ${firstName},</p>
      <p>Your personalized AI analysis for your <strong>${visaType} visa</strong> application to <strong>${destination}</strong> is complete. Here's your detailed breakdown:</p>

      <!-- Summary -->
      <div class="analysis-card">
        <h3>📊 AI Analysis Summary</h3>
        <p>${summary}</p>
      </div>

      <!-- Strengths -->
      <div class="section">
        <h2 class="section-title">✅ Your Strengths</h2>
        <div class="strengths-grid">
          ${eligibilityData?.aiResults?.strengths?.slice(0, 4).map((strength, i) => `
            <div class="strength-item">
              <div class="item-icon strength-icon">✓</div>
              <div class="item-title strength-title">Strength ${i + 1}</div>
              <div class="item-desc">${strength}</div>
            </div>
          `).join('') || `
            <div class="strength-item">
              <div class="item-icon strength-icon">✓</div>
              <div class="item-title strength-title">Clear Profile</div>
              <div class="item-desc">You've provided comprehensive background information for analysis.</div>
            </div>
            <div class="strength-item">
              <div class="item-icon strength-icon">✓</div>
              <div class="item-title strength-title">Specific Goals</div>
              <div class="item-desc">Clear destination and visa type identified for targeted assessment.</div>
            </div>
          `}
        </div>
      </div>

      <!-- Areas to Improve -->
      <div class="section">
        <h2 class="section-title">⚠️ Areas to Improve</h2>
        <div class="weaknesses-grid">
          ${eligibilityData?.aiResults?.weaknesses?.slice(0, 4).map((weakness, i) => `
            <div class="weakness-item">
              <div class="item-icon weakness-icon">!</div>
              <div class="item-title weakness-title">Improvement ${i + 1}</div>
              <div class="item-desc">${weakness}</div>
            </div>
          `).join('') || `
            <div class="weakness-item">
              <div class="item-icon weakness-icon">!</div>
              <div class="item-title weakness-title">Documentation</div>
              <div class="item-desc">Gather required documents early to avoid processing delays.</div>
            </div>
            <div class="weakness-item">
              <div class="item-icon weakness-icon">!</div>
              <div class="item-title weakness-title">Timeline Planning</div>
              <div class="item-desc">Start application process 3-6 months before intended travel date.</div>
            </div>
          `}
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations">
        <h3>💡 AI-Powered Recommendations</h3>
        ${eligibilityData?.aiResults?.recommendations?.slice(0, 3).map((rec, i) => `
          <div class="recommendation-item">
            <span class="recommendation-number">${i + 1}</span>
            <span>${rec}</span>
          </div>
        `).join('') || `
          <div class="recommendation-item">
            <span class="recommendation-number">1</span>
            <span>Complete the detailed 12-question assessment for personalized timeline planning.</span>
          </div>
          <div class="recommendation-item">
            <span class="recommendation-number">2</span>
            <span>Review official embassy requirements and document checklist for ${destination}.</span>
          </div>
          <div class="recommendation-item">
            <span class="recommendation-number">3</span>
            <span>Consider professional consultation for complex cases or specific concerns.</span>
          </div>
        `}
      </div>

      <!-- CTA -->
      <div style="text-align: center;">
        <a href="https://japagenie.com/eligibility" class="cta-button">
          🎯 View Your Complete Interactive Report →
        </a>
        <p style="font-size: 16px; color: #6b7280; margin-top: 16px; line-height: 1.6;">
          Your full report includes:<br>
          <span style="color: #7C3AED;">• All ${eligibilityData?.aiResults?.strengths?.length || 0} strengths</span><br>
          <span style="color: #ef4444;">• All ${eligibilityData?.aiResults?.weaknesses?.length || 0} areas to improve</span><br>
          <span style="color: #3b82f6;">• Personalized action plan with timeline</span><br>
          <span style="color: #10b981;">• Alternative destination suggestions</span>
        </p>
      </div>

      <!-- WhatsApp Support -->
      <div style="background: linear-gradient(135deg, #166534, #15803d); border-radius: 16px; padding: 32px; text-align: center; margin: 40px 0; color: white;">
        <h3 style="font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; color: white;">💬 Need Help? Chat on WhatsApp</h3>
        <p style="opacity: 0.95; margin: 8px 0; font-size: 16px;">Get instant answers from our visa experts</p>
        <a href="https://wa.me/2349031622709?text=Hi%20Japa%20Genie,%20I%20got%20my%20eligibility%20report%20for%20${encodeURIComponent(destination)}%20${encodeURIComponent(visaType)}%20visa.%20Score:%20${score}%25.%20I%20have%20questions!" 
           style="display: inline-block; font-size: 24px; font-weight: 700; color: #86efac; text-decoration: none; margin: 16px 0;">
          +234 903 162 2709
        </a>
        <br>
        <a href="https://wa.me/2349031622709?text=Hi%20Japa%20Genie,%20I%20need%20help%20with%20my%20visa%20eligibility%20assessment" 
           style="display: inline-block; background: #22c55e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; margin-top: 16px;">
          Start Chat Now
        </a>
        <p style="font-size: 14px; opacity: 0.8; margin-top: 16px;">⚡ Typical response time: Under 5 minutes</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">JAPA GENIE AI</div>
      <p style="font-size: 16px; margin-bottom: 8px;">Premium Visa Intelligence</p>
      <p style="margin: 12px 0; font-size: 14px;">
        This report was generated by Japa Genie AI • ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p style="margin-top: 16px; font-size: 14px;">
        <a href="https://japagenie.com" style="color: #7C3AED; text-decoration: none; font-weight: 700;">japagenie.com</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('🎨 Sending BEAUTIFUL eligibility email to:', to);

    console.log('🔵 EMAIL API: Attempting to send...');
    const { data, error } = await resend.emails.send({
      from: 'Japa Genie <admin@japagenie.com>',
      to: [to],
      subject: `Your AI Eligibility Report: ${score}% Score • ${destination}`,
      html: htmlContent,
    });

    if (error) {
      console.error('🔴 RESEND CRITICAL ERROR:', error);
      throw new Error(`Resend failed: ${error.message}`);
    }

    console.log('🟢 EMAIL API: SUCCESS - Sent email ID:', data?.id);
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      message: 'Eligibility report sent successfully' 
    });
    
  } catch (error) {
    console.error('🔴 EMAIL API ERROR:', error);
    // Return actual error but still unlock report
    return NextResponse.json({ 
      success: true,
      error: error.message,
      warning: 'Email service error',
      message: 'Report unlocked (email may be delayed)' 
    }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Email API is running',
    sender: 'Japa Genie <admin@japagenie.com>',
    note: 'Use POST to send eligibility reports'
  });
}
