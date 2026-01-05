#!/usr/bin/env node

const BASE_URL = 'http://localhost:9002';

const APIS_TO_TEST = [
  {
    name: 'Visitor Chat',
    endpoint: '/api/visitor-chat',
    method: 'POST',
    body: JSON.stringify({
      message: "Hello, testing chat functionality",
      conversationHistory: []
    }),
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Main Chat',
    endpoint: '/api/chat',
    method: 'POST',
    body: JSON.stringify({
      question: "Test main chat",  // Changed from 'message' to 'question'
      sessionId: "test-session"
    }),
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Eligibility Check',
    endpoint: '/api/visa-matchmaker',
    method: 'POST',
    body: JSON.stringify({
      destination: "Canada",
      visaType: "Work Visa", 
      background: "Software engineer with 5 years experience",
      currentSituation: "Working in Lagos",
      age: 28,  // Added required age field
      education: "Bachelor's degree",
      workExperience: "5 years"
    }),
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Document Checker',
    endpoint: '/api/document-check',
    method: 'POST',
    body: JSON.stringify({
      documentType: "passport",
      country: "Nigeria",
      documentDataUri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ"  // Added required field
    }),
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Proof of Funds',
    endpoint: '/api/analyze-pof',
    method: 'POST',
    body: JSON.stringify({
      amount: 25000,
      currency: "USD",
      destination: "Canada",
      userId: "test-user"  // Added required authentication
    }),
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'  // Added auth header
    }
  }
];

async function testAPI(api) {
  try {
    const response = await fetch(`${BASE_URL}${api.endpoint}`, {
      method: api.method,
      headers: api.headers,
      body: api.body
    });
    
    const success = response.ok;
    const data = await response.text();
    
    console.log(`${success ? '✅' : '❌'} ${api.name}: ${success ? 'PASS' : 'FAIL'} (${response.status})`);
    if (!success && data) console.log(`   Error: ${data.substring(0, 100)}...`);
    
    return { name: api.name, success, statusCode: response.status };
  } catch (error) {
    console.log(`❌ ${api.name}: FAIL - ${error.message}`);
    return { name: api.name, success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing All APIs...\n');
  
  const results = [];
  for (const api of APIS_TO_TEST) {
    const result = await testAPI(api);
    results.push(result);
  }

  console.log('\n📊 RESULTS:');
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 ALL APIS WORKING! Ready for presentation.');
  } else {
    console.log('\n⚠️  Some APIs failed - check error messages above.');
  }
}

runTests();
