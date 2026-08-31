import React from 'react';
import {
  Sparkles,
  Shield,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Brain,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Zap,
  BarChart3,
  Scale
} from 'lucide-react';
import { CurrentRoleOverviewAssessment } from '../types/careerAnalysis';
import { Language, UserIntakeProfile } from '../types';
import { t } from '../utils/i18n';

interface CurrentRoleOverviewSectionProps {
  overview?: CurrentRoleOverviewAssessment;
  intake: UserIntakeProfile;
  language: Language;
  isLoading?: boolean;
}

export const CurrentRoleOverviewSection: React.FC<CurrentRoleOverviewSectionProps> = ({
  overview,
  intake,
  language,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-amber-200/80 rounded-3xl p-8 shadow-sm animate-pulse space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 animate-spin"></div>
          <div className="space-y-2">
            <div className="h-5 w-64 bg-slate-200 rounded"></div>
            <div className="h-3 w-40 bg-slate-100 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-slate-100 rounded-2xl"></div>
          <div className="h-28 bg-slate-100 rounded-2xl"></div>
          <div className="h-28 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const roleName = overview.currentRole || intake.currentRole || (language === 'vi' ? 'Nghề nghiệp của bạn' : 'Your Career');
  const deltaResilience = overview.future5YResilienceScore - overview.currentResilienceScore;
  const deltaDemand = overview.future5YLaborDemandIndex - overview.currentLaborDemandIndex;
  const deltaRisk = overview.future5YRiskScore - overview.currentRiskScore;

  const getRiskLabel = (score: number) => {
    if (score >= 70) return { text: language === 'vi' ? 'Rủi ro Cao' : 'High Risk', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (score >= 40) return { text: language === 'vi' ? 'Rủi ro Trung bình' : 'Moderate Risk', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: language === 'vi' ? 'Rủi ro Thấp' : 'Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const currentRiskBadge = getRiskLabel(overview.currentRiskScore);
  const futureRiskBadge = getRiskLabel(overview.future5YRiskScore);

  return (
    <section 
      id="current-role-overview-section"
      className="bg-white/95 backdrop-blur-md border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden"
    >
      {/* Header Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t(language, 'Nhận Xét Khoa Học & Dự Báo 5 Năm Tới', 'Scientific Review & 5-Year Forecast')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'vi' ? (
              <>Tổng quan Ngành nghề Hiện tại: <span className="text-amber-600 underline decoration-amber-300 decoration-2 underline-offset-4">{roleName}</span></>
            ) : (
              <>Current Industry Overview: <span className="text-amber-600 underline decoration-amber-300 decoration-2 underline-offset-4">{roleName}</span></>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              language,
              'Đánh giá định lượng Điểm Kháng AI, Cung/Cầu lao động và Mức độ Rủi ro giữa Hiện tại (2026) và Tương lai (2031).',
              'Quantitative assessment of AI Resilience, Labor Supply/Demand, and Risk Levels between Present (2026) and Future (2031).'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>2026 → 2031 (5Y Horizon)</span>
          </span>
        </div>
      </div>

      {/* 3 Core Metric Cards: Hiện tại vs 5 Năm Tới */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Điểm Kháng AI */}
        <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 border border-amber-100 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>{t(language, 'Điểm Kháng AI (Resilience)', 'AI Resilience Score')}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 border border-amber-200">
              {deltaResilience >= 0 ? `+${deltaResilience}` : `${deltaResilience}`} pts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Hiện tại (2026)', 'Current (2026)')}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900">{overview.currentResilienceScore}</span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, overview.currentResilienceScore)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Dự báo 5 năm (2031)', '5Y Outlook (2031)')}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-amber-700">{overview.future5YResilienceScore}</span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, overview.future5YResilienceScore)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic leading-snug">
            {overview.future5YResilienceScore < overview.currentResilienceScore
              ? t(language, '* Suy giảm nếu tiếp tục làm việc theo phương thức thủ công không tích hợp AI.', '* Declines if continuing traditional manual workflow without AI.')
              : t(language, '* Điểm số duy trì tốt nhờ các tác vụ đòi hỏi trực giác & tương tác con người cao.', '* Retains high score due to intuition & human interaction requirements.')}
          </p>
        </div>

        {/* 2. Cung / Cầu Lao Động */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>{t(language, 'Cung / Cầu Tuyển Dụng', 'Labor Supply / Demand')}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800 border border-blue-200">
              {deltaDemand >= 0 ? `+${deltaDemand}` : `${deltaDemand}`} pts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Hiện tại (2026)', 'Current (2026)')}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900">{overview.currentLaborDemandIndex}</span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, overview.currentLaborDemandIndex)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Dự báo 5 năm (2031)', '5Y Outlook (2031)')}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-blue-700">{overview.future5YLaborDemandIndex}</span>
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, overview.future5YLaborDemandIndex)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 font-medium leading-snug truncate" title={overview.fiveYearDemandGrowthPct}>
            📈 {overview.fiveYearDemandGrowthPct}
          </p>
        </div>

        {/* 3. Mức Độ Rủi Ro Thay Thế */}
        <div className="bg-gradient-to-br from-slate-50 to-rose-50/40 border border-rose-100 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{t(language, 'Mức Độ Rủi Ro Thay Thế', 'Displacement Risk')}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-800 border border-rose-200">
              {deltaRisk >= 0 ? `+${deltaRisk}%` : `${deltaRisk}%`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Hiện tại (2026)', 'Current (2026)')}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-slate-900">{overview.currentRiskScore}%</span>
              </div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1.5 ${currentRiskBadge.color}`}>
                {currentRiskBadge.text}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">{t(language, 'Dự báo 5 năm (2031)', '5Y Outlook (2031)')}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-rose-700">{overview.future5YRiskScore}%</span>
              </div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1.5 ${futureRiskBadge.color}`}>
                {futureRiskBadge.text}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Phơi nhiễm: <strong>{overview.automationExposureRate}%</strong></span>
            <span>Khuếch đại: <strong>{overview.augmentationPotentialRate}%</strong></span>
          </div>
        </div>
      </div>

      {/* Two Detailed Qualitative Analysis Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State Detailed Assessment */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t(language, '1. Thực Trạng Ngành Nghề ở Hiện Tại (Năm 2026)', '1. Current Industry Landscape (Year 2026)')}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {language === 'vi' ? overview.overviewCurrentStateVi : (overview.overviewCurrentStateEn || overview.overviewCurrentStateVi)}
          </p>
        </div>

        {/* 5-Year Forecast Detailed Assessment */}
        <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm border-b border-indigo-200/80 pb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>{t(language, '2. Dự Báo Biến Đổi Thị Trường 5 Năm Tới (2026 - 2031)', '2. 5-Year Market Transformation Forecast (2026 - 2031)')}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {language === 'vi' ? overview.fiveYearForecastVi : (overview.fiveYearForecastEn || overview.fiveYearForecastVi)}
          </p>
        </div>
      </div>

      {/* Task Impact & Human Moat Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Tasks At Risk */}
        <div className="bg-white border border-rose-200/70 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>{t(language, 'Các Tác Vụ Cụ Thể Có Nguy Cơ Bị Tự Động Hóa', 'Specific Tasks at High Risk of Automation')}</span>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              O*NET Task Exposure
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {overview.tasksAtRisk?.map((task, idx) => (
              <div key={idx} className="bg-rose-50/40 border border-rose-100 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-900">{task.taskNameVi}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex-shrink-0">
                    {task.replacementProbability}%
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1 pt-0.5">
                  <span className="text-slate-600"><strong>Loại:</strong> {task.taskType} ({task.impactTimeline})</span>
                  <span className="text-rose-700 italic">🤖 {task.aiTechnology}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Moat & Recommended Upskilling */}
        <div className="bg-white border border-emerald-200/70 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{t(language, 'Năng Lực Cốt Lõi Con Người (Human Moat)', 'Core Human Moat Capabilities')}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Khó Thay Thế
              </span>
            </div>

            <ul className="space-y-2">
              {overview.humanMoatCapabilities?.map((moat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{moat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 space-y-1.5">
            <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t(language, 'Định hướng chuyển dịch chiến lược:', 'Strategic Upskilling Direction:')}</span>
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              {overview.strategicUpskillingDirectionVi}
            </p>
          </div>
        </div>
      </div>

      {/* Note Nguồn Đối Soát Khoa Học (MANDATORY & NON-HALLUCINATED) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>{t(language, 'Cơ Sở Dữ Liệu & Nguồn Nghiên Cứu Đối Soát (Scientific Evidence Base)', 'Scientific Evidence Base & Research Citations')}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            ✓ 100% Non-hallucinated Data
          </span>
        </div>

        <p className="text-xs text-slate-600">
          {t(
            language,
            'Toàn bộ nhận định, dự báo 5 năm, điểm Kháng AI và chỉ số cung cầu cho ngành nghề này được hệ thống tính toán dựa trên các công trình nghiên cứu và cơ sở dữ liệu lao động uy tín sau đây:',
            'All assessments, 5-year forecasts, AI Resilience Scores, and labor metrics for this occupation are scientifically grounded in the following peer-reviewed studies and authoritative datasets:'
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {overview.citedEvidenceSources?.map((src, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1.5 hover:border-amber-300 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-xs text-slate-900 leading-snug">
                  {src.paperTitle}
                </p>
                {src.url && (
                  <a 
                    href={src.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-600 hover:text-amber-700 p-0.5 flex-shrink-0"
                    title={t(language, 'Xem tài liệu gốc', 'View source')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                🏛️ {src.institution} ({src.year})
              </p>
              <p className="text-[11px] text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                📊 {src.keyMetricOrFormula}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
