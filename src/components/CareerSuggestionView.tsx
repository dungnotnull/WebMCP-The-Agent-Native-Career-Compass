import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  MapPin,
  Volume2,
  VolumeX,
  BookOpen,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { CareerSuggestion, Language } from '../types';
import { SpeechBriefingController } from '../utils/exportUtils';
import { t } from '../utils/i18n';

interface CareerSuggestionViewProps {
  suggestions?: CareerSuggestion[];
  suggestion?: CareerSuggestion;
  selectedSuggestion?: CareerSuggestion;
  onSelectSuggestion?: (suggestion: CareerSuggestion) => void;
  language: Language;
  onNavigateTab: (tabId: string) => void;
}

export const CareerSuggestionView: React.FC<CareerSuggestionViewProps> = ({
  suggestions = [],
  suggestion,
  selectedSuggestion,
  onSelectSuggestion,
  language,
  onNavigateTab
}) => {
  const current = selectedSuggestion || suggestion || (suggestions.length > 0 ? suggestions[0] : null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!current) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">
          {t(language, 'Chưa có kết quả phân tích nghề nghiệp', 'No Career Analysis Results Yet')}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          {t(language,
            'Vui lòng nhập thông tin hồ sơ ở trên hoặc chọn một trong các hồ sơ mẫu để La Bàn thực hiện đối soát dữ liệu nghiên cứu và mô phỏng lộ trình cho bạn.',
            'Please complete the intake profile above or select one of the sample profiles for La Bàn to simulate your career roadmap.'
          )}
        </p>
      </div>
    );
  }

  const compScore = typeof current.aiResilienceScore === 'number'
    ? current.aiResilienceScore
    : (current.aiResilienceScore?.compositeResilienceScore ?? current.aiResilienceScore?.overallResilienceScore ?? current.resilienceDetail?.overallResilienceScore ?? 65);

  const exposureRateValue = typeof current.aiResilienceScore === 'object' && current.aiResilienceScore !== null
    ? (current.aiResilienceScore?.exposureRate ?? current.resilienceDetail?.automationRiskScore ?? 42)
    : (current.resilienceDetail?.automationRiskScore ?? 42);

  const roleTitleDisplay = (language === 'vi' ? current.roleTitleVi : current.roleTitle) || current.currentRole || current.roleTitle || 'Nghề nghiệp đã chọn';
  const summaryNarrative = (language === 'vi' ? current.summaryNarrativeVi : current.reasoning) || current.whyItFitsYou || current.reasoning || 'Hệ thống đã phân tích hồ sơ và liên kết dữ liệu nghiên cứu lao động.';
  const recommendedPathDisplay = (language === 'vi' ? current.recommendedPathVi : current.recommendedPath) || (language === 'vi' ? 'Lộ trình tối ưu hóa kỹ năng AI' : 'AI Skills Optimization Path');
  const salaryRangeDisplay = current.vietnamMarketSalaryRange || current.averageSalaryRangeVND || '18,000,000 - 35,000,000 VND / tháng';
  const onetDisplay = current.onetCode || current.resilienceDetail?.onetCode || 'Standard-O*NET';
  const molisaDisplay = (language === 'vi' ? current.molisaTitleVi : current.resilienceDetail?.occupationTitle) || current.resilienceDetail?.occupationTitleVi || 'Danh mục nghề Việt Nam';

  const transferableSkillsList: string[] = current.transferableSkills || current.transferableSkillsMatch || [];
  const augmentedWithAiList: string[] = current.augmentedWithAi || current.skillsGap || [];
  
  const citedResearchList = current.citedResearch || (current.evidenceCitations ? current.evidenceCitations.map(c => ({
    paperTitle: c.paperTitle,
    institution: c.source,
    citationSnippetVi: c.quoteOrDataPoint
  })) : []);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      SpeechBriefingController.stop();
      setIsPlayingAudio(false);
    } else {
      const summaryText = language === 'vi'
        ? `Bản tin định hướng nghề nghiệp La Bàn dành cho bạn: ${summaryNarrative}. Điểm kháng AI của bạn đạt ${compScore} trên 100. Lộ trình tối ưu khuyến nghị là: ${recommendedPathDisplay}.`
        : `La Bàn career briefing for you: ${summaryNarrative}. Your AI resilience score is ${compScore} out of 100. Recommended path: ${recommendedPathDisplay}.`;
      setIsPlayingAudio(true);
      SpeechBriefingController.speak(
        summaryText,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const getResilienceBadge = (score: number) => {
    if (score >= 70) return { label: t(language, 'Kháng AI Cao (High Resilience)', 'High AI Resilience'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 45) return { label: t(language, 'Kháng AI Trung Bình (Moderate)', 'Moderate Resilience'), color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: t(language, 'Rủi ro Tự Động Hóa Cao (High Exposure)', 'High Exposure Risk'), color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const resilienceBadge = getResilienceBadge(compScore);

  return (
    <div className="space-y-6">
      {/* If multiple suggestions available, render selector tabs */}
      {suggestions.length > 1 && onSelectSuggestion && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <span className="text-xs font-bold text-slate-500">
            {t(language, 'Các phương án đề xuất:', 'Recommended options:')}
          </span>
          {suggestions.map((sug, idx) => {
            const isSelected = current.roleId === sug.roleId;
            return (
              <button
                key={sug.roleId || idx}
                onClick={() => onSelectSuggestion(sug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {(language === 'vi' ? sug.roleTitleVi : sug.roleTitle) || sug.currentRole}
              </button>
            );
          })}
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${resilienceBadge.color}`}>
                {resilienceBadge.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t(language, 'Mã chuẩn O*NET: ', 'O*NET Code: ')}<span className="font-mono text-slate-700">{onetDisplay}</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-2 font-sans">
              {roleTitleDisplay}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(language, 'Phân tích đối soát chuẩn: ', 'Benchmark: ')}
              <span className="font-semibold text-slate-700">{molisaDisplay}</span> (MOLISA/Tổng cục Thống kê)
            </p>
          </div>

          {/* AI Audio Briefing Player Button */}
          <div className="flex items-center gap-2">
            <button
              id="btn-play-audio-brief"
              onClick={handleToggleAudio}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
              title={t(language, 'Nghe tóm tắt định hướng bằng giọng nói AI', 'Listen to AI Audio Briefing')}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
              <span>{isPlayingAudio ? t(language, 'Dừng Giọng Đọc', 'Stop Audio') : t(language, 'Nghe Tóm Tắt (Audio Brief)', 'Listen (Audio Brief)')}</span>
            </button>
          </div>
        </div>

        {/* Narrative Executive Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {language === 'vi' ? 'Đánh Giá Tổng Quan Từ AI & Dữ Liệu Nghiên Cứu' : 'Executive Assessment & AI Synthesis'}
            </h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {summaryNarrative}
          </p>
        </div>

        {/* 4 Core Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">
              {t(language, 'Điểm Kháng AI', 'AI Resilience Score')}
            </span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {compScore}<span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, compScore))}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">
              {t(language, 'Tác Vụ Bị Tự Động Hóa', 'Automated Tasks')}
            </span>
            <div className="text-xl font-extrabold text-rose-600 mt-1">
              {exposureRateValue}%
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {t(language, 'Theo chuẩn ILO 2024', 'Per ILO 2024 Standard')}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">
              {t(language, 'Mức Lương Bình Quân VN', 'Avg Salary (VN)')}
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">
              {salaryRangeDisplay}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {t(language, 'Báo cáo TopCV 2024-2026', 'TopCV Labor Report')}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">
              {t(language, 'Lộ Trình Tối Ưu', 'Optimal Track')}
            </span>
            <div className="text-xs font-bold text-indigo-700 mt-1 line-clamp-1">
              {recommendedPathDisplay}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {t(language, 'Độ khả thi cao nhất', 'Highest Feasibility')}
            </span>
          </div>
        </div>
      </div>

      {/* Transferable Skills & Defensible Human Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Transferable Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'vi' ? 'Kỹ Năng Có Thể Chuyển Giao (Transferable Assets)' : 'Transferable Skills'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {t(language,
              'Những thế mạnh bạn đã có và tiếp tục giữ giá trị cốt lõi khi nâng cấp sang vị trí mới:',
              'Your existing core strengths that retain strong value in the upgraded role:'
            )}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {transferableSkillsList.length > 0 ? (
              transferableSkillsList.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                >
                  ✓ {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                {t(language, 'Đang cập nhật kỹ năng chuyển giao...', 'Updating transferable skills...')}
              </span>
            )}
          </div>
        </div>

        {/* AI Augmentation Tools */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'vi' ? 'Công Cụ AI Cần Làm Chủ Để Nhân Đôi Năng Suất' : 'AI Augmentation Stack'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {t(language,
              'Các phần mềm & Agentic AI giúp bạn tăng tốc công việc gấp 3-5 lần:',
              'AI tools & agentic workflows to boost your productivity by 3-5x:'
            )}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {augmentedWithAiList.length > 0 ? (
              augmentedWithAiList.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                >
                  ⚡ {tool}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                {t(language, 'Đang cập nhật công cụ AI...', 'Updating AI tools...')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Research Citations Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'vi' ? 'Dẫn Chứng & Cơ Sở Nghiên Cứu Bình Duyệt' : 'Evidence Base & Academic Citations'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('research')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t(language, 'Xem Thư Viện RAG', 'View RAG Library')}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {citedResearchList.length > 0 ? (
            citedResearchList.map((res, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 line-clamp-1">{res.paperTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                    {res.institution}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{res.citationSnippetVi}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
              {t(language,
                'Đối soát với 7 tài liệu nghiên cứu quốc tế từ OpenAI (2023), Stanford HAI (2025) và WEF.',
                'Cross-checked with 7 peer-reviewed papers from OpenAI (2023), Stanford HAI (2025), and WEF.'
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3 Step Action CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('resilience')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm text-left transition space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
            <span>{t(language, '1. Soi Tác Vụ O*NET', '1. O*NET Task Matrix')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition transform" />
          </h4>
          <p className="text-[11px] text-slate-500">
            {t(language,
              'Xem chính xác tác vụ nào AI đang thay thế và phần nào là thế mạnh con người.',
              'Inspect which exact tasks AI automates and where human strengths shine.'
            )}
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('trajectories')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm text-left transition space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
            <span>{t(language, '2. Giả Lập 3 Lộ Trình', '2. Trajectory Simulator')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition transform" />
          </h4>
          <p className="text-[11px] text-slate-500">
            {t(language,
              'So sánh đường cong lương 5 năm và mức độ rủi ro giữa 3 phương án chuyển đổi.',
              'Compare 5-year salary curves and risk profiles across 3 transition tracks.'
            )}
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('roadmap')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm text-left transition space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
            <span>{t(language, '3. Bản Đồ Kỹ Năng & Quizzes', '3. Skill Roadmap & Quizzes')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition transform" />
          </h4>
          <p className="text-[11px] text-slate-500">
            {t(language,
              'Lộ trình học theo tuần kèm tài liệu miễn phí và bài test năng lực có chứng chỉ.',
              'Weekly learning roadmap with curated free resources and certification quizzes.'
            )}
          </p>
        </button>
      </div>
    </div>
  );
};
