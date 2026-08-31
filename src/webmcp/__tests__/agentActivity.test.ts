import { describe, it, expect, vi } from 'vitest';
import { logActivity, updateActivity, getActivities, subscribeActivities, clearActivities } from '../agentActivity';

describe('agentActivity', () => {
  it('logs an entry with generated id and timestamp', () => {
    const id = logActivity({ tool: 'lookup_occupation', argsSummary: 'query=accountant', resultSummary: '', status: 'running' });
    expect(id).toMatch(/^act-/);
    const entries = getActivities();
    expect(entries[0].tool).toBe('lookup_occupation');
    expect(entries[0].at).toBeDefined();
  });

  it('updates status and result summary', () => {
    const id = logActivity({ tool: 'x', argsSummary: '', resultSummary: '', status: 'running' });
    updateActivity(id, { status: 'ok', resultSummary: '2 matches' });
    expect(getActivities()[0].status).toBe('ok');
    expect(getActivities()[0].resultSummary).toBe('2 matches');
  });

  it('keeps at most 50 entries (newest first)', () => {
    clearActivities();
    for (let i = 0; i < 55; i++) {
      logActivity({ tool: `tool-${i}`, argsSummary: '', resultSummary: '', status: 'ok' });
    }
    const entries = getActivities();
    expect(entries.length).toBe(50);
    expect(entries[0].tool).toBe('tool-54');
  });

  it('notifies subscribers', () => {
    const listener = vi.fn();
    subscribeActivities(listener);
    logActivity({ tool: 'x', argsSummary: '', resultSummary: '', status: 'ok' });
    expect(listener).toHaveBeenCalled();
  });
});
