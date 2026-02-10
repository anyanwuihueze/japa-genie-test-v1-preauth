import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ firstName }) => {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <p>Thank you for joining Japa Genie.</p>
    </div>
  );
};
