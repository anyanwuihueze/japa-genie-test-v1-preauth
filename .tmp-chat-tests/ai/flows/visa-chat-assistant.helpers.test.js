"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const visa_chat_assistant_helpers_1 = require("./visa-chat-assistant.helpers");
const SYSTEM_PROMPT = 'SYSTEM PROMPT';
(0, node_test_1.default)('buildModelMessages does not duplicate the system prompt in user messages', () => {
    const messages = (0, visa_chat_assistant_helpers_1.buildModelMessages)({
        question: 'What are my options?',
        conversationHistory: [{ role: 'assistant', content: 'Previous answer' }],
    }, SYSTEM_PROMPT);
    strict_1.default.equal(messages[0]?.role, 'system');
    strict_1.default.equal(messages[0]?.content, SYSTEM_PROMPT);
    strict_1.default.equal(messages[messages.length - 1]?.role, 'user');
    strict_1.default.equal(messages[messages.length - 1]?.content, 'What are my options?');
    strict_1.default.equal(messages.filter((message) => message.content === SYSTEM_PROMPT).length, 1);
});
(0, node_test_1.default)('buildModelMessages preserves prior history as real chat messages', () => {
    const messages = (0, visa_chat_assistant_helpers_1.buildModelMessages)({
        question: 'What should I do next?',
        conversationHistory: [
            { role: 'user', content: 'I want Canada.' },
            { role: 'assistant', content: 'Tell me your budget.' },
        ],
    }, SYSTEM_PROMPT);
    strict_1.default.deepEqual(messages.slice(2, 4), [
        { role: 'user', content: 'I want Canada.' },
        { role: 'assistant', content: 'Tell me your budget.' },
    ]);
});
(0, node_test_1.default)('normalizeConversationHistory removes empty entries and consecutive duplicates', () => {
    const history = (0, visa_chat_assistant_helpers_1.normalizeConversationHistory)([
        { role: 'user', content: '  ' },
        { role: 'user', content: 'Hello' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: ' Hi there ' },
        { role: 'assistant', content: 'Hi there' },
        { role: 'user', content: '\nnext step\n' },
    ]);
    strict_1.default.deepEqual(history, [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
        { role: 'user', content: 'next step' },
    ]);
});
(0, node_test_1.default)('normalizeConversationHistory caps history to the most recent 12 messages', () => {
    const history = (0, visa_chat_assistant_helpers_1.normalizeConversationHistory)(Array.from({ length: 15 }, (_, index) => ({
        role: (index % 2 === 0 ? 'user' : 'assistant'),
        content: `message-${index + 1}`,
    })));
    strict_1.default.equal(history.length, 12);
    strict_1.default.equal(history[0]?.content, 'message-4');
    strict_1.default.equal(history[11]?.content, 'message-15');
});
