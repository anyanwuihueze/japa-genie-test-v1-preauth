import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// ⚠️ CRITICAL FIX: Prevent prerendering during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


    // Initialize Resend inside the function, not at module level
    const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, originCountry, destinationCountry, visaType, dependents, costData } = body;

    const formatCurrency = (amount: number, currency = 'USD') => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const daysRemaining = costData.pofProfile?.timeline?.daysRemaining || 
      Math.ceil((new Date(costData.pofRequirement.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    await resend.emails.send({
      from: 'Japa Genie <admin@japagenie.com>',
      to: email,
      subject: `🎯 Your ${destinationCountry} ${visaType} Visa Blueprint - ${formatCurrency(costData.totalCost)} Total Cost`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    }
    .header { 
      background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      font-size: 32px; 
      font-weight: 700; 
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header p { 
      font-size: 16px; 
      opacity: 0.95; 
    }
    .hero-cost {
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 24px;
      margin-top: 24px;
      backdrop-filter: blur(10px);
    }
    .hero-cost-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .hero-cost-amount {
      font-size: 48px;
      font-weight: 800;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .content { 
      padding: 30px; 
    }
    .greeting {
      font-size: 18px;
      color: #111827;
      margin-bottom: 16px;
    }
    .section {
      margin: 32px 0;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pof-urgent {
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
      border: 3px solid #dc2626;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      color: white;
    }
    .pof-urgent h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pof-stats {
      display: flex;
      gap: 16px;
      margin: 20px 0;
    }
    .pof-stat {
      flex: 1;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .pof-stat-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.8;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .pof-stat-value {
      font-size: 28px;
      font-weight: 800;
    }
    .warning-box {
      background: rgba(220, 38, 38, 0.15);
      border-left: 4px solid #dc2626;
      padding: 16px;
      border-radius: 6px;
      margin: 16px 0;
      color: #fef2f2;
    }
    .timeline {
      background: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
    }
    .timeline-item {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      position: relative;
    }
    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 19px;
      top: 40px;
      bottom: -20px;
      width: 2px;
      background: linear-gradient(to bottom, #8b5cf6, transparent);
    }
    .timeline-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
      z-index: 1;
    }
    .timeline-dot.green { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .timeline-dot.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
    .timeline-dot.orange { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
    .timeline-dot.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
    .timeline-content {
      flex: 1;
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .timeline-date {
      font-size: 12px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .timeline-title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .timeline-desc {
      font-size: 14px;
      color: #6b7280;
    }
    .hidden-costs {
      margin: 20px 0;
    }
    .cost-item {
      background: #fef2f2;
      border: 2px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .cost-item-content {
      flex: 1;
    }
    .cost-item-title {
      font-size: 16px;
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 4px;
    }
    .cost-item-desc {
      font-size: 14px;
      color: #7f1d1d;
    }
    .cost-item-amount {
      font-size: 24px;
      font-weight: 800;
      color: #dc2626;
      white-space: nowrap;
      margin-left: 16px;
    }
    .savings-chart {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
    }
    .savings-month {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #86efac;
    }
    .savings-month:last-child {
      border-bottom: none;
    }
    .savings-month-name {
      font-weight: 700;
      color: #065f46;
    }
    .savings-amount {
      font-size: 18px;
      font-weight: 800;
      color: #059669;
    }
    .savings-bar {
      width: 100%;
      height: 8px;
      background: #d1fae5;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    .savings-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #f97316, #dc2626);
      color: white;
      padding: 18px 36px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
    }
    .whatsapp-section {
      background: linear-gradient(135deg, #166534, #15803d);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 32px 0;
      color: white;
    }
    .whatsapp-section h3 {
      font-size: 20px;
      margin-bottom: 12px;
    }
    .whatsapp-number {
      font-size: 24px;
      font-weight: 700;
      color: #86efac;
      text-decoration: none;
      display: inline-block;
      margin: 12px 0;
    }
    .whatsapp-button {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      margin-top: 12px;
    }
    .footer {
      background: #f9fafb;
      text-align: center;
      padding: 24px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-logo {
      font-size: 20px;
      font-weight: 800;
      background: linear-gradient(135deg, #f97316, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    @media only screen and (max-width: 600px) {
      .pof-stats { flex-direction: column; }
      .hero-cost-amount { font-size: 36px; }
      .timeline-item { flex-direction: column; gap: 8px; }
      .timeline-item::after { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎯 Your Visa Blueprint</h1>
      <p>${originCountry} → ${destinationCountry} | ${visaType} Visa</p>
      <div class="hero-cost">
        <div class="hero-cost-label">Complete Relocation Cost</div>
        <div class="hero-cost-amount">${formatCurrency(costData.totalCost)}</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Hi ${name},</p>
      <p>You're about to get the most detailed visa cost analysis you'll find anywhere. This isn't just numbers—it's your complete roadmap to ${destinationCountry}.</p>

      <!-- POF Urgent Alert -->
      <div class="pof-urgent">
        <h2>⏰ Critical: Proof of Funds Deadline</h2>
        
        <div class="pof-stats">
          <div class="pof-stat">
            <div class="pof-stat-label">Required Amount</div>
            <div class="pof-stat-value">${formatCurrency(costData.pofRequirement.amount, costData.pofRequirement.currency)}</div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.9;">${costData.pofRequirement.currency}</div>
          </div>
          <div class="pof-stat">
            <div class="pof-stat-label">Days Remaining</div>
            <div class="pof-stat-value" style="color: ${daysRemaining < 60 ? '#fbbf24' : '#86efac'};">${daysRemaining}</div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.9;">Until Deadline</div>
          </div>
        </div>

        <div class="pof-stats">
          <div class="pof-stat">
            <div class="pof-stat-label">Save Per Month</div>
            <div class="pof-stat-value" style="color: #86efac;">${formatCurrency(costData.pofRequirement.monthlySavingsNeeded)}</div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.9;">Starting Now</div>
          </div>
          <div class="pof-stat">
            <div class="pof-stat-label">Account Type</div>
            <div class="pof-stat-value" style="font-size: 18px;">${costData.pofRequirement.accountType}</div>
          </div>
        </div>

        <div class="warning-box">
          ⚠️ <strong>CRITICAL:</strong> Money must stay UNTOUCHED for ${costData.pofRequirement.seasoningPeriod} months. Any withdrawal = automatic visa rejection.
        </div>
      </div>

      <!-- POF Timeline -->
      <div class="section">
        <h2 class="section-title">📅 Your POF Timeline</h2>
        <div class="timeline">
          ${costData.pofProfile?.timeline ? `
            <div class="timeline-item">
              <div class="timeline-dot green">1</div>
              <div class="timeline-content">
                <div class="timeline-date">${formatDate(costData.pofProfile.timeline.accountOpenDate)}</div>
                <div class="timeline-title">Open ${costData.pofRequirement.accountType}</div>
                <div class="timeline-desc">Choose provider: Fintiba (fastest), Deutsche Bank (traditional), or Expatrio (budget-friendly)</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot blue">2</div>
              <div class="timeline-content">
                <div class="timeline-date">${formatDate(costData.pofProfile.timeline.depositDeadline)}</div>
                <div class="timeline-title">Deposit Full Amount</div>
                <div class="timeline-desc">Transfer ${formatCurrency(costData.pofRequirement.amount, costData.pofRequirement.currency)} ${costData.pofRequirement.currency} + exchange rate buffer (${formatCurrency(costData.pofProfile.savingsRoadmap?.exchangeRateBuffer || 0)})</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot orange">3</div>
              <div class="timeline-content">
                <div class="timeline-date">${formatDate(costData.pofProfile.timeline.seasoningStartDate)} - ${formatDate(costData.pofProfile.timeline.seasoningEndDate)}</div>
                <div class="timeline-title">Seasoning Period (DO NOT TOUCH!)</div>
                <div class="timeline-desc">${costData.pofRequirement.seasoningPeriod} months - Money must remain untouched. Set calendar reminders!</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot purple">4</div>
              <div class="timeline-content">
                <div class="timeline-date">${formatDate(costData.pofProfile.timeline.visaApplicationDate)}</div>
                <div class="timeline-title">POF Ready - Apply for Visa!</div>
                <div class="timeline-desc">Download blocked account certificate and submit with visa application</div>
              </div>
            </div>
          ` : `
            <div class="timeline-item">
              <div class="timeline-dot green">1</div>
              <div class="timeline-content">
                <div class="timeline-date">This Week</div>
                <div class="timeline-title">Open ${costData.pofRequirement.accountType}</div>
                <div class="timeline-desc">Start the account opening process immediately</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot blue">2</div>
              <div class="timeline-content">
                <div class="timeline-date">${formatDate(costData.pofRequirement.deadline)}</div>
                <div class="timeline-title">Complete POF Seasoning</div>
                <div class="timeline-desc">Funds must be ready for visa application</div>
              </div>
            </div>
          `}
        </div>
      </div>

      <!-- Monthly Savings Plan -->
      ${costData.pofProfile?.savingsRoadmap?.monthlyBreakdown ? `
        <div class="section">
          <h2 class="section-title">💰 Your Month-by-Month Savings Plan</h2>
          <div class="savings-chart">
            ${costData.pofProfile.savingsRoadmap.monthlyBreakdown.slice(0, 4).map((month, index) => `
              <div class="savings-month">
                <div>
                  <div class="savings-month-name">${month.month}</div>
                  <div style="font-size: 12px; color: #065f46; margin-top: 4px;">${month.milestone}</div>
                </div>
                <div class="savings-amount">${formatCurrency(month.amountToSave)}</div>
              </div>
              <div class="savings-bar">
                <div class="savings-bar-fill" style="width: ${((index + 1) / 4) * 100}%;"></div>
              </div>
            `).join('')}
            <div style="text-align: center; margin-top: 16px; font-size: 14px; color: #065f46;">
              💡 <strong>Exchange Rate Buffer:</strong> We added ${formatCurrency(costData.pofProfile.savingsRoadmap.exchangeRateBuffer)} to protect against currency fluctuation
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Hidden Costs Alert -->
      <div class="section">
        <h2 class="section-title">🚨 Hidden Costs You're Missing</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">${costData.preGatePreview?.shockStatistic || costData.aiAnalysis.shockingFact}</p>
        
        <div class="hidden-costs">
          ${costData.preGatePreview?.top3HiddenCosts ? 
            costData.preGatePreview.top3HiddenCosts.map(cost => `
              <div class="cost-item">
                <div class="cost-item-content">
                  <div class="cost-item-title">${cost.item}</div>
                  <div class="cost-item-desc">${cost.why}</div>
                </div>
                <div class="cost-item-amount">${formatCurrency(cost.cost)}</div>
              </div>
            `).join('') 
            : 
            `
              <div class="cost-item">
                <div class="cost-item-content">
                  <div class="cost-item-title">Medical Examination & Tests</div>
                  <div class="cost-item-desc">Required but not listed on embassy website</div>
                </div>
                <div class="cost-item-amount">${formatCurrency(250)}</div>
              </div>
              <div class="cost-item">
                <div class="cost-item-content">
                  <div class="cost-item-title">Document Translation & Notarization</div>
                  <div class="cost-item-desc">All documents must be in ${destinationCountry === 'Germany' ? 'German' : 'English'}</div>
                </div>
                <div class="cost-item-amount">${formatCurrency(180)}</div>
              </div>
            `
          }
        </div>

        <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 16px;">
          <p style="color: #6b7280; margin-bottom: 12px;">+ ${(costData.breakdown?.length || 15) - 3} more hidden costs in your full interactive report</p>
        </div>
      </div>

      <!-- Cost Summary -->
      <div class="section">
        <h2 class="section-title">📊 What People Miss</h2>
        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: 600;">What Most Budget</div>
              <div style="font-size: 32px; font-weight: 800; color: #059669;">${formatCurrency(costData.preGatePreview?.comparisonData?.whatMostBudget || costData.visibleCostsTotal)}</div>
            </div>
            <div style="flex: 1; text-align: center; border-left: 2px solid #f59e0b; border-right: 2px solid #f59e0b;">
              <div style="font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: 600;">Actual Total Cost</div>
              <div style="font-size: 32px; font-weight: 800; color: #dc2626;">${formatCurrency(costData.totalCost)}</div>
            </div>
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: 600;">You're Missing</div>
              <div style="font-size: 32px; font-weight: 800; color: #dc2626;">${formatCurrency(costData.preGatePreview?.comparisonData?.missedAmount || costData.hiddenCostsTotal)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://japagenie.com/cost-calculator/results?email=${encodeURIComponent(email)}" class="cta-button">
          🎯 View Your Full Interactive Report →
        </a>
        <p style="font-size: 14px; color: #6b7280; margin-top: 12px;">
          Includes complete cost breakdown, provider comparisons, and risk analysis
        </p>
      </div>

      <!-- WhatsApp Support -->
      <div class="whatsapp-section">
        <h3>💬 Need Help? Chat on WhatsApp</h3>
        <p style="opacity: 0.9; margin: 8px 0;">Get instant answers from our visa experts</p>
        <a href="https://wa.me/${phone?.replace(/[^0-9]/g, '') || '2349031622709'}?text=Hi%20Japa%20Genie,%20I%20got%20my%20cost%20analysis%20for%20${destinationCountry}%20${visaType}%20visa.%20I%20have%20questions!" 
           class="whatsapp-number">
          ${phone || '+234 903 162 2709'}
        </a>
        <br>
        <a href="https://wa.me/${phone?.replace(/[^0-9]/g, '') || '2349031622709'}?text=Hi%20Japa%20Genie,%20I%20need%20help%20with%20my%20visa%20application" 
           class="whatsapp-button">
          Start Chat Now
        </a>
        <p style="font-size: 13px; opacity: 0.8; margin-top: 12px;">⚡ Typical response time: Under 5 minutes</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">JAPA GENIE AI</div>
      <p>Premium Visa Intelligence</p>
      <p style="margin-top: 12px; font-size: 12px;">
        This analysis was generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p style="margin-top: 8px; font-size: 12px;">
        <a href="https://japagenie.com" style="color: #f97316; text-decoration: none;">japagenie.com</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}