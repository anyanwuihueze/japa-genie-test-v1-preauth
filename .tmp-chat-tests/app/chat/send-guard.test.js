"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const send_guard_1 = require("./send-guard");
(0, node_test_1.default)('blocks duplicate submit while typing', () => {
    strict_1.default.equal((0, send_guard_1.shouldBlockChatSubmit)('hello', true), true);
});
(0, node_test_1.default)('blocks empty input even when not typing', () => {
    strict_1.default.equal((0, send_guard_1.shouldBlockChatSubmit)('   ', false), true);
});
(0, node_test_1.default)('allows non-empty input when not typing', () => {
    strict_1.default.equal((0, send_guard_1.shouldBlockChatSubmit)('hello', false), false);
});
