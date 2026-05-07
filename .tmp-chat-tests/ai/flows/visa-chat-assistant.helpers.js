"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContextBlock = buildContextBlock;
exports.normalizeConversationHistory = normalizeConversationHistory;
exports.buildModelMessages = buildModelMessages;
function buildContextBlock(userContext) {
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
function normalizeConversationHistory(conversationHistory = []) {
    const normalized = conversationHistory
        .map((message) => ({
        role: message.role,
        content: message.content?.trim(),
    }))
        .filter((message) => Boolean(message.content));
    const deduped = [];
    for (const message of normalized) {
        const previous = deduped[deduped.length - 1];
        if (previous && previous.role === message.role && previous.content === message.content) {
            continue;
        }
        deduped.push(message);
    }
    return deduped.slice(-12);
}
function buildModelMessages(input, systemPrompt) {
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
