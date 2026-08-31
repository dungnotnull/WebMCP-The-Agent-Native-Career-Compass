// Minimal synchronous pub/sub shared by the plans store, the agent activity
// log and the approval bridge. Kept dependency-free so it runs in browser,
// server and test environments.

export type Unsubscribe = () => void;

export interface Emitter {
  emit(): void;
  subscribe(listener: () => void): Unsubscribe;
}

export function createEmitter(): Emitter {
  const listeners = new Set<() => void>();
  return {
    emit() {
      for (const listener of listeners) listener();
    },
    subscribe(listener: () => void): Unsubscribe {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
