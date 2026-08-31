import { useState } from 'react';
import { Bot, Check, Plus, Trash2, X } from 'lucide-react';
import type { CareerPlan, PlanMilestone } from '../lib/plansStore';
import type { PlanApprovalResult } from '../webmcp/approval';

interface PlanApprovalModalProps {
  draft: CareerPlan;
  language: 'vi' | 'en';
  onResolve: (result: PlanApprovalResult) => void;
}

// Human-in-the-loop gate for save_career_plan: the agent's draft is fully
// editable here, and only what the human approves gets persisted.
export function PlanApprovalModal({ draft, language, onResolve }: PlanApprovalModalProps) {
  const [title, setTitle] = useState(draft.title);
  const [milestones, setMilestones] = useState<PlanMilestone[]>(draft.milestones);
  const [newTitle, setNewTitle] = useState('');

  const labels =
    language === 'vi'
      ? {
          header: 'AI Agent vừa soạn một kế hoạch cho bạn',
          subheader: 'Xem lại, chỉnh sửa rồi duyệt — chỉ kế hoạch bạn duyệt mới được lưu.',
          titleLabel: 'Tên kế hoạch',
          milestonesLabel: 'Các cột mốc',
          addPlaceholder: 'Thêm cột mốc mới...',
          add: 'Thêm',
          approve: 'Duyệt & Lưu',
          reject: 'Từ chối',
          empty: 'Kế hoạch chưa có cột mốc nào.'
        }
      : {
          header: 'Your AI agent drafted a plan',
          subheader: 'Review and edit it — only what you approve gets saved.',
          titleLabel: 'Plan title',
          milestonesLabel: 'Milestones',
          addPlaceholder: 'Add a new milestone...',
          add: 'Add',
          approve: 'Approve & Save',
          reject: 'Reject',
          empty: 'This plan has no milestones yet.'
        };

  const updateMilestone = (id: string, patch: Partial<PlanMilestone>) => {
    setMilestones(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)));
  };

  const addMilestone = () => {
    const value = newTitle.trim();
    if (!value) return;
    setMilestones(prev => [...prev, { id: `edit-ms-${Date.now()}`, title: value, status: 'pending' }]);
    setNewTitle('');
  };

  const approve = () => {
    onResolve({
      approved: true,
      plan: { ...draft, title: title.trim() || draft.title, milestones }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-amber-200 bg-white shadow-xl">
        <div className="border-b border-amber-100 p-5">
          <div className="mb-1 flex items-center gap-2 text-amber-700">
            <Bot className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">{labels.header}</span>
          </div>
          <p className="text-xs text-slate-500">{labels.subheader}</p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">{labels.titleLabel}</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {draft.rationale && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{draft.rationale}</div>
          )}

          {draft.citations && draft.citations.length > 0 && (
            <div className="space-y-1">
              {draft.citations.map(c => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-amber-700 underline"
                >
                  {c.title}
                </a>
              ))}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-500">{labels.milestonesLabel}</label>
            <div className="space-y-2">
              {milestones.length === 0 && <p className="text-xs text-slate-400">{labels.empty}</p>}
              {milestones.map(m => (
                <div key={m.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2">
                  <div className="flex-1">
                    <input
                      value={m.title}
                      onChange={e => updateMilestone(m.id, { title: e.target.value })}
                      className="w-full rounded border border-transparent px-1 py-0.5 text-sm hover:border-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="mt-1 flex gap-2 text-xs text-slate-400">
                      <input
                        value={m.week || ''}
                        onChange={e => updateMilestone(m.id, { week: e.target.value })}
                        placeholder="Week"
                        className="w-20 rounded border border-slate-200 px-1 py-0.5"
                      />
                      <input
                        value={m.resourceUrl || ''}
                        onChange={e => updateMilestone(m.id, { resourceUrl: e.target.value })}
                        placeholder="Resource URL"
                        className="flex-1 rounded border border-slate-200 px-1 py-0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove milestone"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMilestone()}
                placeholder={labels.addPlaceholder}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={addMilestone}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" /> {labels.add}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-amber-100 p-4">
          <button
            onClick={() => onResolve({ approved: false, plan: draft })}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" /> {labels.reject}
          </button>
          <button
            onClick={approve}
            className="flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            <Check className="h-4 w-4" /> {labels.approve}
          </button>
        </div>
      </div>
    </div>
  );
}
