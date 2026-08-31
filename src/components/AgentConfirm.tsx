import { Bot } from 'lucide-react';

interface AgentConfirmProps {
  message: string;
  language: 'vi' | 'en';
  onResolve: (ok: boolean) => void;
}

// Lightweight human-confirmation dialog for agent-initiated workspace edits
// (milestones, progress updates, sharing). Rendered when a WebMCP tool calls
// requestConfirm() and the human must allow or deny the action.
export function AgentConfirm({ message, language, onResolve }: AgentConfirmProps) {
  const labels =
    language === 'vi'
      ? { title: 'AI Agent đang yêu cầu', allow: 'Cho phép', deny: 'Từ chối' }
      : { title: 'AI agent is asking', allow: 'Allow', deny: 'Deny' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-200 bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-amber-700">
          <Bot className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">{labels.title}</span>
        </div>
        <p className="mb-6 text-sm text-slate-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onResolve(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {labels.deny}
          </button>
          <button
            onClick={() => onResolve(true)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            {labels.allow}
          </button>
        </div>
      </div>
    </div>
  );
}
