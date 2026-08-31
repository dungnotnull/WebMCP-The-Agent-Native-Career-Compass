import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Compass
} from 'lucide-react';
import { ForecastMode, Language, UserIntakeProfile } from '../types';
import { t } from '../utils/i18n';

interface IntakeFormProps {
  intake: UserIntakeProfile;
  setIntake: React.Dispatch<React.SetStateAction<UserIntakeProfile>>;
  onSubmit: () => void;
  isLoading: boolean;
  language: Language;
  onApplyGoldenPersona?: (id: string) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  intake,
  setIntake,
  onSubmit,
  isLoading,
  language
}) => {
  const [activeMode, setActiveMode] = useState<'interactive' | 'cv_scanner'>('interactive');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [cvText, setCvText] = useState('');
  const [cvScanSuccess, setCvScanSuccess] = useState(false);

  // Local string states for free text editing (fixes comma bug)
  const [skillsString, setSkillsString] = useState(
    (intake.currentSkills || intake.strengths || []).join(', ')
  );
  const [strengthsString, setStrengthsString] = useState(
    (intake.strengths || []).join(', ')
  );
  const [weaknessesString, setWeaknessesString] = useState(
    (intake.weaknesses || []).join(', ')
  );
  const [interestsString, setInterestsString] = useState(
    (intake.interests || []).join(', ')
  );

  // Synchronize when intake changes from outside
  useEffect(() => {
    setSkillsString((intake.currentSkills || intake.strengths || []).join(', '));
    setStrengthsString((intake.strengths || []).join(', '));
    setWeaknessesString((intake.weaknesses || []).join(', '));
    setInterestsString((intake.interests || []).join(', '));
  }, [intake.currentSkills, intake.strengths, intake.weaknesses, intake.interests]);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  // Voice dictation handler
  const handleToggleVoiceDictation = () => {
    if (!speechSupported) {
      alert('Trình duyệt hiện tại chưa hỗ trợ Web Speech API. Bạn có thể sử dụng Chrome/Edge hoặc nhập liệu trực tiếp.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIntake((prev) => ({
          ...prev,
          currentRole: prev.currentRole ? `${prev.currentRole} ${transcript}` : transcript
        }));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // CV / Text Parser
  const handleParseCvText = () => {
    if (!cvText.trim()) return;

    const lines = cvText.split('\n');
    let detectedRole = intake.currentRole;
    const detectedSkills: string[] = [...(intake.currentSkills || intake.strengths || [])];

    const keywordsMap: Record<string, string[]> = {
      'Graphic Designer': ['Photoshop', 'Illustrator', 'Figma', 'Design', 'Banner', 'Typography'],
      'Customer Service Specialist': ['Zendesk', 'CSKH', 'Chăm sóc khách hàng', 'Tư vấn', 'CRM', 'Call center'],
      'Financial Accountant': ['Kế toán', 'MISA', 'Báo cáo tài chính', 'Thuế', 'Excel', 'Sổ sách', 'Kiểm toán'],
      'Software QA Tester': ['Tester', 'Manual test', 'Jira', 'Test case', 'Postman', 'Bug report', 'Automation']
    };

    for (const [role, kws] of Object.entries(keywordsMap)) {
      const matchCount = kws.filter((kw) =>
        cvText.toLowerCase().includes(kw.toLowerCase())
      ).length;
      if (matchCount >= 2) {
        detectedRole = role;
        kws.forEach((kw) => {
          if (cvText.toLowerCase().includes(kw.toLowerCase()) && !detectedSkills.includes(kw)) {
            detectedSkills.push(kw);
          }
        });
      }
    }

    const updatedProfile: UserIntakeProfile = {
      ...intake,
      currentRole: detectedRole || intake.currentRole || 'Chuyên viên kỹ thuật',
      currentSkills: detectedSkills,
      strengths: detectedSkills
    };

    setIntake(updatedProfile);
    setSkillsString(detectedSkills.join(', '));
    setStrengthsString(detectedSkills.join(', '));

    setCvScanSuccess(true);
    setTimeout(() => setCvScanSuccess(false), 4000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse all text areas into cleanly trimmed string arrays
    const parsedSkills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedStrengths = strengthsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedWeaknesses = weaknessesString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedInterests = interestsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalizedProfile: UserIntakeProfile = {
      ...intake,
      currentSkills: parsedSkills,
      strengths: parsedStrengths,
      weaknesses: parsedWeaknesses,
      interests: parsedInterests
    };

    setIntake(finalizedProfile);
    onSubmit();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              {language === 'vi' ? 'Hồ Sơ Năng Lực & Đánh Giá Tương Thích AI' : 'Career Profile & AI Assessment'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'vi'
              ? 'Nhập chi tiết Thế mạnh, Điểm yếu, Sở thích và Kỹ năng hiện có để tính toán Điểm Kháng AI và lộ trình việc làm tương lai.'
              : 'Enter your strengths, weaknesses, interests and existing skills to compute your AI resilience index.'}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('interactive')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t(language, 'Biểu mẫu chi tiết', 'Detailed Form')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('cv_scanner')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'cv_scanner'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t(language, 'Quét CV / Kỹ Năng', 'Scan CV / Skills')}</span>
          </button>
        </div>
      </div>

      {/* CV Scanner Mode */}
      {activeMode === 'cv_scanner' && (
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {t(language, 'Dán đoạn văn bản CV hoặc mô tả kinh nghiệm của bạn', 'Paste your CV text or experience description')}
            </span>
            {cvScanSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t(language, 'Đã bóc tách kỹ năng vào hồ sơ!', 'Extracted skills to profile!')}
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder={t(language, 'Dán tóm tắt kinh nghiệm làm việc, danh sách công cụ hay phần mềm bạn sử dụng hàng ngày...', 'Paste summary of your work experience, tools, or software you use daily...')}
            className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleParseCvText}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t(language, 'Bóc Tách & Tự Động Điền Hồ Sơ', 'Extract & Auto-fill Profile')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Form Fields */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Role + Voice Input Button */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t(language, 'Chức danh / Công việc hiện tại *', 'Current Role / Job Title *')}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                id="input-current-role"
                value={intake.currentRole}
                onChange={(e) => setIntake((prev) => ({ ...prev, currentRole: e.target.value }))}
                placeholder={t(language, 'VD: Graphic Designer, Kế toán tổng hợp, Telesales, QA Tester...', 'e.g. Graphic Designer, Accountant, Telesales, QA Tester...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              />
              <button
                type="button"
                id="btn-voice-dictate"
                onClick={handleToggleVoiceDictation}
                title={speechSupported ? 'Nói bằng giọng nói tiếng Việt' : 'Trình duyệt chưa hỗ trợ Web Speech'}
                className={`absolute right-2 p-1.5 rounded-lg transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Industry & Experience */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t(language, 'Lĩnh vực hoạt động', 'Industry / Field')}</label>
              <select
                id="select-industry"
                value={intake.industry || ''}
                onChange={(e) => setIntake((prev) => ({ ...prev, industry: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              >
                <option value="" disabled>{t(language, '-- Chọn lĩnh vực --', '-- Select Industry --')}</option>
                <option value="Design & Media">{t(language, 'Thiết kế & Truyền thông', 'Design & Media')}</option>
                <option value="Finance & Accounting">{t(language, 'Tài chính & Kế toán', 'Finance & Accounting')}</option>
                <option value="Customer Support & Sales">{t(language, 'Chăm sóc khách hàng & Sales', 'Customer Support & Sales')}</option>
                <option value="IT & Software Development">{t(language, 'CNTT & Lập trình phần mềm', 'IT & Software Development')}</option>
                <option value="Marketing & Content">{t(language, 'Marketing & Nội dung', 'Marketing & Content')}</option>
                <option value="Supply Chain & Logistics">{t(language, 'Logistics & Chuỗi cung ứng', 'Supply Chain & Logistics')}</option>
                <option value="Education & Training">{t(language, 'Giáo dục & Đào tạo', 'Education & Training')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t(language, 'Số năm kinh nghiệm', 'Years of Experience')}</label>
              <select
                id="select-experience"
                value={intake.experienceYears === undefined ? '' : intake.experienceYears}
                onChange={(e) => setIntake((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              >
                <option value="" disabled>{t(language, '-- Chọn số năm --', '-- Select Years --')}</option>
                <option value={0}>{t(language, 'Mới tốt nghiệp / < 1 năm', 'Fresh graduate / < 1 year')}</option>
                <option value={2}>{t(language, '1 - 3 năm', '1 - 3 years')}</option>
                <option value={5}>{t(language, '4 - 7 năm', '4 - 7 years')}</option>
                <option value={10}>{t(language, '> 8 năm', '> 8 years')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Skills Textarea (Fully Fixed Comma Support) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              {t(language, 'Kỹ năng chuyên môn hiện có', 'Current Hard Skills')} <span className="text-slate-400 font-normal">{t(language, '(Nhập văn bản thoải mái, ngăn cách bằng dấu phẩy)', '(Enter text freely, separated by commas)')}</span> *
            </label>
          </div>
          <textarea
            rows={2}
            id="input-current-skills"
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            placeholder={t(language, 'VD: Photoshop, Illustrator, Thiết kế Banner, Chỉnh sửa ảnh, Soạn thảo hợp đồng...', 'e.g. Photoshop, Illustrator, Banner Design, Photo Editing, Contract Drafting...')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none leading-relaxed font-medium"
          />
        </div>

        {/* Strengths, Weaknesses, Interests Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-emerald-800">
              {t(language, 'Thế mạnh / Năng khiếu', 'Strengths / Talents')}
            </label>
            <textarea
              rows={3}
              value={strengthsString}
              onChange={(e) => setStrengthsString(e.target.value)}
              placeholder={t(language, 'VD: Tư duy logic, Giao tiếp tốt, Khả năng tự học nhanh...', 'e.g. Logical thinking, Good communication, Fast learner...')}
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-rose-800">
              {t(language, 'Điểm yếu / Hạn chế', 'Weaknesses / Limitations')}
            </label>
            <textarea
              rows={3}
              value={weaknessesString}
              onChange={(e) => setWeaknessesString(e.target.value)}
              placeholder={t(language, 'VD: Chưa thạo lập trình, Dễ nản khi làm việc lặp lại...', 'e.g. Weak programming, Easily discouraged with repetitive tasks...')}
              className="w-full bg-rose-50/40 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-indigo-800">
              {t(language, 'Sở thích / Quan tâm', 'Interests / Passions')}
            </label>
            <textarea
              rows={3}
              value={interestsString}
              onChange={(e) => setInterestsString(e.target.value)}
              placeholder={t(language, 'VD: Công nghệ AI, Sáng tạo nội dung, Quản trị...', 'e.g. AI technology, Content creation, Administration...')}
              className="w-full bg-indigo-50/40 border border-indigo-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Forecast Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t(language, 'Kịch bản Tốc độ Thâm nhập AI (Forecast Scenario)', 'AI Penetration Forecast Scenario')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { mode: 'slow', label: t(language, 'Tác động Chậm (Slow)', 'Slow Impact (Slow)'), desc: t(language, 'Chi phí hạ tầng AI cao, áp dụng từng phần', 'High AI infrastructure costs, partial adoption') },
              { mode: 'base', label: t(language, 'Kịch bản Cơ sở (Base)', 'Baseline Scenario (Base)'), desc: t(language, 'Chuẩn theo báo cáo ILO & WEF 2025', 'Based on ILO & WEF 2025 reports') },
              { mode: 'fast', label: t(language, 'Tác động Nhanh (Fast)', 'Fast Impact (Fast)'), desc: t(language, 'Agentic AI tự động hóa quy trình diện rộng', 'Agentic AI automates wide-scale processes') }
            ].map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() => setIntake((prev) => ({ ...prev, forecastMode: item.mode as any }))}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  intake.forecastMode === item.mode
                    ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            {t(language, '* 100% dữ liệu được lưu nội bộ (Local Storage) & đối soát chuẩn O*NET 28.1.', '* 100% data saved locally (Local Storage) & cross-checked with O*NET 28.1 standards.')}
          </span>

          <button
            type="submit"
            id="btn-run-assessment"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t(language, 'Đang Phân Tích Kháng AI...', 'Analyzing AI Resilience...')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>{t(language, 'Lưu và đóng', 'Save and close')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
