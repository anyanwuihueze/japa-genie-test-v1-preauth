import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <h1 style={{ color: '#333' }}>Welcome to JapaGenie, {firstName}! 🎉</h1>
    <p>Thank you for joining our community.</p>
    
    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', marginTop: '20px', borderRadius: '5px' }}>
      <h3>Here's what you can do next:</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Explore cost calculators</li>
        <li>Join our community forum</li>
      </ul>
    </div>
    
    <a href="https://japagenie.com/dashboard" style={{
      display: 'inline-block',
      backgroundColor: '#0070f3',
      color: 'white',
      padding: '10px 20px',
      textDecoration: 'none',
      borderRadius: '5px',
      marginTop: '20px'
    }}>
      Go to Dashboard
    </a>
    
    <p style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
      Best regards,<br/>
      The JapaGenie Team
    </p>
  </div>
);
