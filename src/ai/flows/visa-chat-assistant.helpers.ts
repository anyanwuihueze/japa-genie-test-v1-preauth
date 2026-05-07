export interface VisaAssistantUserContext {
  name?: string;
  country?: string;
  destination?: string;
  profession?: string;
  visaType?: string;
  age?: number;
  userType?: string;
  timelineUrgency?: string;
}

export interface VisaAssistantInputSnapshot {
  question: string;
  conversationHistory?: ChatMessage[];
  userContext?: VisaAssistantUserContext;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function buildContextBlock(userContext?: VisaAssistantUserContext): string {
  if (!userContext) {
    return 'Profile not yet collected';
  }

  return [
    `Name: ${userContext.name || 'User'}`,
    `Age: ${userContext.age || 'unknown'}`,
    `Origin: ${userContext.country || 'unknown'}`,
    `Destination: ${userContext.destination || 'unknown'}`,
    `Visa type: ${userContext.visaType || 'unknown'}`,
    `Profession: ${userContext.profession || 'unknown'}`,
    `User type: ${userContext.userType || 'unknown'}`,
    `Timeline urgency: ${userContext.timelineUrgency || 'unknown'}`,
  ].join('\n');
}

export function normalizeConversationHistory(conversationHistory: ChatMessage[] = []): ChatMessage[] {
  const normalized = conversationHistory
    .map((message) => ({
      role: message.role,
      content: message.content?.trim(),
    }))
    .filter((message): message is ChatMessage => Boolean(message.content));

  const deduped: ChatMessage[] = [];
  for (const message of normalized) {
    const previous = deduped[deduped.length - 1];
    if (previous && previous.role === message.role && previous.content === message.content) {
      continue;
    }
    deduped.push(message);
  }

  return deduped.slice(-12);
}

export function buildModelMessages(
  input: VisaAssistantInputSnapshot,
  systemPrompt: string
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const history = normalizeConversationHistory(input.conversationHistory);

  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'system',
      content: `User profile and session context:\n${buildContextBlock(input.userContext)}\n\nAvoid repeating prior advice unless the user asks for a recap or comparison.`,
    },
    ...history,
    { role: 'user', content: input.question.trim() },
  ];
}
