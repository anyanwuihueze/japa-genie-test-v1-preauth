async function testImport() {
  try {
    console.log('Testing basic import...');
    const { visaChatAssistant } = await import('./src/ai/flows/visa-chat-assistant.ts');
    console.log('Import successful, function type:', typeof visaChatAssistant);
  } catch (error) {
    console.error('Import failed:', error.message);
    console.error('Full error:', error);
  }
}

testImport();
