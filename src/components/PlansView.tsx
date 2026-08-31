import { useSyncExternalStore } from 'react';
import { Bot, ClipboardList, Share2, Trash2 } from 'lucide-react';
import {
  listPlans, subscribePlans, updateMilestoneStatus, deletePlan, planProgress,
  type CareerPlan
} from '../lib/plansStore';

interface PlansViewProps {
  language: 'vi' | 'en';
}

function PlanCard({ plan, language }: { plan: CareerPlan; language: 'vi' | 'en' }) {
  const progress = planProgress(plan);
  const labels =
    language === 'vi'
      ? { agentPlan: 'Kế hoạch do AI Agent soạn', youPlan: 'Kế hoạch của bạn', target: 'Mục tiêu', progress: 'Tiến độ', delete: 'Xóa', share: 'Chia sẻ cộng đồng', done: 'Hoàn thành' }
      : { agentPlan: 'Drafted by AI agent', youPlan: 'Your plan', target: 'Target', progress: 'Progress', delete: 'Delete', share: 'Share to community', done: 'Done' };

  const share = async () => {
    if (!window.confirm(`${labels.share}: "${plan.title}"?`)) return;
    await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Ke hoach chuyen nghe: ${plan.title}`,
        content: plan.milestones.map(m => `- [${m.status === 'done' ? 'x' : ' '}] ${m.title}`).join('\n'),
        isAnonymous: true,
        userCurrentRole: plan.fromRole || 'Dang chuyen doi nghe nghiep',
        tag: 'transition_plan'
      })
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">{plan.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {plan.createdBy === 'agent' && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                <Bot className="h-3 w-3" /> {labels.agentPlan}
              </span>
            )}
            {plan.targetOccupation && (
              <span>{labels.target}: <strong>{plan.targetOccupation}</strong></span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={share} className="rounded p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600" title={labels.share}>
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.confirm(`${labels.delete}: "${plan.title}"?`) && deletePlan(plan.id)}
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            title={labels.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{labels.progress}</span>
          <span>{progress.done}/{progress.total} ({progress.percent}%)</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <ul className="space-y-1">
        {plan.milestones.map(m => (
          <li key={m.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={m.status === 'done'}
              onChange={e => updateMilestoneStatus(plan.id, m.id, e.target.checked ? 'done' : 'pending')}
              className="h-4 w-4 accent-amber-600"
            />
            <span className={m.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}>
              {m.week && <span className="mr-1 text-xs text-slate-400">{m.week}</span>}
              {m.title}
            </span>
            {m.resourceUrl && (
              <a href={m.resourceUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-700 underline">
                ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// "My Plans" tab: the human side of the agent-native workspace. Plans the
// agent drafted (and the human approved) live here alongside manual ones.
export function PlansView({ language }: PlansViewProps) {
  const plans = useSyncExternalStore(subscribePlans, listPlans);
  const labels =
    language === 'vi'
      ? { title: 'Kế hoạch chuyển ngành của tôi', subtitle: 'Kế hoạch do AI Agent soạn sẽ xuất hiện đây sau khi bạn duyệt.', empty: 'Chưa có kế hoạch nào. Hỏi AI Agent (trong ChatGPT hoặc Chrome) soạn một kế hoạch 90 ngày cho bạn!' }
      : { title: 'My career transition plans', subtitle: 'Plans drafted by your AI agent appear here after you approve them.', empty: 'No plans yet. Ask your AI agent (in ChatGPT or Chrome) to draft a 90-day plan for you!' };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <ClipboardList className="h-6 w-6 text-amber-600" /> {labels.title}
        </h2>
        <p className="text-sm text-slate-500">{labels.subtitle}</p>
      </div>
      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          {labels.empty}
        </div>
      ) : (
        plans.map(plan => <PlanCard key={plan.id} plan={plan} language={language} />)
      )}
    </div>
  );
}
