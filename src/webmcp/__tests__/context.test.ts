import { describe, it, expect } from 'vitest';
import { withActivityLog } from '../context';
import { getActivities } from '../agentActivity';

describe('withActivityLog', () => {
  it('logs success results with status ok', async () => {
    const result = await withActivityLog('lookup_occupation', { query: 'accountant' }, () =>
      Promise.resolve({ ok: true, data: [1, 2], note: undefined })
    );
    expect(result.ok).toBe(true);
    const last = getActivities()[0];
    expect(last.tool).toBe('lookup_occupation');
    expect(last.status).toBe('ok');
    expect(last.argsSummary).toContain('accountant');
  });

  it('captures thrown errors as ok:false results', async () => {
    const result = await withActivityLog('broken_tool', {}, () => {
      throw new Error('boom');
    });
    expect(result.ok).toBe(false);
    expect(result.note).toContain('boom');
    expect(getActivities()[0].status).toBe('error');
  });

  it('marks not-ok results as error status', async () => {
    await withActivityLog('failing_tool', {}, () => ({ ok: false, data: null, note: 'unavailable' }));
    expect(getActivities()[0].status).toBe('error');
    expect(getActivities()[0].resultSummary).toBe('unavailable');
  });
});
