const fs = require('fs');

console.log('🧪 Running Japa Genie Health Check...\n');

// Check if critical files exist
const criticalFiles = [
  'src/app/chat/client.tsx',
  'src/app/chat/page.tsx', 
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/client.tsx',
  'src/lib/AuthContext.tsx',
  'src/lib/supabase/client.ts',
  'src/lib/supabase/server.ts'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

console.log('\n📊 SUMMARY:');
if (allFilesExist) {
  console.log('✅ All critical files present');
  console.log('🚀 Run: npm run build - to test compilation');
} else {
  console.log('❌ Some files missing - check above');
}

console.log('\n💡 Next: Run "npm run build" to test everything compiles correctly');



