import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Sparkles, ExternalLink, Search, Filter, Building2, CheckCircle2 } from 'lucide-react';
import { JobPostingItem, Language } from '../types';
import { t } from '../utils/i18n';

interface JobRadarViewProps {
  jobs: JobPostingItem[];
  language: Language;
}

export const JobRadarView: React.FC<JobRadarViewProps> = ({ jobs = [], language }) => {
  const [searchRole, setSearchRole] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [onlyAiAugmented, setOnlyAiAugmented] = useState(true);

  const safeJobs = jobs || [];

  const filteredJobs = safeJobs.filter(job => {
    const skills = job.requiredSkills || [];
    const matchRole = (job.title || '').toLowerCase().includes(searchRole.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchRole.toLowerCase()) ||
      skills.some(s => s.toLowerCase().includes(searchRole.toLowerCase()));

    const matchLocation = locationFilter === 'all' || (job.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    const matchAi = !onlyAiAugmented || job.isAiAugmented;

    return matchRole && matchLocation && matchAi;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Radar Việc Làm AI & Cơ Hội Tuyển Dụng' : 'AI Job Radar & Opportunities'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'vi'
                ? 'Tổng hợp các vị trí tuyển dụng yêu cầu kỹ năng AI hoặc ưu tiên ứng viên hoàn thành lộ trình nâng cấp năng lực từ La Bàn.'
                : 'Curated job openings seeking AI-augmented talent across Vietnam.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              {t(language, `${filteredJobs.length} Cơ hội tuyển dụng sẵn có`, `${filteredJobs.length} Live Openings Available`)}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              id="input-search-jobs"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              placeholder={t(language, 'Tìm theo chức danh, công ty hoặc kỹ năng AI...', 'Search by title, company or AI skill...')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <select
              id="select-job-location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
            >
              <option value="all">{t(language, 'Tất cả địa điểm (Toàn quốc / Remote)', 'All Locations (Nationwide / Remote)')}</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">{t(language, 'Làm việc từ xa (Remote)', 'Remote Only')}</option>
            </select>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <input
              type="checkbox"
              id="toggle-ai-augmented-jobs"
              checked={onlyAiAugmented}
              onChange={(e) => setOnlyAiAugmented(e.target.checked)}
              className="w-4 h-4 accent-amber-600 cursor-pointer"
            />
            <label htmlFor="toggle-ai-augmented-jobs" className="text-xs text-slate-700 font-medium cursor-pointer">
              {t(language, 'Chỉ hiện việc làm AI Tăng Cường (AI-Augmented)', 'AI-Augmented Roles Only')}
            </label>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {job.sourceTag}
                    </span>
                    {job.isAiAugmented && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-600" /> AI-Augmented
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block whitespace-nowrap">
                    {job.salaryTextVND}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{job.postedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{job.location}</span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {job.summary}
              </p>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t(language, 'Kỹ năng cốt lõi yêu cầu:', 'Core Required Skills:')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(job.requiredSkills || []).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t(language, 'Ưu tiên chứng chỉ La Bàn', 'La Bàn Cert Preferred')}
              </span>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <span>{t(language, 'Ứng tuyển ngay', 'Apply Now')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
