import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CheckCircle2,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Mail,
  HelpCircle,
  ExternalLink,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { CareerSuggestion, Language, RoadmapMilestone } from '../types';
import { downloadMilestoneCalendarICS } from '../utils/exportUtils';
import { t } from '../utils/i18n';
import { getRoadmapLocally, saveRoadmapLocally } from '../lib/localData';

interface RoadmapModuleProps {
  currentSuggestion?: CareerSuggestion;
  language: Language;
}

export const RoadmapModule: React.FC<RoadmapModuleProps> = ({
  currentSuggestion,
  language
}) => {
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    'thao-m1': true,
    'kiet-m1': true,
    'chi-m1': true
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emailReminderEnabled, setEmailReminderEnabled] = useState(false);

  // Load roadmap progress from local storage
  React.useEffect(() => {
    const data = getRoadmapLocally('guest');
    if (data) {
      if (data.completedMilestones) setCompletedMilestones(data.completedMilestones);
      if (data.quizSubmitted) setQuizSubmitted(data.quizSubmitted);
      if (data.selectedAnswers) setSelectedAnswers(data.selectedAnswers);
      if (data.emailReminderEnabled !== undefined) setEmailReminderEnabled(data.emailReminderEnabled);
    }
  }, []);

  // Persist roadmap progress locally (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveRoadmapLocally('guest', {
        completedMilestones,
        quizSubmitted,
        selectedAnswers,
        emailReminderEnabled
      });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [completedMilestones, quizSubmitted, selectedAnswers, emailReminderEnabled]);

  const handleToggleEmailReminder = async () => {
    const nextState = !emailReminderEnabled;
    setEmailReminderEnabled(nextState);

    if (nextState) {
      triggerToast(language === 'vi' ? 'Đã bật nhắc nhở qua Email (giả lập)' : 'Email reminders enabled (simulated)');
    } else {
      triggerToast(language === 'vi' ? 'Đã tắt nhắc nhở Email.' : 'Email reminders disabled.');
    }
  };

  const fallbackRoadmap: RoadmapMilestone[] = [
    {
      id: 'default-m1',
      milestoneNumber: 1,
      phaseName: 'Phase 1: AI Prompting & Workflow Setup',
      phaseNameVi: 'Giai đoạn 1: Nền tảng Tương tác AI & Thiết lập Quy trình',
      title: 'Mastering Agentic AI & Prompt Engineering',
      titleVi: 'Làm chủ Prompt Engineering & Tối ưu luồng công việc với AI',
      weeksDuration: 2,
      estimatedHours: 20,
      skillsCovered: ['Kỹ thuật Prompting đa tầng', 'Sử dụng AI Studio & LLMs', 'Tự động hóa tác vụ cơ bản'],
      freeResources: [
        {
          name: 'Khóa học Google AI Essentials',
          url: 'https://grow.google/ai-essentials/',
          type: 'course',
          provider: 'Google'
        },
        {
          name: 'Hướng dẫn Kỹ thuật Prompting Tiếng Việt',
          url: 'https://learnprompting.org/',
          type: 'doc',
          provider: 'LearnPrompting'
        }
      ],
      checkpointQuiz: {
        question: 'Nguyên tắc nào giúp tạo ra câu lệnh (prompt) đạt kết quả chính xác và ít ảo giác nhất?',
        options: [
          'Chỉ cung cấp một từ khóa duy nhất ngắn gọn',
          'Đưa vai trò (persona), ngữ cảnh cụ thể, dữ liệu đầu vào và định dạng đầu ra mong muốn',
          'Yêu cầu AI tự suy đoán tất cả thông tin còn thiếu',
          'Lặp lại câu hỏi 10 lần trong cùng một prompt'
        ],
        correctIndex: 1,
        explanation: 'Kỹ thuật Prompt chuẩn yêu cầu định rõ Role + Context + Instruction + Constraints + Output Format.'
      }
    },
    {
      id: 'default-m2',
      milestoneNumber: 2,
      phaseName: 'Phase 2: Domain-Specific AI Tools',
      phaseNameVi: 'Giai đoạn 2: Ứng dụng Công cụ AI Chuyên ngành',
      title: 'Domain AI Integration & Real-world Practice',
      titleVi: 'Tích hợp công cụ AI vào nghiệp vụ và dự án thực tế',
      weeksDuration: 4,
      estimatedHours: 35,
      skillsCovered: ['Làm chủ công cụ AI ngành nghề', 'Xử lý dữ liệu và đánh giá chất lượng đầu ra', 'Tối ưu hóa thời gian bàn giao'],
      freeResources: [
        {
          name: 'Học viện AI cho Chuyên viên - Microsoft Learn',
          url: 'https://learn.microsoft.com/vi-vn/training/',
          type: 'course',
          provider: 'Microsoft'
        }
      ],
      checkpointQuiz: {
        question: 'Khi nhận được kết quả phân tích hoặc văn bản từ AI, bước quan trọng nhất của con người là gì?',
        options: [
          'Sao chép và gửi trực tiếp cho khách hàng ngay lập tức',
          'Kiểm tra tính xác thực (Fact-check), thẩm định đạo đức và hiệu chỉnh phù hợp văn hóa',
          'Xóa toàn bộ vì AI không đáng tin',
          'Chờ một tuần sau mới kiểm tra'
        ],
        correctIndex: 1,
        explanation: 'Con người giữ vai trò kiểm duyệt, thẩm định tính chính xác và đưa ra quyết định có trách nhiệm.'
      }
    }
  ];

  const roadmap: RoadmapMilestone[] = (currentSuggestion?.roadmap && currentSuggestion.roadmap.length > 0)
    ? currentSuggestion.roadmap
    : fallbackRoadmap;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuizOptionSelect = (milestoneId: string, optionIdx: number) => {
    if (quizSubmitted[milestoneId]) return;
    setSelectedAnswers({ ...selectedAnswers, [milestoneId]: optionIdx });
  };

  const handleQuizSubmit = (milestone: RoadmapMilestone) => {
    const selected = selectedAnswers[milestone.id];
    if (selected === undefined) return;

    setQuizSubmitted({ ...quizSubmitted, [milestone.id]: true });

    const correctIdx = milestone.checkpointQuiz?.correctIndex ?? 0;
    if (selected === correctIdx) {
      setCompletedMilestones({ ...completedMilestones, [milestone.id]: true });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      triggerToast(t(language, `🎉 Xuất sắc! Bạn đã vượt qua bài kiểm tra "${milestone.titleVi}"!`, `🎉 Excellent! You passed the "${milestone.title}" quiz!`));
    } else {
      triggerToast(t(language, `⚠️ Chưa chính xác. Vui lòng xem giải thích để củng cố kiến thức nhé!`, `⚠️ Incorrect. Please review the explanation to reinforce your knowledge!`));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCalendarDownload = () => {
    downloadMilestoneCalendarICS(currentSuggestion?.currentRole || 'Roadmap', roadmap);
    triggerToast(t(language, '📅 Đã tải xuống tệp lịch .ics! Bạn có thể import trực tiếp vào Google Calendar hoặc Apple Calendar.', '📅 Downloaded .ics calendar file! You can import it directly into Google/Apple Calendar.'));
  };

  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const isAllComplete = roadmap.length > 0 && completedCount === roadmap.length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Integration Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Bản Đồ Nâng Cấp Kỹ Năng (Milestone-based Skill Roadmap)' : 'Skill Upgrade Roadmap'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'vi'
                ? 'Chia nhỏ hành trình chuyển đổi thành 4 giai đoạn cụ thể kèm tài liệu học miễn phí và bài test năng lực có chứng chỉ.'
                : 'Actionable milestones with curated free resources and verification checkpoint quizzes.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleEmailReminder}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                emailReminderEnabled
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={t(language, 'Nhận email nhắc nhở lộ trình hàng tuần', 'Receive weekly roadmap email reminders')}
            >
              <Mail className={`w-4 h-4 ${emailReminderEnabled ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>
                {emailReminderEnabled
                  ? t(language, 'Đã bật nhắc nhở (Email)', 'Email Reminders: ON')
                  : t(language, 'Bật nhắc nhở (Email)', 'Enable Email Reminders')}
              </span>
            </button>

            <button
              onClick={handleCalendarDownload}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title={t(language, 'Tải tệp lịch Google Calendar (.ics) cho toàn bộ lộ trình', 'Download Google Calendar (.ics) for the entire roadmap')}
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{t(language, 'Tải Lịch Google Calendar (.ics)', 'Download Calendar (.ics)')}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        {roadmap.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {t(language, `Tiến độ Hoàn thành Bài Kiểm Tra: ${completedCount}/${roadmap.length} Giai đoạn`, `Quiz Completion Progress: ${completedCount}/${roadmap.length} Phases`)}
                </span>
                {isAllComplete && (
                  <span className="text-[11px] font-bold text-emerald-700">
                    🏆 {t(language, 'Chúc mừng! Bạn đã hoàn thành 100% chứng chỉ kỹ năng La Bàn!', 'Congratulations! You have completed 100% of the La Bàn skill certificates!')}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full sm:w-1/3 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${(completedCount / Math.max(roadmap.length, 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {roadmap.map((milestone, idx) => {
          const isCompleted = !!completedMilestones[milestone.id];
          const isExpanded = !!expandedMilestones[milestone.id];
          const isSubmitted = !!quizSubmitted[milestone.id];
          const selectedAns = selectedAnswers[milestone.id];
          const isCorrect = selectedAns === milestone.checkpointQuiz.correctIndex;

          return (
            <div
              key={milestone.id || idx}
              className={`bg-white border rounded-2xl shadow-xs transition overflow-hidden ${
                isCompleted
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Milestone Accordion Header */}
              <div
                onClick={() => toggleExpand(milestone.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : milestone.milestoneNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {language === 'vi' ? milestone.phaseNameVi : milestone.phaseName}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {milestone.weeksDuration} {t(language, 'tuần', 'weeks')} (~{milestone.estimatedHours} {t(language, 'giờ', 'hours')})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {language === 'vi' ? milestone.titleVi : milestone.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="text-xs text-emerald-700 font-bold hidden sm:inline">
                      {t(language, 'Đạt chứng chỉ ✓', 'Certified ✓')}
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Milestone Expanded Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-5 bg-slate-50/50">
                  {/* Covered Skills */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      🎯 {t(language, 'Kỹ Năng Đạt Được:', 'Skills Acquired:')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(milestone.skillsCovered) ? milestone.skillsCovered : []).map((sk, si) => (
                        <span
                          key={si}
                          className="text-xs px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-medium shadow-xs"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Free Learning Resources */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      📚 {t(language, 'Học Liệu Miễn Phí Được Tuyển Chọn (Free Curated Resources):', 'Free Curated Resources:')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(Array.isArray(milestone.freeResources) ? milestone.freeResources : []).map((res, ri) => (
                        <div
                          key={ri}
                          className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition shadow-xs"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{res.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {res.provider} • <span className="capitalize text-amber-700 font-semibold">{res.type}</span>
                            </p>
                          </div>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition flex-shrink-0"
                          >
                            <span>{t(language, 'Học ngay', 'Learn Now')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Checkpoint Quiz */}
                  <div className="bg-white border border-indigo-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                        {t(language, 'Bài Kiểm Tra Checkpoint (Đánh Giá Năng Lực Thực Hành):', 'Checkpoint Quiz (Practical Capability Assessment):')}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {milestone.checkpointQuiz?.question || t(language, 'Câu hỏi đánh giá năng lực thực hành cho giai đoạn này.', 'Practical capability assessment question for this phase.')}
                    </p>

                    <div className="space-y-2">
                      {(Array.isArray(milestone.checkpointQuiz?.options) ? milestone.checkpointQuiz.options : []).map((opt, oi) => {
                        const isSelected = selectedAns === oi;
                        let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (isSubmitted) {
                          if (oi === (milestone.checkpointQuiz?.correctIndex ?? 0)) {
                            optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300 font-medium';
                        }

                        return (
                          <div
                            key={oi}
                            onClick={() => handleQuizOptionSelect(milestone.id, oi)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-start gap-2.5 ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Action & Explanation */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      {!isSubmitted ? (
                        <button
                          id={`btn-submit-quiz-${milestone.id}`}
                          onClick={() => handleQuizSubmit(milestone)}
                          disabled={selectedAns === undefined}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white transition cursor-pointer shadow-xs"
                        >
                          {t(language, 'Kiểm Tra Câu Trả Lời', 'Check Answer')}
                        </button>
                      ) : (
                        <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                          <p className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? t(language, '✓ Chính xác 100%!', '✓ 100% Correct!') : t(language, '✕ Chưa đúng', '✕ Incorrect')}
                          </p>
                          <p className="text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">{t(language, 'Giải thích: ', 'Explanation: ')}</span>
                            {milestone.checkpointQuiz?.explanation || t(language, 'Đáp án chính xác dựa trên tiêu chuẩn kiến thức của giai đoạn.', 'Correct answer based on the knowledge standard of the phase.')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
