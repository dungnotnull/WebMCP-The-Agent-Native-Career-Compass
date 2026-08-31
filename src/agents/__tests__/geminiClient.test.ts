import { describe, it, expect } from 'vitest';
import { parseGeminiJson } from '../geminiClient';

describe('parseGeminiJson', () => {
  it('parses clean JSON', () => {
    expect(parseGeminiJson('[{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it('strips markdown code fences', () => {
    expect(parseGeminiJson('```json\n[{"a":1}]\n```')).toEqual([{ a: 1 }]);
  });

  it('extracts JSON array from surrounding prose', () => {
    expect(parseGeminiJson('Here you go: [{"a":1}] hope it helps')).toEqual([{ a: 1 }]);
  });

  it('extracts JSON object from surrounding prose', () => {
    expect(parseGeminiJson('Result {"a":1} done')).toEqual({ a: 1 });
  });

  it('throws on garbage', () => {
    expect(() => parseGeminiJson('no json here at all')).toThrow();
  });
});