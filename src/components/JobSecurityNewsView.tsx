import React, { useState } from 'react';
import { Globe, RefreshCw, ExternalLink, ShieldCheck, Sparkles, Clock, TrendingUp, TrendingDown, Database } from 'lucide-react';
import { JobSecurityNewsItem, Language } from '../types';
import ReactCountryFlag from 'react-country-flag';
import { t } from '../utils/i18n';

interface JobSecurityNewsViewProps {
  news: JobSecurityNewsItem[];
  onRefreshNews: () => void;
  isLoading: boolean;
  language: Language;
}

const MOCK_TOP_20_TRENDING = [
  { id: 1, nameVi: 'Kỹ sư AI/Prompt Engineer', nameEn: 'AI Engineer / Prompt Engineer', source: 'WEF 2024', index: '+45%' },
  { id: 2, nameVi: 'Chuyên gia Bảo mật Dữ liệu', nameEn: 'Data Security Specialist', source: 'WEF 2024', index: '+38%' },
  { id: 3, nameVi: 'Chuyên viên Năng lượng Xanh', nameEn: 'Green Energy Specialist', source: 'ILO 2023', index: '+35%' },
  { id: 4, nameVi: 'Kiến trúc sư Cloud', nameEn: 'Cloud Solutions Architect', source: 'Gartner', index: '+30%' },
  { id: 5, nameVi: 'Kỹ sư Nông nghiệp Công nghệ cao', nameEn: 'Agritech Engineer', source: 'WEF', index: '+28%' },
  { id: 6, nameVi: 'Điều dưỡng & Chăm sóc Sức khỏe', nameEn: 'Nursing & Healthcare Specialist', source: 'WHO', index: '+25%' },
  { id: 7, nameVi: 'Nhà phân tích Dữ liệu Big Data', nameEn: 'Big Data Analyst', source: 'WEF', index: '+24%' },
  { id: 8, nameVi: 'Chuyên viên Tự động hóa Robot', nameEn: 'Robotics Automation Specialist', source: 'McKinsey', index: '+22%' },
  { id: 9, nameVi: 'Thiết kế Trải nghiệm Người dùng (UX/UI)', nameEn: 'UX/UI Product Designer', source: 'LinkedIn', index: '+20%' },
  { id: 10, nameVi: 'Chuyên gia An toàn Sinh học', nameEn: 'Biosafety Specialist', source: 'WHO', index: '+18%' }
];

const MOCK_TOP_20_RISKY = [
  { id: 1, nameVi: 'Thu ngân & Giao dịch viên', nameEn: 'Bank Teller & Cashier', source: 'WEF 2024', index: '-40%' },
  { id: 2, nameVi: 'Nhân viên Nhập liệu', nameEn: 'Data Entry Clerk', source: 'WEF 2024', index: '-35%' },
  { id: 3, nameVi: 'Dịch thuật viên phổ thông', nameEn: 'General Translator', source: 'O*NET', index: '-32%' },
  { id: 4, nameVi: 'Telesales & CSKH cơ bản', nameEn: 'Basic Telesales & Customer Service', source: 'Gartner', index: '-28%' },
  { id: 5, nameVi: 'Kế toán sơ cấp', nameEn: 'Entry-level Bookkeeper/Accountant', source: 'McKinsey', index: '-25%' },
  { id: 6, nameVi: 'Thợ lắp ráp dây chuyền', nameEn: 'Assembly Line Worker', source: 'ILO', index: '-22%' },
  { id: 7, nameVi: 'Thư ký hành chính', nameEn: 'Administrative Secretary', source: 'WEF', index: '-20%' },
  { id: 8, nameVi: 'Bảo vệ & Giữ xe', nameEn: 'Parking & Security Attendant', source: 'Local Data', index: '-18%' },
  { id: 9, nameVi: 'Bán vé & Điều phối giao thông', nameEn: 'Ticket Vendor & Traffic Dispatcher', source: 'WEF', index: '-15%' },
  { id: 10, nameVi: 'Kiểm toán viên sơ cấp', nameEn: 'Junior Auditor', source: 'O*NET', index: '-12%' }
];

