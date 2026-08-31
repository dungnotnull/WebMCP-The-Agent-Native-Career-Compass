import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, ShieldCheck, Database, Award, Filter } from 'lucide-react';
import { RESEARCH_LIBRARY } from '../data/researchLibrary';
import { Language, ResearchSource } from '../types';
import { t } from '../utils/i18n';

interface ResearchLibraryViewProps {
  language: Language;
}

export const ResearchLibraryView: React.FC<ResearchLibraryViewProps> = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSources = RESEARCH_LIBRARY.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.keyFindings.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.vietnamRelevance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Thư Viện Dữ Liệu Nghiên Cứu Toàn Cầu (Curated RAG Knowledge Base)' : 'Research & Evidence Knowledge Base'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'vi'
                ? 'Mọi tỷ lệ phần trăm và dự báo trên La Bàn đều được đối soát và trích dẫn trực tiếp từ các công bố khoa học bình duyệt & báo cáo lao động chính thống.'
                : '100% of forecasts and task automation scores are grounded in published, peer-reviewed labor research.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">
              {t(language, `${RESEARCH_LIBRARY.length} Công trình nghiên cứu có lập chỉ mục`, `${RESEARCH_LIBRARY.length} Indexed Research Papers`)}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            id="input-search-research"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm theo tên báo cáo, tác giả, tổ chức (OpenAI, WEF, Stanford, ILO, MOLISA)...' : 'Search research by title, author, institution...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Research Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map((source: ResearchSource) => (
          <div
            key={source.id}
            className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm transition space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                  {source.institution}
                </span>
                <span className="text-xs font-mono text-slate-400">{source.date}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {source.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{t(language, 'Tác giả: ', 'Authors: ')}</span> {source.authors}
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{t(language, 'Kết quả then chốt: ', 'Key Findings: ')}</span>
                  <span className="text-slate-700 leading-relaxed">{source.keyFindings}</span>
                </div>
                <div>
                  <span className="font-bold text-indigo-800">{t(language, 'Phương pháp luận: ', 'Methodology: ')}</span>
                  <span className="text-slate-600 leading-relaxed">{source.methodology}</span>
                </div>
                <div>
                  <span className="font-bold text-amber-800">{t(language, 'Bối cảnh Việt Nam: ', 'Vietnam Context: ')}</span>
                  <span className="text-slate-700 leading-relaxed">{source.vietnamRelevance}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {source.id}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition"
              >
                <span>{t(language, 'Toàn văn bài báo', 'Full Paper')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
