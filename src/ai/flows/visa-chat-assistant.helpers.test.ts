import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildModelMessages,
  normalizeConversationHistory,
} from './visa-chat-assistant.helpers';

const SYSTEM_PROMPT = 'SYSTEM PROMPT';

test('buildModelMessages does not duplicate the system prompt in user messages', () => {
  const messages = buildModelMessages(
    {
      question: 'What are my options?',
      conversationHistory: [{ role: 'assistant', content: 'Previous answer' }],
    },
    SYSTEM_PROMPT
  );

  assert.equal(messages[0]?.role, 'system');
  assert.equal(messages[0]?.content, SYSTEM_PROMPT);
  assert.equal(messages[messages.length - 1]?.role, 'user');
  assert.equal(messages[messages.length - 1]?.content, 'What are my options?');
  assert.equal(
    messages.filter((message) => message.content === SYSTEM_PROMPT).length,
    1
  );
});

test('buildModelMessages preserves prior history as real chat messages', () => {
  const messages = buildModelMessages(
    {
      question: 'What should I do next?',
      conversationHistory: [
        { role: 'user', content: 'I want Canada.' },
        { role: 'assistant', content: 'Tell me your budget.' },
      ],
    },
    SYSTEM_PROMPT
  );

  assert.deepEqual(
    messages.slice(2, 4),
    [
      { role: 'user', content: 'I want Canada.' },
      { role: 'assistant', content: 'Tell me your budget.' },
    ]
  );
});

test('normalizeConversationHistory removes empty entries and consecutive duplicates', () => {
  const history = normalizeConversationHistory([
    { role: 'user', content: '  ' },
    { role: 'user', content: 'Hello' },
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: ' Hi there ' },
    { role: 'assistant', content: 'Hi there' },
    { role: 'user', content: '\nnext step\n' },
  ]);

  assert.deepEqual(history, [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there' },
    { role: 'user', content: 'next step' },
  ]);
});

test('normalizeConversationHistory caps history to the most recent 12 messages', () => {
  const history = normalizeConversationHistory(
    Array.from({ length: 15 }, (_, index) => ({
      role: (index % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `message-${index + 1}`,
    }))
  );

  assert.equal(history.length, 12);
  assert.equal(history[0]?.content, 'message-4');
  assert.equal(history[11]?.content, 'message-15');
});
