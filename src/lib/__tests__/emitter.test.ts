import { describe, it, expect, vi } from 'vitest';
import { createEmitter } from '../emitter';

describe('createEmitter', () => {
  it('notifies subscribers on emit', () => {
    const emitter = createEmitter();
    const listener = vi.fn();
    emitter.subscribe(listener);
    emitter.emit();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications', () => {
    const emitter = createEmitter();
    const listener = vi.fn();
    const unsubscribe = emitter.subscribe(listener);
    unsubscribe();
    emitter.emit();
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers', () => {
    const emitter = createEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.subscribe(a);
    emitter.subscribe(b);
    emitter.emit();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
