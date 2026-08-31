import { Wrench, CheckCircle2, AlertTriangle, Bot, RefreshCw } from 'lucide-react';
import type { Trajectory } from '../agents/trajectory';

const LABELS: Record<string, string> = {
  run_start: 'Bắt đầu pipeline',
  agent_start: 'Agent bắt đầu',
  agent_end: 'Agent hoàn tất',
  llm_call: 'Gọi mô hình',
  tool_call: 'Gọi công cụ tra cứu',
  tool_response: 'Công cụ trả về',
  verification_result: 'Kiểm định chất lượng',
  repair_retry: 'Tự sửa lỗi',
  error: 'Lỗi',
  run_end: 'Kết thúc'
};

function iconFor(type: string) {
  if (type === 'tool_call' || type === 'tool_response') return <Wrench size={14} className="text-amber-600" />;
  if (type === 'verification_result') return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (type === 'repair_retry' || type === 'error') return <AlertTriangle size={14} className="text-red-500" />;
  return <Bot size={14} className="text-indigo-600" />;
}

export default function AgentTransparencyPanel({ trajectory }: { trajectory: Trajectory | null }) {
  if (!trajectory || trajectory.events.length === 0) return null;

  const toolCalls = trajectory.events.filter(e => e.type === 'tool_call').length;
  const verified = trajectory.events.filter(e => e.type === 'verification_result').length;
  const repairs = trajectory.events.filter(e => e.type === 'repair_retry').length;

  return (
    <details className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4" open>
      <summary className="cursor-pointer text-sm font-semibold text-indigo-900 flex items-center gap-2">
        <RefreshCw size={14} /> Quy trình Agent minh bạch (Pipeline Transparency)
      </summary>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-indigo-800">
        <span className="rounded-full bg-white px-3 py-1">Run: {trajectory.runId.slice(0, 18)}</span>
        <span className="rounded-full bg-white px-3 py-1">{toolCalls} lượt tra cứu dữ liệu thật</span>
        {verified > 0 && <span className="rounded-full bg-white px-3 py-1">Kiểm định chất lượng: {verified} lượt</span>}
        {repairs > 0 && <span className="rounded-full bg-white px-3 py-1">Tự sửa lỗi: {repairs} lượt</span>}
      </div>
      <ol className="mt-3 max-h-72 space-y-1 overflow-y-auto text-xs text-slate-700">
        {trajectory.events.map((e, i) => (
          <li key={i} className="flex items-start gap-2 rounded-md bg-white/70 px-2 py-1">
            <span className="mt-0.5">{iconFor(e.type)}</span>
            <span className="font-medium">{LABELS[e.type] || e.type}{e.agent ? ` · ${e.agent}` : ''}</span>
            {e.message && <span className="text-slate-500">— {e.message}</span>}
            {typeof e.data === 'object' && e.data !== null && (e.type === 'tool_call' || e.type === 'verification_result') && (
              <code className="ml-auto max-w-[45%] truncate text-[10px] text-slate-400">{JSON.stringify(e.data).slice(0, 120)}</code>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}