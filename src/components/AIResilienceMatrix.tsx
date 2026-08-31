import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Filter,
  TrendingDown,
  Info,
  HelpCircle,
  ArrowRight,
  Briefcase,
  Layers,
  ExternalLink,
  BookOpen,
  Target
} from 'lucide-react';
import { CareerSuggestion, Language, TaskDecompositionItem, UserIntakeProfile, ResilienceScoreDetail } from '../types';
import { CurrentRoleOverviewAssessment } from '../types/careerAnalysis';
import { getResilienceDetailForRole } from '../data/vietnamOccupations';
import { t } from '../utils/i18n';

interface AIResilienceMatrixProps {
  suggestion?: CareerSuggestion;
  intakeProfile?: UserIntakeProfile;
  currentRoleOverview?: CurrentRoleOverviewAssessment;
  currentDetail?: any;
  language: Language;
  onNavigateTab?: (tabId: string) => void;
}

export const AIResilienceMatrix: React.FC<AIResilienceMatrixProps> = ({
  suggestion,
  intakeProfile,
  currentRoleOverview,
  currentDetail,
  language,
  onNavigateTab
}) => {
  // Role perspective selector: 'target' (Nghề đề xuất mục tiêu) or 'current' (Nghề hiện tại của bạn)
  const [selectedRoleView, setSelectedRoleView] = useState<'current' | 'target'>('current');
  const [filterType, setFilterType] = useState<'all' | 'automated' | 'augmented' | 'human_core'>('all');

  // Determine current role vs target suggestion details
  const currentRoleName = intakeProfile?.currentRole || 'Nghề hiện tại của bạn';
  const targetRoleName = (language === 'vi' ? suggestion?.roleTitleVi : suggestion?.roleTitle) || 'Lộ trình chuyển đổi AI';

  // 1. Current Role Resilience Detail
  const currentRoleResilience: ResilienceScoreDetail = getResilienceDetailForRole(currentRoleName, intakeProfile);

  // 2. Target Role Resilience Detail
  const targetRoleResilience: ResilienceScoreDetail = (
    suggestion?.resilienceDetail ||
    getResilienceDetailForRole(suggestion?.roleTitleVi || suggestion?.roleTitle || targetRoleName, intakeProfile)
  );

  // Active detail based on toggle
  const activeDetail: ResilienceScoreDetail = selectedRoleView === 'current'
    ? currentRoleResilience
    : targetRoleResilience;

  // Composite Scores
  const compositeScore = selectedRoleView === 'current'
    ? (currentRoleOverview?.currentResilienceScore ?? activeDetail.overallResilienceScore ?? 58)
    : (suggestion?.aiResilienceScore ?? activeDetail.overallResilienceScore ?? 88);

  const exposureRate = selectedRoleView === 'current'
    ? (currentRoleOverview?.automationExposureRate ?? activeDetail.automationRiskScore ?? 68)
    : (activeDetail.automationRiskScore ?? 25);

  const augmentationPotential = selectedRoleView === 'current'
    ? (currentRoleOverview?.augmentationPotentialRate ?? activeDetail.augmentationPotentialScore ?? 75)
    : (activeDetail.augmentationPotentialScore ?? 92);

  const defensibleHumanScore = activeDetail.defensibleHumanScore ?? Math.max(10, 100 - exposureRate);

  // Build task decomposition dynamically
  let tasks: TaskDecompositionItem[] = [];

  if (Array.isArray(activeDetail.tasksBreakdown) && activeDetail.tasksBreakdown.length > 0) {
    tasks = activeDetail.tasksBreakdown.map((tb, i) => {
      const isAuto = tb.exposureType === 'direct_automation' || tb.exposurePercentage >= 70;
      const isAugment = tb.exposureType === 'ai_augmentation' || (tb.exposurePercentage >= 35 && tb.exposurePercentage < 70);
      const category: 'automated' | 'augmented' | 'human_core' = isAuto ? 'automated' : isAugment ? 'augmented' : 'human_core';

      let aiTools = ['Công cụ AI chuyên ngành'];
      if (isAuto) {
        aiTools = ['Agentic Workflow', 'OCR & Document AI', 'LLM Code/Text Generator'];
      } else if (isAugment) {
        aiTools = ['AI Copilot', 'Prompt Template Engine', 'RAG Retrieval System'];
      } else {
        aiTools = ['Notion AI Notes / Audio Summarizer'];
      }

      return {
        taskId: `tb-${i}-${tb.onetCode || i}`,
        taskNameVi: tb.taskNameVi || tb.taskName,
        category,
        exposureRate: tb.exposurePercentage,
        aiToolSubstitutes: aiTools,
        humanMoatExplanationVi: tb.notes || (language === 'vi' ? 'Đòi hỏi sự thấu hiểu sâu sắc bối cảnh thực tế tại Việt Nam.' : 'Requires local domain intuition and strategic empathy.')
      };
    });
  } else if (Array.isArray(activeDetail.taskDecomposition) && activeDetail.taskDecomposition.length > 0) {
    tasks = activeDetail.taskDecomposition;
  } else {
    // Dynamic Fallback
    tasks = [
      {
        taskId: 't-1',
        taskNameVi: `Xử lý tài liệu & tác vụ hành chính chuẩn hóa của ${activeDetail.occupationTitleVi}`,
        category: 'automated',
        exposureRate: exposureRate,
        aiToolSubstitutes: ['AI Automation Tools', 'Gemini Workspace Assistant'],
        humanMoatExplanationVi: 'Các tác vụ lặp lại được AI xử lý với tốc độ và chi phí tối ưu hơn nhiều lần.'
      },
      {
        taskNameVi: `Phân tích dữ liệu, tạo đề xuất & tối ưu luồng phối hợp`,
        taskId: 't-2',
        category: 'augmented',
        exposureRate: Math.round((exposureRate + defensibleHumanScore) / 2),
        aiToolSubstitutes: ['AI Copilot', 'Data Intelligence Tools'],
        humanMoatExplanationVi: 'AI là đòn bẩy gia tăng năng suất từ 3-5 lần khi nhân sự có tư duy điều phối tốt.'
      },
      {
        taskId: 't-3',
        taskNameVi: `Đàm phán chiến lược, giải quyết mâu thuẫn & chịu trách nhiệm ra quyết định`,
        category: 'human_core',
        exposureRate: Math.round(100 - defensibleHumanScore),
        aiToolSubstitutes: ['Trợ lý ghi chép cuộc họp AI'],
        humanMoatExplanationVi: '100% thuộc về năng lực thấu cảm, đạo đức nghề nghiệp và xây dựng lòng tin.'
      }
    ];
  }

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.category === filterType;
  });

  const getExposureBadge = (exposure: number) => {
    if (exposure >= 70) return { label: language === 'vi' ? 'Rủi ro cao' : 'High Risk', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (exposure >= 40) return { label: language === 'vi' ? 'Trung bình' : 'Moderate', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: language === 'vi' ? 'An toàn cao' : 'High Moat', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-6">
      {/* Role Perspective Switcher Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              {t(language, 'Chọn Góc Nhìn Phân Tích Tác Vụ', 'Select Analysis Perspective')}
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{selectedRoleView === 'current' ? `👤 ${currentRoleName}` : `🎯 ${targetRoleName}`}</span>
            </div>
          </div>
        </div>

        {/* Toggle Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setSelectedRoleView('current')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedRoleView === 'current'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>{t(language, `Nghề Hiện Tại (${currentRoleName})`, `Current Role (${currentRoleName})`)}</span>
          </button>
          <button
            onClick={() => setSelectedRoleView('target')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedRoleView === 'target'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t(language, `Nghề Đề Xuất (${targetRoleName})`, `Target Path (${targetRoleName})`)}</span>
          </button>
        </div>
      </div>

      {/* Header & Score Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Ma Trận Phân Rã Tác Vụ O*NET & Điểm Kháng AI' : 'O*NET Task Decomposition & AI Resilience Matrix'}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {language === 'vi'
                ? `Đang hiển thị phân rã tác vụ thực tế cho [${activeDetail.occupationTitleVi || currentRoleName}]. Bóc tách từng nhiệm vụ cụ thể để phân định phần nào AI tự động hóa và phần nào con người nắm giữ lợi thế cạnh tranh.`
                : `Task-level decomposition for [${activeDetail.occupationTitleVi || currentRoleName}]. Standardized under O*NET 28.1 & ILO methodology.`}
            </p>
            {/* Standards & Classification codes */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeDetail.onetCode && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  O*NET: {activeDetail.onetCode}
                </span>
              )}
              {activeDetail.molisaCode && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  MOLISA: {activeDetail.molisaCode}
                </span>
              )}
              {activeDetail.vietnamDemandSignal && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  activeDetail.vietnamDemandSignal === 'high_growth'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : activeDetail.vietnamDemandSignal === 'declining'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {activeDetail.vietnamDemandSignal === 'high_growth'
                    ? 'Tín hiệu tuyển dụng: Tăng trưởng mạnh'
                    : activeDetail.vietnamDemandSignal === 'declining'
                    ? 'Tín hiệu tuyển dụng: Thu hẹp cơ học'
                    : 'Tín hiệu tuyển dụng: Chuyển dịch kỹ năng'}
                </span>
              )}
            </div>
          </div>

          {/* Big Composite Score Ring */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {t(language, 'Điểm Kháng AI Tổng Hợp', 'Composite AI Resilience')}
              </span>
              <div className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                {compositeScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs bg-white ${
              compositeScore >= 75
                ? 'border-emerald-500 text-emerald-700'
                : compositeScore >= 50
                ? 'border-amber-500 text-amber-800'
                : 'border-rose-500 text-rose-700'
            }`}>
              {compositeScore}%
            </div>
          </div>
        </div>

        {/* 3 Component Metric Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Direct Automation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {t(language, 'Tỷ lệ Tác vụ Bị Tự Động Hóa', 'Automated Tasks Ratio')}
              </span>
              <span className="font-extrabold text-rose-600">{exposureRate}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, exposureRate))}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500">{t(language, 'Các tác vụ lặp lại, nhập liệu, xử lý văn bản quy chuẩn.', 'Repetitive tasks, standard data entry and formatting.')}</p>
          </div>

          {/* AI Augmentation Potential */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {t(language, 'Tiềm năng Tăng Cường (AI Boost)', 'AI Augmentation Potential')}
              </span>
              <span className="font-extrabold text-indigo-700">{augmentationPotential}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, augmentationPotential))}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500">{t(language, 'Tác vụ tăng tốc năng suất 3-5x khi kết hợp công cụ AI tiên tiến.', 'Tasks accelerating productivity 3-5x when combining AI.')}</p>
          </div>

          {/* Defensible Human Bottleneck */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                {t(language, 'Thế Mạnh Độc Quyền Con Người', 'Defensible Human Strength')}
              </span>
              <span className="font-extrabold text-emerald-700">{defensibleHumanScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, defensibleHumanScore))}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500">{t(language, 'Thấu cảm văn hóa Việt Nam, thẩm định đạo đức và đàm phán quan hệ.', 'Cultural empathy, ethical judgment, and relationships.')}</p>
          </div>
        </div>

        {/* Human Advantage Core Capabilities */}
        {activeDetail.humanAdvantageCore && activeDetail.humanAdvantageCore.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              🛡️ {t(language, 'Năng lực cốt lõi con người (Human Moat Factor) của vai trò này:', 'Defensible Human Moat Capabilities:')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeDetail.humanAdvantageCore.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Decomposition Grid & Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t(language, `Chi Tiết Phân Tích Từng Tác Vụ Công Việc (${filteredTasks.length} tác vụ)`, `Detailed Analysis of Each Task (${filteredTasks.length} tasks)`)}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t(language, 'Dữ liệu đối soát tiêu chuẩn O*NET Task ID & Báo cáo ILO / OpenAI 2024-2026', 'Standardized against O*NET Task ID & ILO / OpenAI Research')}
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: t(language, 'Tất cả', 'All') },
              { id: 'automated', label: t(language, 'Tự động hóa cao', 'Highly Automated') },
              { id: 'augmented', label: t(language, 'AI Tăng cường', 'AI Augmented') },
              { id: 'human_core', label: t(language, 'Thế mạnh con người', 'Human Core') }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, idx) => {
            const isAuto = task.category === 'automated';
            const isAugment = task.category === 'augmented';
            const isHuman = task.category === 'human_core';

            return (
              <div
                key={task.taskId || idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isAuto
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isAugment
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isAuto ? t(language, 'Tự Động Hóa', 'Automated') : isAugment ? t(language, 'AI Hỗ Trợ', 'AI Augmented') : t(language, 'Thế Mạnh Con Người', 'Human Core')}
                    </span>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs font-black ${
                        isAuto ? 'text-rose-600' : isAugment ? 'text-indigo-600' : 'text-emerald-700'
                      }`}>{task.exposureRate}%</span>
                      <span className="text-[10px] text-slate-400 block">{t(language, 'mức độ rủi ro', 'risk level')}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {task.taskNameVi}
                  </h4>
                </div>

                <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-200">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">{t(language, 'Công nghệ AI: ', 'AI Tech: ')}</span>
                    {(task.aiToolSubstitutes || ['Agentic workflow']).join(', ')}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-emerald-800">{t(language, 'Giá trị con người: ', 'Human Moat: ')}</span>
                    {task.humanMoatExplanationVi || t(language, 'Đòi hỏi sự đồng cảm và ra quyết định chiến lược.', 'Requires empathy and decision making.')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Citations / Research Grounding List */}
        {activeDetail.sources && activeDetail.sources.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{t(language, 'Cơ sở dữ liệu nghiên cứu & nguồn đối soát khoa học:', 'Scientific Evidence Citations & Research Grounding:')}</span>
            </div>
            <div className="space-y-1.5">
              {activeDetail.sources.map((s, i) => (
                <div key={i} className="text-[11px] text-slate-600 flex items-start justify-between gap-2">
                  <span>• {s.citationText}</span>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 flex-shrink-0"
                    >
                      <span>Xem nguồn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to Trajectories */}
        {onNavigateTab && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {language === 'vi'
                ? 'Muốn xem mức độ ảnh hưởng của AI đến thu nhập trong 5 năm tới?'
                : 'Want to simulate how AI impacts your 5-year salary projection?'}
            </div>
            <button
              onClick={() => onNavigateTab('trajectories')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <span>{t(language, 'Tiếp Tục Giả Lập 3 Lộ Trình Lương', 'Continue to Salary Trajectory Sim')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
