import React from 'react';
import { Compass, Sparkles, ShieldCheck, BookOpen, TrendingUp, MapPin, Briefcase, Users, Building2, Award, Globe } from 'lucide-react';
import { GOLDEN_PROFILES } from '../data/goldenProfiles';
import { Language } from '../types';
import ReactCountryFlag from 'react-country-flag';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGoldenId: string;
  onSelectGoldenPersona: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnlineDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedGoldenId,
  onSelectGoldenPersona,
  language,
  setLanguage
}) => {
  const tabs = [
    { id: 'suggest', labelVi: 'Định Hướng AI', labelEn: 'AI Guidance', icon: Sparkles },
    { id: 'resilience', labelVi: 'Điểm Kháng AI', labelEn: 'Resilience Score', icon: ShieldCheck },
    { id: 'trajectories', labelVi: 'Lộ Trình & Lương', labelEn: 'Trajectories', icon: TrendingUp },
    { id: 'roadmap', labelVi: 'Bản Đồ Kỹ Năng', labelEn: 'Skill Roadmap', icon: MapPin },
    { id: 'research', labelVi: 'Thư Viện RAG', labelEn: 'Research Base', icon: BookOpen },
    { id: 'news', labelVi: 'Tin Tức AI', labelEn: 'Job News', icon: Globe },
    { id: 'jobs', labelVi: 'Việc Làm AI', labelEn: 'AI Jobs', icon: Briefcase },
    { id: 'community', labelVi: 'Cộng đồng', labelEn: 'Community', icon: Users },
    { id: 'employer', labelVi: 'Nhà Tuyển Dụng', labelEn: 'Employers', icon: Building2 },
    { id: 'proof', labelVi: 'Bảng Minh Chứng', labelEn: 'Proof / KPIs', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      {/* Top Banner / Judge Quick-Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 hidden sm:inline font-medium">
            {language === 'vi' ? 'Hệ thống Định hướng Nghề nghiệp Kỷ nguyên AI • Chuẩn dữ liệu O*NET & MOLISA' : 'Evidence-Based AI Career Orientation Platform'}
          </span>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-2.5 py-0.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
            title="Chuyển đổi ngôn ngữ / Switch language"
          >
            {language === 'vi' ? (
              <span className="flex items-center gap-1.5"><ReactCountryFlag countryCode="VN" svg /> VI</span>
            ) : (
              <span className="flex items-center gap-1.5"><ReactCountryFlag countryCode="GB" svg /> EN</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('suggest')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-sm group-hover:scale-105 transition transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-600 group-hover:rotate-45 transition duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent font-sans">
                LA BÀN
              </span>
              {/* <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI RISER 2026
              </span> */}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === 'vi' ? 'La bàn nghề nghiệp, giữa biển đổi AI' : 'Career compass, amid the AI sea-change'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                <span>{language === 'vi' ? tab.labelVi : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile & Tablet Scrollable Tabs */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-3 py-2 bg-slate-100/90 border-t border-slate-200 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mob-nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs border border-transparent'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? tab.labelVi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
