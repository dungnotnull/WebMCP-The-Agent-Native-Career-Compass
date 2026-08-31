import { useState, useSyncExternalStore } from 'react';
import { Activity, Bot, Trash2, X } from 'lucide-react';
import {
  getActivities, subscribeActivities, clearActivities,
  type AgentActivityEntry
} from '../webmcp/agentActivity';

interface AgentActivityPanelProps {
  language: 'vi' | 'en';
  webmcpStatus: { registered: boolean; count: number };
}

const STATUS_COLORS: Record<string, string> = {
  running: 'bg-blue-400 animate-pulse',
  ok: 'bg-green-500',
  error: 'bg-red-500',
  rejected: 'bg-amber-500'
};

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function EntryRow({ entry }: { entry: AgentActivityEntry }) {
  return (
    <li className="rounded-lg border border-slate-100 p-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${STATUS_COLORS[entry.status] || 'bg-slate-300'}`} />
        <span className="font-mono font-semibold text-slate-700">{entry.tool}</span>
        <span className="ml-auto text-slate-400">{timeOf(entry.at)}</span>
      </div>
      <div className="mt-1 break-all text-slate-500">{entry.argsSummary}</div>
      {entry.resultSummary && <div className="mt-0.5 break-all text-slate-400">{entry.resultSummary}</div>}
    </li>
  );
}

// Live view of what the agent is doing inside La Ban via WebMCP tools.
// Floating button + drawer; badge shows call count while closed.
export function AgentActivityPanel({ language, webmcpStatus }: AgentActivityPanelProps) {
  const [open, setOpen] = useState(false);
  const activities = useSyncExternalStore(subscribeActivities, getActivities);

  const labels =
    language === 'vi'
      ? {
          title: 'Hoạt động AI Agent',
          statusOn: `WebMCP: ${webmcpStatus.count} tools đã đăng ký`,
          statusOff: 'WebMCP chưa khả dụng trên trình duyệt này',
          empty: 'Chưa có hoạt động agent nào trong phiên này.',
          clear: 'Xóa'
        }
      : {
          title: 'AI Agent Activity',
          statusOn: `WebMCP: ${webmcpStatus.count} tools registered`,
          statusOff: 'WebMCP not available in this browser',
          empty: 'No agent activity in this session yet.',
          clear: 'Clear'
        };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-amber-700"
        aria-label={labels.title}
      >
        <Bot className="h-5 w-5" />
        {activities.length > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700">
            {activities.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex max-h-[70vh] w-96 flex-col rounded-xl border border-amber-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-amber-100 p-3">
            <Activity className="h-4 w-4 text-amber-700" />
            <span className="text-sm font-semibold text-slate-700">{labels.title}</span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                webmcpStatus.registered ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {webmcpStatus.registered ? labels.statusOn : labels.statusOff}
            </span>
            <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {activities.length === 0 && <li className="text-xs text-slate-400">{labels.empty}</li>}
            {activities.map(entry => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
          {activities.length > 0 && (
            <div className="border-t border-amber-100 p-2">
              <button
                onClick={clearActivities}
                className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> {labels.clear}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
