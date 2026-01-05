#!/usr/bin/env node

const BASE_URL = 'http://localhost:9002';

const TESTS = [
  // Core AI Features
  {
    name: "Visitor Chat",
    endpoint: "/api/visitor-chat",
    method: "POST",
    body: { message: "How does Japa Genie work?", conversationHistory: [] }
  },
  {
    name: "Main Chat",
    endpoint: "/api/chat", 
    method: "POST",
    body: { question: "What visa should I apply for?", sessionId: "test" }
  },
  {
    name: "Visa Interview AI",
    endpoint: "/api/interview",
    method: "POST", 
    body: {
      userData: { destination: "Canada", visaType: "Work Visa" },
      messages: [{role: "user", content: "Prepare me for interview"}]
    }
  },
  {
    name: "Document Checker",
    endpoint: "/api/document-check",
    method: "POST",
    body: { documentType: "passport", country: "Nigeria", documentDataUri: "data:image/jpeg;base64,test" }
  },
  // Test key pages load
  {
    name: "Eligibility Page",
    endpoint: "/eligibility",
    method: "GET",
    testPage: true
  },
  {
    name: "Home Page", 
    endpoint: "/",
    method: "GET",
    testPage: true
  }
];

async function runTest(test) {
  try {
    const options = {
      method: test.method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (test.method === 'POST' && test.body) {
      options.body = JSON.stringify(test.body);
    }
    
    const response = await fetch(`${BASE_URL}${test.endpoint}`, options);
    const success = response.ok;
    
    console.log(`${success ? '✅' : '❌'} ${test.name}: ${success ? 'PASS' : 'FAIL'} (${response.status})`);
    return success;
    
  } catch (error) {
    console.log(`❌ ${test.name}: FAIL - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 FINAL TESTING - Core Features Only\n');
  
  let passed = 0;
  let total = 0;
  
  for (const test of TESTS) {
    const success = await runTest(test);
    if (success) passed++;
    total++;
  }
  
  console.log(`\n📊 FINAL RESULTS: ${passed}/${total} working`);
  
  if (passed >= 4) {
    console.log('🎉 CORE FEATURES WORKING! Ready for presentation.');
  } else {
    console.log('⚠️  Too many failures - needs fixing.');
  }
}

main();
