import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldBlockChatSubmit } from './send-guard';

test('blocks duplicate submit while typing', () => {
  assert.equal(shouldBlockChatSubmit('hello', true), true);
});

test('blocks empty input even when not typing', () => {
  assert.equal(shouldBlockChatSubmit('   ', false), true);
});

test('allows non-empty input when not typing', () => {
  assert.equal(shouldBlockChatSubmit('hello', false), false);
});
