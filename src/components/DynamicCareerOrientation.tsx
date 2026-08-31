import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Brain,
  TrendingDown,
  Activity,
  UserCheck
} from 'lucide-react';
import { Language, UserIntakeProfile } from '../types';
import { t } from '../utils/i18n';

interface DynamicCareerOrientationProps {
  intake: UserIntakeProfile;
  setIntake: React.Dispatch<React.SetStateAction<UserIntakeProfile>>;
  onAnalyze: (customIntake: UserIntakeProfile) => void;
  isLoading: boolean;
  language: Language;
  onOpenPersonaDrawer?: () => void;
}

export const DynamicCareerOrientation: React.FC<DynamicCareerOrientationProps> = ({
  intake,
  onAnalyze,
  isLoading,
  language,
  onOpenPersonaDrawer
}) => {
  const handleRunComprehensiveAnalysis = () => {
    onAnalyze(intake);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-sm space-y-6">
      {/* Hero Banner Image */}
      <div className="w-full h-52 sm:h-64 md:h-72 relative overflow-hidden bg-slate-900">
        <img 
          src="/hero.jpg" 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/background.jpg';
          }}
          alt="AI Career Compass Hero" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Compass Vietnam 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 drop-shadow-md text-white">
            {t(language, 'Định Hướng Kỷ Nguyên AI & Phân Tích Kháng AI', 'AI Era Orientation & Resilience Analysis')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 drop-shadow flex items-center gap-2 max-w-2xl">
            <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{t(language, 'Dựa trên Hồ sơ Persona của bạn và cơ sở dữ liệu khoa học từ O*NET & MOLISA.', 'Based on your Persona Profile and scientific data from O*NET & MOLISA.')}</span>
          </p>
        </div>
      </div>

      <div className="p-6 sm:px-8 pt-0">
      {/* Header Info Tags */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 mt-4">
        <div className="hidden sm:block">
          {/* Empty spacer for flex-between since title moved to hero */}
        </div>

        <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" /> Powered by Gemini + RAG
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-200 pb-2">
            <Brain className="w-5 h-5 text-amber-500" />
            {t(language, 'Hồ sơ hiện tại (Persona)', 'Current Profile (Persona)')}
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{t(language, 'Công việc hiện tại', 'Current Role')}</p>
            <p className="font-medium text-sm text-slate-900">{intake.currentRole}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">{t(language, 'Thế mạnh chính', 'Core Strengths')}</p>
              <div className="flex flex-wrap gap-1">
                {intake.strengths?.slice(0, 3).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-medium border border-emerald-100">{s}</span>
                )) || <span className="text-xs text-slate-400">{t(language, 'Chưa cập nhật', 'Not updated')}</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">{t(language, 'Điểm yếu', 'Weaknesses')}</p>
              <div className="flex flex-wrap gap-1">
                {intake.weaknesses?.slice(0, 3).map((w, i) => (
                  <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-medium border border-rose-100">{w}</span>
                )) || <span className="text-xs text-slate-400">{t(language, 'Chưa cập nhật', 'Not updated')}</span>}
              </div>
            </div>
          </div>
          <p className="text-xs text-amber-600 italic mt-2">
            {t(language, '* Mở "Hồ sơ Persona" bên cạnh phải màn hình để chỉnh sửa chi tiết.', '* Open "Persona Profile" on the right edge to edit details.')}
          </p>
          <button
            type="button"
            onClick={onOpenPersonaDrawer}
            className="mt-3 text-xs font-semibold px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {t(language, 'Mở hồ sơ Persona', 'Open Persona Profile')}
          </button>
        </div>

        {/* Science Explanation Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-semibold border-b border-blue-200 pb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {t(language, 'Cơ sở Khoa học: Điểm Kháng AI', 'Scientific Basis: AI Resilience Score')}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {language === 'vi' ? (
              <>Hệ thống sử dụng phương pháp <strong>Phân rã tác vụ O*NET (Task Decomposition)</strong> kết hợp mô hình LLM để đánh giá mức độ rủi ro bị thay thế bởi AI đối với công việc của bạn.</>
            ) : (
              <>The system uses <strong>O*NET Task Decomposition</strong> combined with LLM to evaluate your career's risk of AI replacement.</>
            )}
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>{language === 'vi' ? <><strong>Routine vs Non-routine:</strong> Công việc lặp lại (routine) dễ bị tự động hóa. Công việc đòi hỏi sáng tạo, xử lý tình huống bất ngờ có tính kháng AI cao.</> : <><strong>Routine vs Non-routine:</strong> Routine tasks are easily automated. Creative and unpredictable tasks have high AI resilience.</>}</li>
            <li>{language === 'vi' ? <><strong>Physical vs Cognitive:</strong> Tác vụ nhận thức (nhập liệu, tính toán cơ bản) dễ bị thay thế hơn tác vụ vật lý tinh xảo hoặc tương tác con người phức tạp (trí tuệ cảm xúc).</> : <><strong>Physical vs Cognitive:</strong> Basic cognitive tasks (data entry) are more easily replaced than fine physical tasks or complex human interaction (EQ).</>}</li>
            <li>{language === 'vi' ? <><strong>Mức độ dễ tổn thương (Vulnerability):</strong> Dựa trên bộ kỹ năng hiện tại của bạn, AI sẽ đo lường khả năng tồn tại trong 5 năm tới.</> : <><strong>Vulnerability Level:</strong> Based on your current skill set, AI measures your survivability over the next 5 years.</>}</li>
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t(language, 'Dữ liệu Persona đã sẵn sàng để phân tích', 'Persona data is ready for analysis')}</span>
        </div>

        <button
          onClick={handleRunComprehensiveAnalysis}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-900 font-extrabold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>{t(language, 'AI Đang Tính Toán Điểm Kháng & Phân Tích 20 Ngành...', 'AI is calculating Resilience Score & analyzing 20 Careers...')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{t(language, 'Bắt Đầu Phân Tích Định Hướng', 'Start Orientation Analysis')}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};
