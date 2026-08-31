export type TrajectoryEventType =
  | 'run_start'
  | 'agent_start'
  | 'agent_end'
  | 'llm_call'
  | 'tool_call'
  | 'tool_response'
  | 'verification_result'
  | 'repair_retry'
  | 'error'
  | 'run_end';

export interface TrajectoryEvent {
  ts: string;
  type: TrajectoryEventType;
  agent?: string;
  message?: string;
  data?: unknown;
  model?: string;
  usageTokens?: number;
  latencyMs?: number;
}

export interface Trajectory {
  runId: string;
  personaId?: string;
  config?: string;
  startedAt: string;
  events: TrajectoryEvent[];
}

export interface TrajectoryRecorder {
  trajectory: Trajectory;
  log(event: Omit<TrajectoryEvent, 'ts'>): void;
  totalTokens(): number;
}

export function createRecorder(runId: string, personaId?: string, config?: string): TrajectoryRecorder {
  const trajectory: Trajectory = {
    runId,
    personaId,
    config,
    startedAt: new Date().toISOString(),
    events: []
  };
  return {
    trajectory,
    log(event) {
      trajectory.events.push({ ts: new Date().toISOString(), ...event });
    },
    totalTokens() {
      return trajectory.events.reduce((sum, e) => sum + (e.usageTokens || 0), 0);
    }
  };
}
