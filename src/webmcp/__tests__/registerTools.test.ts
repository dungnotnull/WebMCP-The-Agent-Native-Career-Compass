import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TOOL_SCHEMAS } from '../schemas';
import type { HandlerContext } from '../context';

interface CapturedTool {
  name: string;
  title: string;
  description: string;
  inputSchema: unknown;
  annotations?: { readOnlyHint?: boolean };
  execute?: (input: any, client: any) => unknown;
}

function stubModelContext() {
  const captured: CapturedTool[] = [];
  const fake = {
    registerTool: (tool: CapturedTool) => {
      captured.push(tool);
    }
  };
  vi.stubGlobal('document', { modelContext: fake });
  return captured;
}

function stubNavigatorOnly() {
  vi.stubGlobal('document', {});
  vi.stubGlobal('navigator', { modelContext: { registerTool: vi.fn() } });
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const deps = {
  getPageContext: () => ({ activeTab: 'suggest', language: 'en', intakeSummary: null, hasCompletedAnalysis: false, savedPlansCount: 0 }),
  requestPlanApproval: () => Promise.resolve({ approved: false, plan: null as any }),
  requestConfirm: () => Promise.resolve(false)
};

describe('registerWebMcpTools', () => {
  it('registers all 12 tools when document.modelContext exists', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(true);
    expect(result.count).toBe(12);
    expect(captured).toHaveLength(12);
  });

  it('registers via navigator.modelContext as fallback', async () => {
    stubNavigatorOnly();
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(true);
    expect(result.count).toBe(12);
  });

  it('is a no-op when WebMCP is unavailable', async () => {
    vi.stubGlobal('document', {});
    vi.stubGlobal('navigator', {});
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(false);
    expect(result.count).toBe(0);
  });

  it('every registered tool has a name, description, schema and annotations', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    registerWebMcpTools(deps as unknown as HandlerContext);
    for (const tool of captured) {
      expect(tool.name).toMatch(/^[a-z0-9_.-]{1,128}$/);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema).toEqual(TOOL_SCHEMAS[tool.name as keyof typeof TOOL_SCHEMAS]);
    }
    const readOnly = captured.filter(t => t.annotations?.readOnlyHint);
    expect(readOnly.length).toBe(7); // 4 evidence + 3 analysis
  });

  it('registered execute functions invoke the right handler', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    registerWebMcpTools(deps as unknown as HandlerContext);
    const lookup = captured.find(t => t.name === 'lookup_occupation')!;
    const result = await lookup.execute!({ query: 'accountant' }, undefined);
    expect((result as any).ok).toBe(true);
  });
});
