import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const CANDIDATE_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.API_KEY,
  process.env.GEMINI_API_KEY_FALLBACK
].filter(Boolean) as string[];

export const PRIMARY_GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

export interface LlmCallOptions {
  systemInstruction?: string;
  tools?: any[];
  temperature?: number;
  /** JSON response mode; defaults to true when no tools are passed (legacy behavior). */
  jsonMode?: boolean;
}

export interface LlmResult {
  text: string;
  model: string;
  usageTokens: number;
  latencyMs: number;
}

export interface ContentsResult extends LlmResult {
  functionCalls?: { name: string; args: Record<string, unknown> }[];
}

function effectiveJsonMode(opts: LlmCallOptions): boolean {
  return opts.jsonMode === undefined ? !opts.tools : opts.jsonMode;
}

/** Low-level: send arbitrary contents (multi-turn / function calling). */
export async function callGeminiContents(contents: any[], opts: LlmCallOptions = {}): Promise<ContentsResult> {
  let lastError: any = null;

  if (CANDIDATE_KEYS.length === 0) {
    throw new Error('No Gemini API key configured in environment');
  }

  for (const apiKey of CANDIDATE_KEYS) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const modelsToTry = [PRIMARY_GEMINI_MODEL, ...FALLBACK_MODELS];

      for (const model of modelsToTry) {
        const startedAt = Date.now();
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              responseMimeType: effectiveJsonMode(opts) ? 'application/json' : undefined,
              temperature: opts.temperature ?? 0.2,
              systemInstruction: opts.systemInstruction,
              tools: opts.tools
            }
          });
          const text = (response.text || '').toString();
          const functionCalls = (response.candidates?.[0]?.content?.parts || [])
            .filter((p: any) => typeof p.functionCall === 'object' && p.functionCall !== null)
            .map((p: any) => ({ name: p.functionCall.name as string, args: (p.functionCall.args || {}) as Record<string, unknown> }));
          if (response && (text || functionCalls.length > 0)) {
            return {
              text,
              functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
              model,
              usageTokens: response.usageMetadata?.totalTokenCount || 0,
              latencyMs: Date.now() - startedAt
            };
          }
        } catch (err: any) {
          lastError = err;
          const errMsg = (err?.message || '').toLowerCase();
          // If error is 403 / denied for this key, break inner loop to try next key immediately
          if (errMsg.includes('denied') || errMsg.includes('403') || errMsg.includes('permission_denied')) {
            break;
          }
        }
      }
    } catch (outerErr: any) {
      lastError = outerErr;
    }
  }

  throw lastError || new Error('All Gemini model invocations failed');
}

/** Single-turn convenience wrapper returning rich metadata. */
export async function callGeminiRich(prompt: string, opts: LlmCallOptions = {}): Promise<LlmResult> {
  const result = await callGeminiContents([{ role: 'user', parts: [{ text: prompt }] }], opts);
  return { text: result.text, model: result.model, usageTokens: result.usageTokens, latencyMs: result.latencyMs };
}

/** Legacy-compatible wrapper (returns text only) — same signature as the old server.ts function. */
export async function callGeminiDirect(prompt: string, systemInstruction?: string, tools?: any[]): Promise<string> {
  return (await callGeminiRich(prompt, { systemInstruction, tools })).text;
}

export function parseGeminiJson<T = any>(rawText: string): T {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1));
    }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw e;
  }
}

export { Type };