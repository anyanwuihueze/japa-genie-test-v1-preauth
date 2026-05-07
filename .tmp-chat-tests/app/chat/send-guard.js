"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldBlockChatSubmit = shouldBlockChatSubmit;
function shouldBlockChatSubmit(input, isTyping) {
    return !input.trim() || isTyping;
}
