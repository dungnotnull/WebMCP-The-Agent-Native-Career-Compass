// Live log of WebMCP tool invocations, rendered by AgentActivityPanel so the
// human always sees what the agent is doing inside the page.

import { createEmitter } from '../lib/emitter';

export type AgentActivityStatus = 'running' | 'ok' | 'error' | 'rejected';

export interface AgentActivityEntry {
  id: string;
  tool: string;
  argsSummary: string;
  resultSummary: string;
  status: AgentActivityStatus;
  at: string;
}

const MAX_ENTRIES = 50;
// Immutable-by-replacement so getActivities() returns a stable reference
// between changes (required by useSyncExternalStore) and a NEW reference
// after each change (so React re-renders).
let entries: AgentActivityEntry[] = [];
const emitter = createEmitter();
let seq = 0;

export function logActivity(entry: Omit<AgentActivityEntry, 'id' | 'at'>): string {
  seq += 1;
  const full: AgentActivityEntry = { ...entry, id: `act-${seq}`, at: new Date().toISOString() };
  entries = [full, ...entries].slice(0, MAX_ENTRIES);
  emitter.emit();
  return full.id;
}

export function updateActivity(id: string, patch: Partial<AgentActivityEntry>): void {
  let found = false;
  const next = entries.map(e => {
    if (e.id === id) {
      found = true;
      return { ...e, ...patch };
    }
    return e;
  });
  if (found) {
    entries = next;
    emitter.emit();
  }
}

export function getActivities(): readonly AgentActivityEntry[] {
  return entries;
}

export function subscribeActivities(listener: () => void) {
  return emitter.subscribe(listener);
}

export function clearActivities(): void {
  entries = [];
  emitter.emit();
}
