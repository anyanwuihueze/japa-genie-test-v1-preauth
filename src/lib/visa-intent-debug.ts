export function debugVisaIntent(text: string) {
  console.log('�� Debug visa intent for:', text);
  
  const lowerText = text.toLowerCase();
  const hasStudy = lowerText.includes('study') || lowerText.includes('student');
  const hasGermany = lowerText.includes('germany');
  
  console.log('📊 Has study:', hasStudy, 'Has Germany:', hasGermany);
  return hasStudy && hasGermany;
}
