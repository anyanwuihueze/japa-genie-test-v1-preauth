import { documentChecker } from './document-checker';
import fs from 'fs';

async function test() {
  const pdf = fs.readFileSync('/home/user/uploads/statement.pdf');
  const base64 = pdf.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64}`;
  
  const result = await documentChecker({
    documentDataUri: dataUri,
    targetCountry: 'USA',
    visaType: 'Tourist'
  });
  
  console.log(JSON.stringify(result, null, 2));
}

test();