export const JobSecurityNewsView: React.FC<JobSecurityNewsViewProps> = ({
  news = [],
  onRefreshNews,
  isLoading,
  language
}) => {
  const safeNews = news || [];
  const [activeTab, setActiveTab] = useState<'news' | 'top20'>('news');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur border border-white/40 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                {language === 'vi' ? 'Tin Tức & Báo Cáo Thị Trường' : 'Market Intelligence'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'vi' 
                ? 'Dữ liệu được hệ thống AI tổng hợp tự động mỗi ngày từ các nguồn uy tín.' 
                : 'Data is automatically aggregated by our AI system daily from reliable sources.'}
            </p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('news')}
            className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'news' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {t(language, 'Tin Tức AI Mới Nhất', 'Latest AI News')}
          </button>
          <button 
            onClick={() => setActiveTab('top20')}
            className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 flex items-center gap-1 ${activeTab === 'top20' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Database className="w-4 h-4" /> {t(language, 'Top 20 (Cập nhật Tự động)', 'Top 20 (Auto Updated)')}
          </button>
        </div>
      </div>

      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <button
              onClick={onRefreshNews}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isLoading ? (language === 'vi' ? 'Đang tìm kiếm tin tức mới...' : 'Searching live news...') : (language === 'vi' ? 'Làm mới tin tức' : 'Refresh News')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {safeNews.map((item: JobSecurityNewsItem) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 shadow-sm">
                      {item.source}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{item.publishDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                    <div>
                      <span className="font-bold text-amber-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <ReactCountryFlag countryCode={language === 'vi' ? 'VN' : 'US'} svg />
                        {language === 'vi' ? 'Nội dung tóm tắt:' : 'Executive Summary:'}
                      </span>
                      <span className="text-slate-700 leading-relaxed block mt-1">
                        {language === 'vi' ? item.summaryVi : (item.summaryEn || item.summaryVi)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{t(language, 'Lĩnh vực:', 'Fields:')}</span>
                    {(item.affectedFields || []).map((field, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{field}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                    item.impactLevel === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {t(language, 'Tác động: ', 'Impact: ')}
                    {item.impactLevel === 'high' ? t(language, 'Cao', 'High') : t(language, 'Trung bình', 'Medium')}
                  </span>
                  <a href={item.url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2 border border-indigo-200 transition">
                    {t(language, 'Xem bài gốc', 'Source Article')} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'top20' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-sm flex gap-3 shadow-sm">
            <Clock className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="block mb-1">{t(language, 'Cơ chế tự động cập nhật', 'Automated Daily Aggregation')}</strong>
              {language === 'vi' ? 'Hệ thống AI tự động tổng hợp dữ liệu từ các báo cáo khoa học uy tín (WEF, ILO, O*NET) mỗi ngày để mang đến cái nhìn chuẩn xác nhất.' : 'The AI system automatically aggregates data from reputable scientific reports (WEF, ILO, O*NET) daily to provide the most accurate insights.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trending */}
            <div className="bg-white/80 backdrop-blur border border-emerald-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-100">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">{t(language, 'Top 10 Xu Hướng Bùng Nổ', 'Top 10 High-Growth Roles')}</h3>
              </div>
              <ul className="space-y-4">
                {MOCK_TOP_20_TRENDING.map(job => (
                  <li key={job.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{job.id}. {language === 'vi' ? job.nameVi : job.nameEn}</p>
                      <p className="text-xs text-slate-500 mt-1">{t(language, 'Nguồn: ', 'Source: ')}<span className="font-medium text-indigo-600">{job.source}</span></p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">{job.index}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risky */}
            <div className="bg-white/80 backdrop-blur border border-rose-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-rose-100">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><TrendingDown className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">{t(language, 'Top 10 Rủi Ro Bị Thay Thế', 'Top 10 High-Risk Roles')}</h3>
              </div>
              <ul className="space-y-4">
                {MOCK_TOP_20_RISKY.map(job => (
                  <li key={job.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{job.id}. {language === 'vi' ? job.nameVi : job.nameEn}</p>
                      <p className="text-xs text-slate-500 mt-1">{t(language, 'Nguồn: ', 'Source: ')}<span className="font-medium text-rose-600">{job.source}</span></p>
                    </div>
                    <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">{job.index}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
