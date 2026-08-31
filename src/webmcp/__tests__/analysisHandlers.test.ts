import { describe, it, expect, vi, afterEach } from 'vitest';
import type { HandlerContext } from '../context';
import { analyzeCareerTransitionHandler, compareOccupationsHandler, getOccupationNewsHandler } from '../handlers/analysis';

const ctx: HandlerContext = {
  getPageContext: () => ({ activeTab: 'suggest', language: 'en', intakeSummary: null, hasCompletedAnalysis: false, savedPlansCount: 0 }),
  requestPlanApproval: () => Promise.resolve({ approved: false, plan: null as any }),
  requestConfirm: () => Promise.resolve(false)
};

function stubFetch(handler: (url: string, init?: RequestInit) => unknown) {
  const mock = vi.fn((url: string, init?: RequestInit) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(handler(url, init))
    } as Response)
  );
  vi.stubGlobal('fetch', mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('analyze_career_transition', () => {
  it('posts the intake profile to the pipeline', async () => {
    const mock = stubFetch(() => ({ result: { suggestions: [] }, trajectory: { steps: [] } }));
    const result = await analyzeCareerTransitionHandler(
      { current_role: 'warehouse keeper', experience_years: 5, location: 'Hai Phong' },
      ctx
    );
    expect(result.ok).toBe(true);
    const [url, init] = mock.mock.calls[0];
    expect(url).toBe('/api/agent/career-analyze');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.intakeProfile.currentRole).toBe('warehouse keeper');
    expect(body.intakeProfile.experienceYears).toBe(5);
  });

  it('degrades gracefully when the pipeline is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({ error: 'x' }) } as Response)));
    const result = await analyzeCareerTransitionHandler({ current_role: 'accountant' }, ctx);
    expect(result.ok).toBe(false);
    expect(result.note).toContain('evidence tools');
  });

  it('rejects empty role', async () => {
    const result = await analyzeCareerTransitionHandler({ current_role: '' }, ctx);
    expect(result.ok).toBe(false);
  });
});

describe('compare_occupations', () => {
  it('returns matches for each requested occupation', async () => {
    const result = await compareOccupationsHandler({ occupations: ['accountant', 'graphic designer'] }, ctx);
    expect(result.ok).toBe(true);
    const data = result.data as any[];
    expect(data).toHaveLength(2);
    expect(data[0].query).toBe('accountant');
  });
});

describe('get_occupation_news', () => {
  it('filters the news feed by role keywords', async () => {
    stubFetch(() => ({
      source: 'test',
      news: [
        { id: 'n1', title: 'AI in accounting firms', affectedFields: ['Tai chinh'], summaryVi: 'Ke toan', url: 'https://example.com/1', publishDate: '2026-08-01' },
        { id: 'n2', title: 'Factory robots', affectedFields: ['San xuat'], summaryVi: 'Cong nhan', url: 'https://example.com/2', publishDate: '2026-08-02' }
      ]
    }));
    const result = await getOccupationNewsHandler({ role: 'accountant' }, ctx);
    expect(result.ok).toBe(true);
    const news = result.data as any[];
    expect(news.some(n => n.id === 'n1')).toBe(true);
    expect(news.some(n => n.id === 'n2')).toBe(false);
  });
});
