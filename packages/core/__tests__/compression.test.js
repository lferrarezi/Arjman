import test from 'node:test';
import assert from 'node:assert';
import { buildSystemPrompt, estimateTokens } from '../src/index.js';

test('buildSystemPrompt - normal mode', () => {
  const prompt = buildSystemPrompt(false);
  assert.ok(prompt.includes('Caveman Style'), 'Should contain Caveman Style');
  assert.ok(prompt.includes('Output ONLY'), 'Should emphasize output only');
  assert.ok(!prompt.includes('aggressive acronyms'), 'Should not contain acronyms in normal mode');
});

test('buildSystemPrompt - extreme mode', () => {
  const prompt = buildSystemPrompt(true);
  assert.ok(prompt.includes('Caveman Style'), 'Should contain Caveman Style');
  assert.ok(prompt.includes('aggressive acronyms'), 'Should contain acronyms directive');
  assert.ok(prompt.includes('logical imperatives'), 'Should focus on logical imperatives');
});

test('buildSystemPrompt - preserves language requirement', () => {
  const prompt = buildSystemPrompt(false);
  assert.ok(prompt.includes('Preserve language'), 'Should mention language preservation');
});

test('buildSystemPrompt - concise format', () => {
  const prompt = buildSystemPrompt(false);
  // Verify prompt is reasonably concise (less than 500 chars)
  assert.ok(prompt.length < 500, 'Prompt should be concise for better compression');
});

test('estimateTokens - estimates tokens from text', () => {
  const text = 'Hello world this is a test';
  const tokens = estimateTokens(text);
  assert.ok(tokens > 0, 'Should estimate tokens > 0');
  assert.ok(tokens < 10, 'Should estimate tokens < 10 for short text');
});

test('estimateTokens - returns 0 for empty text', () => {
  const tokens = estimateTokens('');
  assert.strictEqual(tokens, 0, 'Should return 0 for empty text');
});

test('estimateTokens - returns 0 for whitespace-only text', () => {
  const tokens = estimateTokens('   ');
  assert.strictEqual(tokens, 0, 'Should return 0 for whitespace-only text');
});

test('estimateTokens - scales with longer text', () => {
  const shortText = 'test';
  const longText = 'test test test test test test test test test test';
  const shortTokens = estimateTokens(shortText);
  const longTokens = estimateTokens(longText);
  assert.ok(longTokens > shortTokens, 'Longer text should have more tokens');
});

