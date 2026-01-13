'use server';
import { documentChecker } from './document-checker';
import fs from 'fs';
import path from 'path';

async function test() {
  // ✅ POINT TO THE NEW, VISIBLE UPLOADS DIRECTORY
  const imgPath = path.join(process.cwd(), 'src', 'uploads', 'test.jpg');
  
  if (!fs.existsSync(imgPath)) {
    console.error(`❌ File not found at: ${imgPath}`);
    console.error("Please upload 'test.jpg' to the 'src/uploads' folder in your file explorer.");
    return;
  }
  
  const img = fs.readFileSync(imgPath);
  const base64 = img.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;
  
  const result = await documentChecker({
    documentDataUri: dataUri,
    targetCountry: 'USA',
    visaType: 'Tourist'
  });
  
  console.log(JSON.stringify(result, null, 2));
}

test();
