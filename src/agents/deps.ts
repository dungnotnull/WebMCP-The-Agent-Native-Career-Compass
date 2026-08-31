import { callGeminiRich, callGeminiContents, type LlmResult, type ContentsResult, type LlmCallOptions } from './geminiClient';
import { executeToolCall, type ToolResult } from './tools';

export type CallRichFn = (prompt: string, opts?: LlmCallOptions) => Promise<LlmResult>;
export type CallContentsFn = (contents: any[], opts?: LlmCallOptions) => Promise<ContentsResult>;
export type ExecuteToolFn = (name: string, args: Record<string, unknown>) => Promise<ToolResult>;

export interface AgentDeps {
  callRich: CallRichFn;
  callContents: CallContentsFn;
  executeTool: ExecuteToolFn;
}

export const REAL_DEPS: AgentDeps = {
  callRich: callGeminiRich,
  callContents: callGeminiContents,
  executeTool: executeToolCall
};
