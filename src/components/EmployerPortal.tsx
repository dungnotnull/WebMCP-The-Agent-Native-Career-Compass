import React, { useState } from 'react';
import { Building2, PlusCircle, CheckCircle2, DollarSign, MapPin, Users, Sparkles, Send, Briefcase } from 'lucide-react';
import { EmployerJobListing, Language } from '../types';
import { t } from '../utils/i18n';

interface EmployerPortalProps {
  listings: EmployerJobListing[];
  onAddListing: (listing: any) => void;
  language: Language;
}

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  listings,
  onAddListing,
  language
}) => {
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [location, setLocation] = useState('TP. Hồ Chí Minh');
  const [aiSkills, setAiSkills] = useState('');
  const [salaryBudget, setSalaryBudget] = useState('25,000,000 - 45,000,000 VND');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !companyName.trim()) return;

    onAddListing({
      companyName,
      industry: industry || (language === 'vi' ? 'Công nghệ & Dịch vụ Số' : 'Technology & Digital Services'),
      roleTitle,
      location,
      aiSkillsDemanded: aiSkills.split(',').map(s => s.trim()).filter(Boolean),
      salaryBudgetVND: salaryBudget,
      description,
      contactEmail: contactEmail || 'recruitment@laban.vn'
    });

    setShowForm(false);
    setCompanyName('');
    setRoleTitle('');
    setDescription('');
  };

  const safeListings = listings || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Cổng Kết Nối Doanh Nghiệp (Employer Talent Pipeline)' : 'Employer Talent Pipeline'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'vi'
                ? 'Đăng tuyển các vị trí AI Tăng Cường và tiếp cận nguồn nhân lực đã qua đào tạo & kiểm thử năng lực thực tế từ La Bàn.'
                : 'Post AI-augmented roles and connect with pre-screened transition talent.'}
            </p>
          </div>

          <button
            id="btn-toggle-post-job"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? t(language, 'Đóng Biểu Mẫu', 'Close Form') : t(language, 'Đăng Tin Tuyển Dụng Mới', 'Post New Job')}</span>
          </button>
        </div>

        {/* Benefits for Employers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-amber-800">✓ {t(language, 'Kỹ Năng Đã Xác Thực', 'Verified Skills')}</span>
            <p className="text-[11px] text-slate-600">{t(language, 'Ứng viên đã vượt qua các bài kiểm tra checkpoint & bài tập thực tế.', 'Candidates have passed practical checkpoint quizzes & exercises.')}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-emerald-800">✓ {t(language, 'Giảm 60% Thời Gian Onboarding', '60% Faster Onboarding')}</span>
            <p className="text-[11px] text-slate-600">{t(language, 'Nhân sự đã thuần thục các công cụ AI workflows ngay từ ngày đầu.', 'Talent already proficient with domain AI workflows from day one.')}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-indigo-800">✓ {t(language, 'Trách Nhiệm Xã Hội (CSR & ESG)', 'CSR & ESG Impact')}</span>
            <p className="text-[11px] text-slate-600">{t(language, 'Đồng hành cùng lực lượng lao động Việt Nam trong cuộc chuyển đổi AI.', 'Empowering the workforce transition across Vietnam.')}</p>
          </div>
        </div>
      </div>

      {/* Post Job Form (Collapsible) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-amber-400 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t(language, 'Thông Tin Vị Trí Tuyển Dụng AI-Augmented', 'AI-Augmented Job Opening Details')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Tên Doanh nghiệp *', 'Company Name *')}</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t(language, 'VD: VinTech Labs, FPT Digital...', 'e.g. VinTech Labs, FPT Digital...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Chức danh Tuyển dụng *', 'Job Title *')}</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder={t(language, 'VD: AI Workflow Designer, Test Lead...', 'e.g. AI Workflow Designer, Test Lead...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Địa điểm làm việc', 'Location')}</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              >
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Remote / Hybrid">Remote / Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Kỹ năng AI yêu cầu (ngăn cách dấu phẩy)', 'AI Skills Required (comma-separated)')}</label>
              <input
                type="text"
                value={aiSkills}
                onChange={(e) => setAiSkills(e.target.value)}
                placeholder={t(language, 'VD: Midjourney, Prompt Chaining, Playwright, Python...', 'e.g. Midjourney, Prompt Chaining, Playwright, Python...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Mức lương dự kiến (VND / tháng)', 'Expected Salary (VND / month)')}</label>
              <input
                type="text"
                value={salaryBudget}
                onChange={(e) => setSalaryBudget(e.target.value)}
                placeholder="VD: 25,000,000 - 45,000,000 VND"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 font-bold mb-1">{t(language, 'Mô tả công việc & Yêu cầu', 'Job Description & Requirements')}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(language, 'Mô tả các dự án thực tế, công cụ AI công ty đang triển khai...', 'Describe key responsibilities and tools in use...')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              {t(language, 'Hủy', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t(language, 'Đăng Tin Ngay', 'Post Now')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          {t(language, `Danh Sách Vị Trí Đang Tuyển Dụng Trực Tiếp (${safeListings.length})`, `Direct Openings Pipeline (${safeListings.length})`)}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeListings.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {job.industry}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{job.roleTitle}</h4>
                    <p className="text-xs font-semibold text-slate-600">{job.companyName}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 whitespace-nowrap">
                    {job.salaryBudgetVND}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{job.location}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {job.description}
                </p>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {t(language, 'Kỹ năng AI ưu tiên:', 'Priority AI Skills:')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.aiSkillsDemanded || []).map((sk, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400">{t(language, 'Đăng ngày: ', 'Posted: ')}{job.postedDate}</span>
                <a
                  href={`mailto:${job.contactEmail}?subject=Ứng tuyển vị trí ${job.roleTitle} từ La Bàn`}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition inline-flex items-center gap-1"
                >
                  {t(language, 'Kết nối ứng tuyển →', 'Apply via Email →')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
