import * as React from 'react';

interface EligibilityEmailTemplateProps {
  firstName: string;
  eligibilityData: any;
}

export const EligibilityEmailTemplate: React.FC<EligibilityEmailTemplateProps> = ({ 
  firstName, 
  eligibilityData 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'Strong Candidate';
    if (score >= 60) return 'Moderate Potential';
    return 'Needs Preparation';
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '10px 10px 0 0'
      }}>
        <h1 style={{ margin: '0', fontSize: '28px' }}>🎉 Your AI Eligibility Report</h1>
        <p style={{ margin: '10px 0 0', opacity: '0.9' }}>
          {eligibilityData?.destination} • {eligibilityData?.visaType} Visa
        </p>
      </div>

      <div style={{ padding: '30px', background: '#f9fafb', borderRadius: '0 0 10px 10px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: '#fff',
            border: `8px solid ${getScoreColor(eligibilityData?.aiResults?.score || 0)}`,
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: getScoreColor(eligibilityData?.aiResults?.score || 0)
          }}>
            {eligibilityData?.aiResults?.score || 0}%
          </div>
          <h2 style={{ 
            color: getScoreColor(eligibilityData?.aiResults?.score || 0),
            margin: '10px 0'
          }}>
            {getReadinessLevel(eligibilityData?.aiResults?.score || 0)}
          </h2>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#7C3AED', marginTop: '0' }}>📊 AI Analysis Summary</h3>
          <p>{eligibilityData?.aiResults?.summary || 'No summary available.'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#10B981', marginTop: '0' }}>✅ Strengths</h3>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {(eligibilityData?.aiResults?.strengths || []).slice(0, 3).map((strength: string, index: number) => (
                <li key={index} style={{ marginBottom: '8px' }}>{strength}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#EF4444', marginTop: '0' }}>⚠️ Areas to Improve</h3>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {(eligibilityData?.aiResults?.weaknesses || []).slice(0, 3).map((weakness: string, index: number) => (
                <li key={index} style={{ marginBottom: '8px' }}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#3B82F6', marginTop: '0' }}>💡 Recommendations</h3>
          <ol style={{ paddingLeft: '20px', margin: '0' }}>
            {(eligibilityData?.aiResults?.recommendations || []).slice(0, 3).map((rec: string, index: number) => (
              <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
            ))}
          </ol>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #e5e7eb', marginTop: '30px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>
            For your complete analysis with all {eligibilityData?.aiResults?.strengths?.length || 0} strengths, 
            {eligibilityData?.aiResults?.weaknesses?.length || 0} areas to improve, and personalized action plan:
          </p>
          <a href="https://japagenie.com/eligibility" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            margin: '10px 0'
          }}>
            View Full Report →
          </a>
          <p style={{ margin: '20px 0 0', fontSize: '12px', color: '#9ca3af' }}>
            This report was generated by Japa Genie AI on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
