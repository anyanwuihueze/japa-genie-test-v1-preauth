import { documentChecker } from './src/ai/flows/document-checker';

// Test with a sample base64 image (tiny 1x1 pixel)
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function test() {
  const result = await documentChecker({
    documentDataUri: testImage,
    targetCountry: 'USA',
    visaType: 'Tourist'
  });
  
  console.log(JSON.stringify(result, null, 2));
}

test();
