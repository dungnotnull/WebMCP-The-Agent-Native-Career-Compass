import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle, ArrowRight, FileSpreadsheet, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CareerSuggestion, Language, TrajectoryPath } from '../types';
import { downloadTrajectoryCSV } from '../utils/exportUtils';
import { t } from '../utils/i18n';

interface TrajectorySimulatorProps {
  currentSuggestion?: CareerSuggestion;
  language: Language;
  onNavigateTab: (tabId: string) => void;
}

export const TrajectorySimulator: React.FC<TrajectorySimulatorProps> = ({
  currentSuggestion,
  language,
  onNavigateTab
}) => {
  const [activePathId, setActivePathId] = useState<string>('stay_augment');
  const [showToast, setShowToast] = useState(false);

  const fallbackPaths: TrajectoryPath[] = [
    {
      pathId: 'stay_augment',
      pathTitle: 'Stay & Augment with AI',
      pathTitleVi: 'Ở lại & Tối ưu hóa Năng suất cùng AI',
      targetRoles: ['AI-Augmented Specialist', 'Senior Specialist'],
      skillsToAcquire: ['Prompt Engineering chuyên sâu', 'Agentic Automation', 'AI Quality Control'],
      transferableSkills: ['Chuyên môn nghiệp vụ', 'Tư duy ngành', 'Giao tiếp khách hàng'],
      fiveYearSalaryProjection: [15, 20, 26, 33, 42],
      estimatedTimelineMonths: 3,
      feasibilityScore: 88,
      riskLevel: 'low',
      shortDescription: 'Ứng dụng các công cụ AI vào quy trình làm việc hiện tại để nâng cao hiệu suất gấp 3-5 lần.',
      rationale: 'Khai thác tối đa kiến thức chuyên môn sẵn có mà không cần chuyển đổi ngành nghề.',
      actionStepNow: 'Thực hành kết nối các công cụ AI tự động hóa vào công việc hàng ngày.'
    },
    {
      pathId: 'pivot_adjacent',
      pathTitle: 'Pivot to Adjacent Role',
      pathTitleVi: 'Chuyển dịch sang Vị trí Liền kề Kháng AI',
      targetRoles: ['Product Operations Lead', 'Consultant Specialist'],
      skillsToAcquire: ['Phân tích quy trình (BPM)', 'Quản trị dự án số', 'Đánh giá rủi ro AI'],
      transferableSkills: ['Kỹ năng phối hợp liên phòng ban', 'Kinh nghiệm vận hành', 'Tư duy logic'],
      fiveYearSalaryProjection: [16, 23, 32, 42, 55],
      estimatedTimelineMonths: 6,
      feasibilityScore: 78,
      riskLevel: 'moderate',
      shortDescription: 'Tận dụng 70% kỹ năng cốt lõi và bổ sung tư duy quản trị hoặc phân tích chuyên sâu.',
      rationale: 'Chuyển sang vị trí cần nhiều tương tác chiến lược và giải quyết vấn đề phức tạp.',
      actionStepNow: 'Học bổ sung kỹ năng phân tích dữ liệu và thiết kế quy trình nghiệp vụ.'
    },
    {
      pathId: 'full_switch',
      pathTitle: 'Full Career Reinvention',
      pathTitleVi: 'Chuyển đổi Toàn diện sang Lĩnh vực Mới',
      targetRoles: ['AI Solutions Architect', 'Digital Transformation Specialist'],
      skillsToAcquire: ['Thiết kế kiến trúc hệ thống AI', 'Quản trị dữ liệu lớn', 'Bảo mật & Tuân thủ AI'],
      transferableSkills: ['Tư duy học tập liên tục', 'Giải quyết vấn đề phức tạp'],
      fiveYearSalaryProjection: [14, 25, 38, 52, 70],
      estimatedTimelineMonths: 12,
      feasibilityScore: 62,
      riskLevel: 'high',
      shortDescription: 'Đầu tư học tập bài bản để gia nhập hoàn toàn các ngành nghề tiên phong thời đại AI.',
      rationale: 'Tiềm năng bứt phá thu nhập vượt trội dài hạn nhưng đòi hỏi nỗ lực học hỏi bền bỉ.',
      actionStepNow: 'Bắt đầu lộ trình học 12 tháng chuyên sâu có người hướng dẫn.'
    }
  ];

  const paths: TrajectoryPath[] = (currentSuggestion?.trajectories && currentSuggestion.trajectories.length > 0)
    ? currentSuggestion.trajectories
    : fallbackPaths;

  const years = ['2026 (Hiện tại)', '2027 (+1 Năm)', '2028 (+2 Năm)', '2029 (+3 Năm)', '2030 (+4 Năm)'];

  const stayPath = paths.find(p => p.pathId === 'stay_augment');
  const pivotPath = paths.find(p => p.pathId === 'pivot_adjacent');
  const switchPath = paths.find(p => p.pathId === 'full_switch');

  const chartData = years.map((year, idx) => ({
    year,
    'Ở lại & Tăng cường AI': stayPath?.fiveYearSalaryProjection?.[idx] ?? (15 + idx * 7),
    'Chuyển nhánh Liền kề': pivotPath?.fiveYearSalaryProjection?.[idx] ?? (16 + idx * 9),
    'Chuyển đổi Toàn diện': switchPath?.fiveYearSalaryProjection?.[idx] ?? (14 + idx * 14)
  }));

  const handleExportCSV = () => {
    downloadTrajectoryCSV(currentSuggestion?.currentRole || 'Career', paths);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce text-xs font-semibold">
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <span>{t(language, 'Đã tải xuống tệp dữ liệu mô hình 5 năm (.csv) để mở trong Google Sheets / Excel!', 'Downloaded 5-year model data file (.csv) to open in Google Sheets / Excel!')}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                {language === 'vi' ? 'Giả Lập 3 Lộ Trình Chuyển Đổi & Đường Cong Lương 5 Năm' : '3 Trajectory Pathways & 5-Year Salary Curve'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'vi'
                ? 'So sánh độ khả thi, rủi ro, thời gian và tiềm năng thu nhập giữa 3 phương án: (1) Ở lại & tối ưu hóa AI, (2) Chuyển nhánh liền kề, (3) Đổi mới toàn diện.'
                : 'Comparing feasibility, risk, timeline, and salary curves across 3 career strategies.'}
            </p>
          </div>

          <button
            id="btn-sync-sheets"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title={t(language, 'Xuất bảng tính CSV để mở trong Google Sheets / Excel', 'Export CSV to open in Google Sheets / Excel')}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{language === 'vi' ? 'Xuất Tệp Google Sheets / CSV' : 'Export to Sheets'}</span>
          </button>
        </div>

        {/* 3 Path Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {paths.map((path) => {
            const isSelected = activePathId === path.pathId;
            const isStay = path.pathId === 'stay_augment';
            const isPivot = path.pathId === 'pivot_adjacent';

            return (
              <div
                key={path.pathId}
                onClick={() => setActivePathId(path.pathId)}
                className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-500 shadow-sm ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isStay
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isPivot
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isStay ? t(language, 'Phương án 1', 'Option 1') : isPivot ? t(language, 'Phương án 2', 'Option 2') : t(language, 'Phương án 3', 'Option 3')}
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    {t(language, 'Khả thi:', 'Feasibility:')} {path.feasibilityScore}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {language === 'vi' ? path.pathTitleVi : path.pathTitle}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {path.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{path.estimatedTimelineMonths} {t(language, 'tháng', 'months')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <AlertTriangle className={`w-3.5 h-3.5 ${path.riskLevel === 'low' ? 'text-emerald-600' : path.riskLevel === 'moderate' ? 'text-amber-600' : 'text-rose-600'}`} />
                    <span className="capitalize">{t(language, 'Rủi ro:', 'Risk:')} {path.riskLevel === 'low' ? t(language, 'Thấp', 'Low') : path.riskLevel === 'moderate' ? t(language, 'Vừa', 'Moderate') : t(language, 'Cao', 'High')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salary Projection Line Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{language === 'vi' ? 'Biểu Đồ Dự Phóng Thu Nhập 5 Năm (Triệu VND / Tháng)' : '5-Year Projected Monthly Salary (Million VND)'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(language, 'Dựa trên báo cáo lương thị trường Việt Nam (TopCV 2024-2026) & chỉ số gia tăng năng suất từ nghiên cứu của Stanford HAI.', 'Based on Vietnam salary report (TopCV 2024-2026) & productivity indices from Stanford HAI research.')}
          </p>
        </div>

        <div className="w-full h-72 pt-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit=" tr" domain={[10, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value} ${t(language, 'Triệu VND / tháng', 'Million VND / month')}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="Ở lại & Tăng cường AI"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Chuyển nhánh Liền kề"
                stroke="#6366f1"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Chuyển đổi Toàn diện"
                stroke="#f59e0b"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Trajectory Deep Dive Card */}
      {(() => {
        const selected = paths.find(p => p.pathId === activePathId) || paths[0];
        if (!selected) return null;

        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {t(language, 'Chi Tiết Lộ Trình Đang Chọn', 'Selected Trajectory Details')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {language === 'vi' ? selected.pathTitleVi : selected.pathTitle}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">{t(language, 'Thời gian dự kiến', 'Est. Timeline')}</p>
                  <p className="text-xs font-bold text-slate-800">{selected.estimatedTimelineMonths} {t(language, 'tháng', 'months')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">{t(language, 'Độ khả thi', 'Feasibility')}</p>
                  <p className="text-xs font-bold text-emerald-700">{selected.feasibilityScore}%</p>
                </div>
              </div>
            </div>

            {/* Rationale & Action Step */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  🎯 {t(language, 'Cơ Sở Đánh Giá & Tính Khả Thi:', 'Rationale & Feasibility Basis:')}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selected.rationale}
                </p>
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{t(language, 'Vị trí mục tiêu tiềm năng:', 'Potential target roles:')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selected.targetRoles || []).map((role, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    ⚡ {t(language, 'Hành Động Cần Làm Ngay (Immediate Action):', 'Immediate Action needed:')}
                  </h4>
                  <p className="text-xs text-slate-800 font-medium bg-white p-3 rounded-lg border border-indigo-100 mt-2 leading-relaxed">
                    {selected.actionStepNow}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t(language, 'Sẵn sàng bắt đầu học từng tuần?', 'Ready to start learning week by week?')}
                  </span>
                  <button
                    onClick={() => onNavigateTab('roadmap')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>{t(language, 'Xem Bản Đồ Kỹ Năng', 'View Skills Map')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
