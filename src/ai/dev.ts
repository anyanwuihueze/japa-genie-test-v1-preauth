import { config } from 'dotenv';
config();

import '@/ai/flows/interview-flow.ts';
import '@/ai/flows/visa-chat-assistant.ts';
import '@/ai/flows/document-checker.ts';
import '@/ai/flows/rejection-reversal-flow.ts';
import '@/ai/flows/insights-generator.ts';
import '@/ai/flows/site-assistant-flow.ts';
import '@/ai/tools/knowledge-retriever.ts';
