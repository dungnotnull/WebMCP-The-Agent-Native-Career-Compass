import React, { useState } from 'react';
import {
  FileSpreadsheet,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Share2,
  Copy,
  PlusCircle,
  Download,
  AlertCircle
} from 'lucide-react';
import { ComprehensiveCareerAnalysisResult } from '../types/careerAnalysis';
import { CareerSuggestion, Language, UserIntakeProfile } from '../types';
import { t } from '../utils/i18n';

interface GoogleIntegrationsProps {
  careerAnalysis?: ComprehensiveCareerAnalysisResult | null;
  selectedSuggestion?: CareerSuggestion | null;
  intakeProfile?: UserIntakeProfile | null;
  language?: Language;
}

export const GoogleIntegrationsSection: React.FC<GoogleIntegrationsProps> = ({
  careerAnalysis,
  selectedSuggestion,
  intakeProfile,
  language = 'vi'
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [sheetExported, setSheetExported] = useState(false);
  const [activeLocationQuery, setActiveLocationQuery] = useState('TP. Hồ Chí Minh');

  // 1. Generate Google Sheets Export CSV
  const handleExportToGoogleSheets = () => {
    if (!careerAnalysis) return;

    const headers = language === 'vi' 
      ? ['Phân Loại', 'Thứ Hạng', 'Tên Nghề Nghiệp (VN)', 'Tên Quốc Tế', 'Điểm Kháng AI', 'Tỷ Lệ Tự Động Hóa (%)', 'Tăng Trưởng Dự Báo', 'Mức Lương Bình Quân VN', 'Lý Do Phân Loại', 'Tài Liệu Nghiên Cứu Minh Chứng', 'Lời Khuyên Chuyển Đổi']
      : ['Category', 'Rank', 'Career Title (VN)', 'International Title', 'AI Resilience Score', 'Automation Exposure (%)', 'Forecasted Growth', 'Avg Salary (VN)', 'Classification Rationale', 'Cited Research', 'Transition Advice'];
    
    const rows = [
      ...careerAnalysis.trendingCareers.map(c => [
        language === 'vi' ? 'XU HƯỚNG TĂNG TRƯỞNG' : 'TRENDING & GROWING',
        c.rank,
        `"${c.titleVi.replace(/"/g, '""')}"`,
        `"${c.title.replace(/"/g, '""')}"`,
        c.resilienceScore,
        `${c.automationExposure}%`,
        `"${c.demandGrowthRate}"`,
        `"${c.averageSalaryVND}"`,
        `"${c.whyTrendingOrVulnerable.replace(/"/g, '""')}"`,
        `"${c.citedResearchPaper.title} (${c.citedResearchPaper.institution}, ${c.citedResearchPaper.year})"`,
        `"${c.transitionAdvice.replace(/"/g, '""')}"`
      ]),
      ...careerAnalysis.vulnerableCareers.map(c => [
        language === 'vi' ? 'DỄ BỊ THAY THẾ BỞI AI' : 'AI VULNERABLE',
        c.rank,
        `"${c.titleVi.replace(/"/g, '""')}"`,
        `"${c.title.replace(/"/g, '""')}"`,
        c.resilienceScore,
        `${c.automationExposure}%`,
        `"${c.demandGrowthRate}"`,
        `"${c.averageSalaryVND}"`,
        `"${c.whyTrendingOrVulnerable.replace(/"/g, '""')}"`,
        `"${c.citedResearchPaper.title} (${c.citedResearchPaper.institution}, ${c.citedResearchPaper.year})"`,
        `"${c.transitionAdvice.replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LaBan_20Careers_AI_Analysis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSheetExported(true);
    setTimeout(() => setSheetExported(false), 5000);
  };

  // 2. Google Calendar Event Generator (Lịch học nâng cấp kỹ năng Kháng AI)
  const handleAddToGoogleCalendar = () => {
    const roleTitle = (language === 'vi' ? selectedSuggestion?.roleTitleVi : selectedSuggestion?.roleTitle) || (language === 'vi' ? 'Khóa học nâng cao kỹ năng Kháng AI' : 'AI Resilience Upskilling Course');
    const title = encodeURIComponent(language === 'vi' ? `[La Bàn AI] Lịch học & Nâng cấp kỹ năng Kháng AI: ${roleTitle}` : `[La Bàn AI] AI Upskilling Study Schedule: ${roleTitle}`);
    const details = encodeURIComponent(
      (language === 'vi'
        ? `Mục tiêu: Hoàn thành lộ trình chuyển đổi và làm chủ công cụ AI theo khuyến nghị từ nền tảng La Bàn (#BuildwithGoogleAI 2026).\n`
        : `Goal: Complete career transition roadmap and master AI workflows from La Bàn (#BuildwithGoogleAI 2026).\n`) +
      (language === 'vi'
        ? `Lộ trình: ${selectedSuggestion?.recommendedPathVi || 'Nâng cấp kỹ năng AI & Tối ưu năng suất'}\n`
        : `Roadmap: ${selectedSuggestion?.recommendedPath || 'Upskill AI tools & productivity'}\n`) +
      `Platform: https://ai.studio/build`
    );
    const location = encodeURIComponent('Online / La Bàn Learning Portal');
    
    // Set for next Monday 09:00 - 11:00 AM
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + ((1 + 7 - nextDate.getDay()) % 7 || 7));
    const startIso = nextDate.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
    nextDate.setHours(nextDate.getHours() + 2);
    const endIso = nextDate.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12`;
    
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 5000);
  };

  // 3. Google Maps Career Hubs & Innovation Centers
  const hubs = [
    {
      name: language === 'vi' ? 'Khu Công Nghệ Cao TP. Hồ Chí Minh (SHTP)' : 'Saigon Hi-Tech Park (SHTP)',
      address: 'Đường D1, Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh',
      category: language === 'vi' ? 'Trung tâm Nghiên cứu AI & Bán dẫn' : 'AI & Semiconductor R&D Hub',
      query: 'Khu Công Nghệ Cao TP.HCM'
    },
    {
      name: language === 'vi' ? 'Khu Công Nghệ Cao Hòa Lạc (HHTP)' : 'Hoa Lac Hi-Tech Park (HHTP)',
      address: 'Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội',
      category: language === 'vi' ? 'Trung tâm Đổi mới Sáng tạo Quốc gia (NIC)' : 'National Innovation Center (NIC)',
      query: 'Trung tâm Đổi mới sáng tạo Quốc gia NIC Hòa Lạc'
    },
    {
      name: language === 'vi' ? 'Khu Công Nghệ Thông Tin Tập Trung Đà Nẵng' : 'Da Nang Central IT Park',
      address: 'Hòa Liên, Hòa Vang, Đà Nẵng',
      category: language === 'vi' ? 'Hub Phần mềm & Dịch vụ Số Quốc tế' : 'Software & Digital Services Hub',
      query: 'Da Nang IT Park'
    },
    {
      name: language === 'vi' ? 'Công Viên Phần Mềm Quang Trung (QTSC)' : 'Quang Trung Software City (QTSC)',
      address: 'Tân Chánh Hiệp, Quận 12, TP. Hồ Chí Minh',
      category: language === 'vi' ? 'Hệ sinh thái BPO & AI Transformation lớn nhất VN' : 'Largest BPO & AI Transformation Hub',
      query: 'Quang Trung Software City'
    }
  ];

  const handleOpenGoogleMaps = (query: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-700 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
              ⚡ {t(language, 'Hệ sinh thái Google Workspace & Cloud API', 'Google Workspace & Cloud API Ecosystem')}
            </span>
            <span className="text-xs text-slate-400">#BuildwithGoogleAI 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white font-sans">
            {t(language, 'Tích Hợp Dịch Vụ Google: Sheets, Calendar & Google Maps', 'Google Integrations: Sheets, Calendar & Maps')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {t(language,
              'Đồng bộ hóa kết quả phân tích 20 ngành nghề, đặt lịch học chuyển đổi kỹ năng vào Google Calendar và tìm kiếm việc làm/trung tâm đào tạo qua Google Maps.',
              'Synchronize 20-career analysis to Google Sheets, schedule weekly upskilling habits via Google Calendar, and locate top tech & innovation hubs on Google Maps.'
            )}
          </p>
        </div>
      </div>

      {/* 3 Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Google Sheets Integration */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{t(language, 'Xuất Báo Cáo Google Sheets', 'Export to Google Sheets')}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(language,
                'Tải file bảng tính CSV chuẩn UTF-8 chứa đầy đủ 10 ngành xu hướng & 10 ngành rủi ro AI, kèm điểm Kháng AI, trích dẫn nghiên cứu và mức lương VN để mở trực tiếp trên Google Sheets.',
                'Download UTF-8 CSV spreadsheet with full 20 career benchmarks, resilience scores, research citations, and VN salary metrics for Google Sheets.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportToGoogleSheets}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {sheetExported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{t(language, 'Đã Tải Bảng Tính Về Máy!', 'Spreadsheet Downloaded!')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t(language, 'Tải Bảng Dữ Liệu Cho Google Sheets', 'Download for Google Sheets')}</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Google Calendar Integration */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{t(language, 'Lên Lịch Học Trên Google Calendar', 'Schedule on Google Calendar')}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(language,
                'Tự động tạo sự kiện nhắc nhở học tập hàng tuần (12 tuần lộ trình chuyển đổi) trên Google Calendar cá nhân để duy trì thói quen nâng cấp kỹ năng bền bỉ.',
                'Automatically schedule recurring weekly upskilling routines (12-week roadmap) on your personal Google Calendar.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToGoogleCalendar}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {calendarAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{t(language, 'Đã Mở Google Calendar!', 'Opened Google Calendar!')}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>{t(language, 'Thêm Lịch Học Vào Google Calendar', 'Add Schedule to Calendar')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* 3. Google Maps Career Hubs */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">{t(language, 'Bản Đồ Trung Tâm Đổi Mới AI (Maps)', 'AI Innovation Hubs Map')}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t(language,
                'Khám phá các Khu Công Nghệ Cao, Vườn ươm Đổi mới Sáng tạo Quốc gia (NIC) và Hub tuyển dụng công nghệ lớn nhất tại Hà Nội, Đà Nẵng, TP.HCM trên Google Maps.',
                'Explore Vietnam Hi-Tech Parks, National Innovation Centers (NIC), and tech hiring clusters across Hanoi, Da Nang, and HCMC on Google Maps.'
              )}
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {hubs.slice(0, 2).map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleOpenGoogleMaps(h.query)}
                  className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-700 text-left text-[11px] text-amber-200 border border-slate-700 truncate cursor-pointer"
                  title={h.name}
                >
                  📍 {h.name.split('(')[0]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleOpenGoogleMaps(language === 'vi' ? 'Trung tâm đào tạo AI và công nghệ thông tin tại Việt Nam' : 'AI and IT Training Centers Vietnam')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t(language, 'Tìm Trung Tâm Gần Nhất Trên Google Maps', 'Find Nearest Hubs on Google Maps')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Hubs Directory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          {t(language,
            '🗺️ Danh sách 4 Trung tâm Đổi mới Sáng tạo & Hệ sinh thái AI Hàng đầu Việt Nam (Xem chỉ đường Google Maps):',
            '🗺️ Top 4 Innovation Centers & AI Ecosystems in Vietnam (Google Maps Directions):'
          )}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hubs.map((hub, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenGoogleMaps(hub.query)}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-amber-400/60 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-xs text-white group-hover:text-amber-300 line-clamp-1">
                  {hub.name}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-300 shrink-0 mt-0.5" />
              </div>
              <span className="text-[10px] text-emerald-400 block mt-1">
                {hub.category}
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                {hub.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
