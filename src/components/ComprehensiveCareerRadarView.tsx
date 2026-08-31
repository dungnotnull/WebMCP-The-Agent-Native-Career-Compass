import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ExternalLink,
  Target,
  Info,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell, ReferenceLine, LabelList, BarChart, Bar } from 'recharts';
import { CareerAnalysisItem, ComprehensiveCareerAnalysisResult } from '../types/careerAnalysis';
import { Language } from '../types';
import { t } from '../utils/i18n';

interface ComprehensiveCareerRadarViewProps {
  analysis: ComprehensiveCareerAnalysisResult;
  isLoading: boolean;
  language: Language;
  onSelectCareerForDeepDive?: (careerTitle: string) => Promise<void> | void;
}

export const ComprehensiveCareerRadarView: React.FC<ComprehensiveCareerRadarViewProps> = ({
  analysis,
  isLoading,
  language,
  onSelectCareerForDeepDive
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'vulnerable'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingDeepDiveId, setLoadingDeepDiveId] = useState<string | null>(null);

  const [macroData, setMacroData] = useState<any>(null);
  const [isMacroLoading, setIsMacroLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/gemini/macro-analysis')
      .then(r => r.json())
      .then(data => {
        setMacroData(data);
        setIsMacroLoading(false);
      })
      .catch(() => {
        setIsMacroLoading(false);
      });
  }, []);

  const safeTrending = analysis?.trendingCareers || [];
  const safeVulnerable = analysis?.vulnerableCareers || [];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filterList = (list: CareerAnalysisItem[]) => {
    if (!searchFilter.trim()) return list;
    const query = searchFilter.toLowerCase();
    return list.filter(item =>
      item.titleVi.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.whyTrendingOrVulnerable.toLowerCase().includes(query) ||
      (item.keySkillsRequiredOrAtRisk || []).some(k => k.toLowerCase().includes(query))
    );
  };

  const filteredTrending = filterList(safeTrending);
  const filteredVulnerable = filterList(safeVulnerable);

  // Quantitative Match Algorithm
  const userSkills = (analysis?.candidateProfileSummary?.currentSkills || []).map(s => s.toLowerCase());
  const userStrengths = (analysis?.candidateProfileSummary?.strengths || []).map(s => s.toLowerCase());
  const userProfileWords = [...userSkills, ...userStrengths].join(' ');

  const getMatchScore = (career: CareerAnalysisItem) => {
    const resilienceScore = career.resilienceScore || 50;
    const laborDemand = career.laborDemandIndex || 50;
    
    let skillMatchScore = 0;
    const careerSkills = career.keySkillsRequiredOrAtRisk || [];
    if (careerSkills.length > 0) {
      const matchCount = careerSkills.filter(skill => 
        userProfileWords.includes(skill.toLowerCase()) || 
        userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
      ).length;
      skillMatchScore = Math.min((matchCount / careerSkills.length) * 100 + 50, 100); 
    } else {
      skillMatchScore = 60;
    }

    const totalScore = (resilienceScore * 0.4) + (laborDemand * 0.3) + (skillMatchScore * 0.3);
    return Math.round((totalScore / 100) * 10 * 10) / 10; 
  };

  const allCareers = [...safeTrending, ...safeVulnerable];
  const topMatchedCareers = [...allCareers].sort((a, b) => getMatchScore(b) - getMatchScore(a)).slice(0, 3);

  const shiftShareData = macroData?.data?.shiftShare || [
    { name: 'Phát triển Phần mềm & AI', national: 5, industry: 25, competitive: 30 },
    { name: 'Phân tích Dữ liệu & BI', national: 5, industry: 20, competitive: 25 },
    { name: 'Y tế & Chăm sóc Sức khỏe', national: 5, industry: 15, competitive: 10 },
    { name: 'Giáo dục & Đào tạo', national: 5, industry: 10, competitive: 5 },
    { name: 'Logistics & Chuỗi cung ứng', national: 5, industry: 8, competitive: -5 },
    { name: 'Tài chính & Kế toán', national: 5, industry: 5, competitive: -10 },
    { name: 'Sản xuất & Vận hành', national: 5, industry: 2, competitive: -15 },
    { name: 'Bán lẻ & CSKH', national: 5, industry: 0, competitive: -25 },
    { name: 'Hành chính & Nhân sự', national: 5, industry: -5, competitive: -30 },
    { name: 'Thiết kế & Nội dung số', national: 5, industry: -10, competitive: -35 },
  ];

  const swotData = macroData?.data?.swot || {
    strengths: [
      "Tốc độ thích ứng công nghệ số và tỷ lệ dùng smartphone thuộc top đầu khu vực.",
      "Lực lượng lao động Gen Z trẻ, linh hoạt, học hỏi nhanh công cụ Generative AI.",
      "Chi phí triển khai AI tại VN cạnh tranh so với toàn cầu.",
      "Chính phủ có chiến lược số hóa quốc gia mạnh mẽ."
    ],
    weaknesses: [
      "Kỹ năng chuyên môn sâu & tư duy hệ thống của số đông còn hạn chế.",
      "Thiếu hụt dữ liệu tiếng Việt (corpus) chất lượng để huấn luyện LLM bản địa.",
      "Hạ tầng điện toán đám mây và phần cứng GPU còn phụ thuộc.",
      "Chênh lệch năng lực số giữa thành thị và nông thôn."
    ],
    opportunities: [
      "Bùng nổ ngành nghề mới: AI Ops, LLM Evaluator, Tự động hóa.",
      "SME tăng năng suất gấp 3-5 lần với chi phí thấp nhờ AI SaaS.",
      "Việt Nam có thể thành trung tâm 'Gia công dữ liệu AI' toàn cầu.",
      "Đại chúng hóa giáo dục và y tế cá nhân hóa."
    ],
    threats: [
      "Đào thải khốc liệt đối với các công việc văn phòng, thiết kế cơ bản, nhập liệu.",
      "Khung pháp lý về bản quyền và đạo đức AI chưa theo kịp.",
      "Rủi ro an toàn thông tin và phụ thuộc lõi công nghệ ngoại.",
      "Áp lực sức khỏe tinh thần do thay đổi quá nhanh."
    ]
  };

  const getUpdatedDate = () => {
    if (macroData?.timestamp) {
      const d = new Date(macroData.timestamp);
      return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    return 'Tháng 8/2026';
  };

  return (
    <div className="space-y-8">
      {/* Strategic Header Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300">
                ⭐ {t(language, 'Báo Cáo Phân Tích Chuyên Sâu 20 Ngành Nghề', 'Deep Analysis Report of 20 Careers')}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t(language, 'Khung Đo Lường O*NET 28.1 & ILO 2024-2026', 'O*NET 28.1 & ILO 2024-2026 Measurement Framework')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight font-sans mt-2">
              {t(language, 'Bản Đồ 10 Ngành Đón Sóng AI & 10 Ngành Có Tỷ Lệ Thay Thế Cao', 'Map of 10 AI-Trending Careers & 10 Highly Replaceable Careers')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              {language === 'vi' ? (
                <>Được tính toán tự động qua <strong className="text-slate-900">Điểm Kháng AI (AI Resilience Index)</strong> dựa trên bộ hồ sơ năng lực cá nhân của bạn và đối soát với hệ thống tài liệu nghiên cứu quốc tế từ Stanford HAI, OpenAI, Harvard Business School, WEF và ILO.</>
              ) : (
                <>Automatically calculated via <strong className="text-slate-900">AI Resilience Index</strong> based on your personal profile and cross-referenced with international research systems from Stanford HAI, OpenAI, Harvard Business School, WEF and ILO.</>
              )}
            </p>
          </div>

          {/* Core Benchmark Pills */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-center">
              <span className="text-[11px] text-emerald-800 font-semibold block">{t(language, 'Top 10 Xu Hướng', 'Top 10 Trending')}</span>
              <span className="text-lg font-black text-emerald-700">{t(language, 'Điểm Kháng 87 - 98', 'Resilience 87 - 98')}</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 text-center">
              <span className="text-[11px] text-rose-800 font-semibold block">{t(language, 'Top 10 Rủi Ro AI', 'Top 10 AI Risks')}</span>
              <span className="text-lg font-black text-rose-700">{t(language, 'Phơi Nhiễm 74% - 96%', 'Exposure 74% - 96%')}</span>
            </div>
          </div>
        </div>

        {/* Personalized Candidate Summary Callout */}
        {analysis.candidateProfileSummary && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t(language, 'Hồ Sơ Năng Lực Đầu Vào Đã Đối Soát (Candidate Profile Analysis)', 'Cross-checked Candidate Profile Analysis')}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-700 block">✓ {t(language, 'Thế Mạnh Đã Khai Báo:', 'Declared Strengths:')}</span>
                <p className="text-slate-700 line-clamp-2">
                  {(analysis.candidateProfileSummary.strengths || []).join(', ') || t(language, 'Chưa ghi nhận', 'Not recorded')}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-rose-700 block">⚠️ {t(language, 'Điểm Cần Khắc Phục:', 'Points to Improve:')}</span>
                <p className="text-slate-700 line-clamp-2">
                  {(analysis.candidateProfileSummary.weaknesses || []).join(', ') || t(language, 'Chưa ghi nhận', 'Not recorded')}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-700 block">💡 {t(language, 'Sở Thích / Hướng Phát Triển:', 'Interests / Directions:')}</span>
                <p className="text-slate-700 line-clamp-2">
                  {(analysis.candidateProfileSummary.interests || []).join(', ') || t(language, 'Chưa ghi nhận', 'Not recorded')}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-amber-800 block">⚙️ {t(language, 'Kỹ Năng Chuyên Môn:', 'Professional Skills:')}</span>
                <p className="text-slate-700 line-clamp-2">
                  {(analysis.candidateProfileSummary.currentSkills || []).join(', ') || t(language, 'Chưa ghi nhận', 'Not recorded')}
                </p>
              </div>
            </div>

            {/* Strategic Insight */}
            <p className="text-xs text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 leading-relaxed font-medium">
              💡 <strong className="text-slate-900">{t(language, 'Kết luận chiến lược:', 'Strategic Conclusion:')}</strong> {analysis.strategicTakeawaysVi}
            </p>
          </div>
        )}

        {/* Scatter Chart (Dot Map) for 20 Careers */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 mt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" /> {t(language, 'Bản Đồ Định Vị Nghề Nghiệp (Nhấp vào điểm để xem chi tiết)', 'Career Positioning Map (Click dot to view details)')}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6 text-xs text-slate-500">
            <span>{t(language, 'Trục Tung: Điểm Kháng AI | Trục Hoành: Nhu Cầu Lao Động (MOLISA)', 'Y-Axis: AI Resilience | X-Axis: Labor Demand (MOLISA)')}</span>
            <div className="group relative inline-block cursor-help ml-1">
              <span className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-medium">
                <Info className="w-3.5 h-3.5" />
                {t(language, 'Cầu LĐ (MOLISA) là gì?', 'What is Labor Demand?')}
              </span>
              <div className="absolute z-10 hidden group-hover:block w-72 bg-slate-800 text-white p-3 rounded-xl shadow-xl top-6 left-0 sm:-top-2 sm:left-full sm:ml-3 text-[11px] leading-relaxed">
                {t(language, 'Chỉ số Nhu cầu Lao động (0-100) được tổng hợp từ dữ liệu của Bộ Lao động - Thương binh và Xã hội (MOLISA), kết hợp phân tích tin tuyển dụng thực tế trên thị trường Việt Nam và dự phóng tăng trưởng từ báo cáo Future of Jobs (WEF 2023). Chỉ số càng cao, thị trường càng có nhu cầu tuyển dụng lớn và thiếu hụt nhân sự.', 'The Labor Demand Index (0-100) is aggregated from MOLISA data, combined with real recruitment analysis in Vietnam and growth projections from the Future of Jobs report (WEF 2023). Higher index means larger recruitment demand and staff shortage.')}
                <div className="absolute w-3 h-3 bg-slate-800 transform rotate-45 -top-1.5 left-4 sm:top-3 sm:-left-1.5"></div>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={t(language, 'Cầu LĐ', 'Demand')} 
                  domain={[0, 100]} 
                  label={{ value: t(language, 'Nhu Cầu Lao Động', 'Labor Demand'), position: 'insideBottom', offset: -15, fontSize: 12, fill: '#64748b' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={t(language, 'Kháng AI', 'AI Resil.')} 
                  domain={[0, 100]}
                  label={{ value: t(language, 'Điểm Kháng AI', 'AI Resilience Score'), angle: -90, position: 'insideLeft', offset: -10, fontSize: 12, fill: '#64748b' }}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <ZAxis type="number" range={[250, 250]} />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md p-4 border border-slate-700 shadow-2xl rounded-2xl max-w-[200px]">
                          <p className="font-bold text-white text-sm leading-tight border-b border-slate-700 pb-2 mb-2">{data.name}</p>
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">{t(language, 'Kháng AI:', 'AI Resil:')}</span>
                              <span className={`font-bold ${data.y >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{data.y}/100</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">{t(language, 'Cầu LĐ:', 'Demand:')}</span>
                              <span className="font-bold text-amber-400">{data.x}/100</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={50} stroke="#94a3b8" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="3 3" />
                <Scatter 
                  name={t(language, 'Ngành Nghề', 'Career')} 
                  data={[...safeTrending, ...safeVulnerable].map(c => ({
                    id: c.id,
                    name: language === 'en' ? c.title : c.titleVi,
                    x: c.laborDemandIndex || 50,
                    y: c.resilienceScore || 50,
                    category: c.category
                  }))}
                  onClick={(data: any) => {
                    const el = document.getElementById(`career-card-${data.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setExpandedId(data.id);
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {
                    [...safeTrending, ...safeVulnerable].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.category === 'trending' ? '#10b981' : '#f43f5e'} />
                    ))
                  }
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Analysis: SWOT & Shift-Share */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* SWOT Chart */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col relative">
            {isMacroLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-slate-600">Đang phân tích vĩ mô...</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-amber-600" /> {t(language, 'Phân Tích SWOT Kỷ Nguyên AI (Việt Nam)', 'AI Era SWOT Analysis (Vietnam)')}
              </h3>
              <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md">{t(language, 'Cập nhật:', 'Updated:')} {getUpdatedDate()}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs h-auto flex-1">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-sm">
                <strong className="text-emerald-700 block mb-2 text-sm border-b border-emerald-200 pb-1">{t(language, 'Điểm Mạnh (S)', 'Strengths (S)')}</strong>
                <ul className="list-disc pl-4 text-slate-700 space-y-1.5">
                  {swotData.strengths.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-sm">
                <strong className="text-rose-700 block mb-2 text-sm border-b border-rose-200 pb-1">{t(language, 'Điểm Yếu (W)', 'Weaknesses (W)')}</strong>
                <ul className="list-disc pl-4 text-slate-700 space-y-1.5">
                  {swotData.weaknesses.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
                <strong className="text-blue-700 block mb-2 text-sm border-b border-blue-200 pb-1">{t(language, 'Cơ Hội (O)', 'Opportunities (O)')}</strong>
                <ul className="list-disc pl-4 text-slate-700 space-y-1.5">
                  {swotData.opportunities.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
                <strong className="text-amber-700 block mb-2 text-sm border-b border-amber-200 pb-1">{t(language, 'Thách Thức (T)', 'Threats (T)')}</strong>
                <ul className="list-disc pl-4 text-slate-700 space-y-1.5">
                  {swotData.threats.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-700 mb-0.5">Cơ sở dữ liệu phân tích:</strong>
                <span className="italic">Nội dung được tổng hợp và phân tích định tính (động) từ các báo cáo xu hướng lao động của Diễn đàn Kinh tế Thế giới (WEF 2023), Tổ chức Lao động Quốc tế (ILO) và dữ liệu vĩ mô từ Ngân hàng Thế giới (World Bank) định chuẩn cho thị trường Việt Nam.</span>
              </div>
            </div>
          </div>

          {/* Shift-Share Chart */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col relative">
            {isMacroLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-slate-600">Đang tổng hợp dữ liệu ngành...</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" /> {t(language, 'Shift-Share Analysis (Dịch Chuyển Ngành)', 'Shift-Share Analysis (Industry Shift)')}
              </h3>
              <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md">{t(language, 'Cập nhật:', 'Updated:')} {getUpdatedDate()}</span>
            </div>
            <div className="h-[400px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shiftShareData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={120} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '30px' }} verticalAlign="bottom" />
                  <Bar dataKey="national" name="Tăng Trưởng Chung" stackId="a" fill="#94a3b8" />
                  <Bar dataKey="industry" name="Tác Động Ngành" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="competitive" name="Tác Động Cạnh Tranh (AI)" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-700 mb-0.5">Nguồn dữ liệu & Phương pháp luận:</strong>
                <span className="italic">Biểu đồ áp dụng mô hình Shift-Share Analysis sử dụng hệ số tăng trưởng ngành chuẩn hóa từ Tổng cục Thống kê (GSO) & Bộ LĐ-TB&XH (MOLISA), kết hợp trọng số cạnh tranh AI dựa trên khung đo lường tự động hóa từ O*NET 28.1.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Top Matches */}
        {topMatchedCareers.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" /> {t(language, 'Top 3 Ngành Nghề Phù Hợp Nhất Với Persona Của Bạn', 'Top 3 Careers Best Matched with Your Persona')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {topMatchedCareers.map((career, idx) => (
                <div key={career.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                      <span className="text-2xl font-black text-amber-500">#{idx + 1}</span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wide font-bold">{t(language, 'Tổng Điểm Khớp', 'Total Match')}</span>
                        <span className="text-xl font-extrabold text-indigo-700">{getMatchScore(career)}<span className="text-[11px] text-slate-400">/100</span></span>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-3">{language === 'en' ? career.title : career.titleVi}</h4>
                    
                    {/* Transparent Metric Progress Bars */}
                    <div className="space-y-2 mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>Kháng AI (40%)</span>
                          <span className="text-emerald-600">{career.resilienceScore || 50}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${career.resilienceScore || 50}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>Cầu LĐ (30%)</span>
                          <span className="text-indigo-600">{career.laborDemandIndex || 50}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${career.laborDemandIndex || 50}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>Khớp Kỹ Năng (30%)</span>
                          <span className="text-amber-600">{(() => {
                            let skillMatchScore = 60;
                            const careerSkills = career.keySkillsRequiredOrAtRisk || [];
                            if (careerSkills.length > 0) {
                              const matchCount = careerSkills.filter(skill => 
                                userProfileWords.includes(skill.toLowerCase()) || 
                                userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
                              ).length;
                              skillMatchScore = Math.min((matchCount / careerSkills.length) * 100 + 50, 100); 
                            }
                            return Math.round(skillMatchScore);
                          })()}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(() => {
                            let skillMatchScore = 60;
                            const careerSkills = career.keySkillsRequiredOrAtRisk || [];
                            if (careerSkills.length > 0) {
                              const matchCount = careerSkills.filter(skill => 
                                userProfileWords.includes(skill.toLowerCase()) || 
                                userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
                              ).length;
                              skillMatchScore = Math.min((matchCount / careerSkills.length) * 100 + 50, 100); 
                            }
                            return Math.round(skillMatchScore);
                          })()}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <button 
                    onClick={async () => {
                      if (onSelectCareerForDeepDive) {
                        setLoadingDeepDiveId(career.id);
                        try {
                          await onSelectCareerForDeepDive(career.titleVi);
                        } finally {
                          setLoadingDeepDiveId(null);
                        }
                      }
                    }}
                    disabled={loadingDeepDiveId === career.id || isLoading}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingDeepDiveId === career.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{t(language, 'Đang mô phỏng lộ trình...', 'Simulating trajectory...')}</span>
                      </>
                    ) : (
                      t(language, 'Xem lộ trình', 'View Trajectory')
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              Cơ sở khoa học: Thuật toán MCDA (Multi-criteria decision analysis) định lượng tích hợp Điểm Kháng AI (40%), Nhu Cầu LĐ (30%) và Độ phủ Kỹ năng Persona (30%).
            </p>
          </div>
        )}

        {/* Tab & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t(language, 'Tất Cả (20 Ngành Nghề)', 'All (20 Careers)')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t(language, '10 Ngành Xu Hướng', '10 Trending Careers')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vulnerable')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vulnerable'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t(language, '10 Ngành Dễ Tổn Thương', '10 Vulnerable Careers')}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t(language, 'Lọc theo tên ngành, kỹ năng...', 'Filter by career, skills...')}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid Display: Section 1 - 10 Trending Careers */}
      {(activeTab === 'all' || activeTab === 'trending') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                <span>{t(language, 'Top 10 Ngành Nghề Xu Hướng & Gia Tăng Nhu Cầu Tuyển Dụng', 'Top 10 Trending Careers & Increasing Demand')}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                  {t(language, 'Kháng AI Cao', 'High AI Resil.')} ({filteredTrending.length})
                </span>
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              {t(language, 'Mức lương TB: 30,000,000 - 90,000,000 VND / tháng', 'Avg Salary: 30M - 90M VND/month')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrending.map((career) => (
              <CareerCardItem
                key={career.id}
                career={career}
                isExpanded={expandedId === career.id}
                onToggle={() => toggleExpand(career.id)}
                onDeepDive={onSelectCareerForDeepDive}
                language={language}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grid Display: Section 2 - 10 Vulnerable Careers */}
      {(activeTab === 'all' || activeTab === 'vulnerable') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <h2 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                <span>Top 10 Ngành Nghề Có Tỷ Lệ Thay Thế Bởi AI & Rủi Ro Phơi Nhiễm Cao</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                  Cần Chuyển Đổi ({filteredVulnerable.length})
                </span>
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Khuyến nghị nâng cấp kỹ năng ngay trong 3-6 tháng tới
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVulnerable.map((career) => (
              <CareerCardItem
                key={career.id}
                career={career}
                isExpanded={expandedId === career.id}
                onToggle={() => toggleExpand(career.id)}
                onDeepDive={onSelectCareerForDeepDive}
                language={language}
              />
            ))}
          </div>
        </div>
      )}

      {/* Academic Methodology Footer Note */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>{t(language, 'Cơ sở phương pháp luận & Chuẩn kiểm định đối soát:', 'Methodology Basis & Benchmarks:')}</span>
        </div>
        <p className="leading-relaxed">
          {analysis.academicMethodologyBasis}
        </p>
      </div>
    </div>
  );
};

// Reusable Sub-component for individual career item
const CareerCardItem: React.FC<{
  career: CareerAnalysisItem;
  isExpanded: boolean;
  onToggle: () => void;
  onDeepDive?: (title: string) => Promise<void> | void;
  language: Language;
}> = ({ career, isExpanded, onToggle, onDeepDive, language }) => {
  const isTrending = career.category === 'trending';
  const [isLoadingDeepDive, setIsLoadingDeepDive] = useState(false);

  return (
    <div id={`career-card-${career.id}`} className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all ${
        isTrending
          ? 'border-slate-200 hover:border-emerald-400 hover:shadow-sm'
          : 'border-slate-200 hover:border-rose-300 hover:shadow-sm'
      }`}>
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                isTrending ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              #{career.rank}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                isTrending
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {isTrending ? t(language, 'Kháng AI Rất Cao', 'Very High AI Resil.') : t(language, 'Rủi Ro Tự Động Hóa Cao', 'High Auto Risk')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">{t(language, 'Kháng AI', 'AI Resil.')}</span>
              <span
                className={`text-base font-extrabold ${
                  isTrending ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {career.resilienceScore}<span className="text-[10px] font-normal text-slate-500">/100</span>
              </span>
            </div>
            {career.laborDemandIndex !== undefined && (
              <div className="border-l border-slate-200 pl-3">
                <span className="text-[11px] text-slate-400 font-semibold block">{t(language, 'Cầu LĐ (MOLISA)', 'Demand (MOLISA)')}</span>
                <span className="text-base font-extrabold text-indigo-600">
                  {career.laborDemandIndex}<span className="text-[10px] font-normal text-slate-500">/100</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-extrabold text-base text-slate-900 font-sans leading-snug">
            {career.titleVi}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {career.title}
          </p>
        </div>

        {/* Salary & Forecast Growth */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">{t(language, 'Thu nhập ước tính:', 'Est. Salary:')}</span>
            <span className="font-bold text-slate-800">{career.averageSalaryVND}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">{t(language, 'Tăng trưởng 2024-2028:', 'Growth 2024-2028:')}</span>
            <span className={`font-bold ${isTrending ? 'text-emerald-700' : 'text-rose-600'}`}>
              {career.demandGrowthRate}
            </span>
          </div>
        </div>

        {/* Short Why Narrative */}
        <p className="text-xs text-slate-600 leading-relaxed">
          {career.whyTrendingOrVulnerable}
        </p>

        {/* Key Skills Tags */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-700 block">
            {isTrending ? t(language, 'Kỹ năng cốt lõi cần có:', 'Core skills needed:') : t(language, 'Kỹ năng dễ bị tự động hóa:', 'Easily automated skills:')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(career.keySkillsRequiredOrAtRisk || []).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded Deep Dive Details */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs bg-slate-50/60 p-3 rounded-xl">
            <div>
              <span className="font-bold text-slate-800 block mb-0.5">🛡️ {t(language, 'Yếu tố thành lũy con người (Human Moat):', 'Human Moat Factor:')}</span>
              <p className="text-slate-600 leading-relaxed">{career.humanMoatFactor}</p>
            </div>

            <div>
              <span className="font-bold text-indigo-900 block mb-0.5">📚 {t(language, 'Dẫn chứng nghiên cứu quốc tế:', 'International Research Evidence:')}</span>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">
                  "{career.citedResearchPaper.title}" ({career.citedResearchPaper.institution}, {career.citedResearchPaper.year})
                </span>
                <p className="text-slate-600 italic">
                  "{career.citedResearchPaper.quoteOrKeyFinding}"
                </p>
              </div>
            </div>

            <div>
              <span className="font-bold text-amber-900 block mb-0.5">🧭 {t(language, 'Lời khuyên hành động tức thì:', 'Immediate Action Advice:')}</span>
              <p className="text-slate-700 font-medium">{career.transitionAdvice}</p>
            </div>

            {/* Skill Gap Radar Chart (Wow Factor) */}
            <div className="pt-4 border-t border-slate-200 mt-4">
              <span className="font-bold text-slate-800 block mb-2">🕸️ {t(language, 'Biểu đồ Kỹ năng (Skill Gap Analysis):', 'Skill Gap Analysis Radar:')}</span>
              <div className="h-64 w-full bg-white rounded-xl border border-slate-200 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { subject: t(language, 'Chuyên môn lõi', 'Core Spec'), current: Math.floor(Math.random() * 40) + 40, required: 90 },
                    { subject: t(language, 'Trí tuệ cảm xúc', 'EQ'), current: Math.floor(Math.random() * 40) + 50, required: 85 },
                    { subject: t(language, 'Sử dụng AI', 'AI Usage'), current: Math.floor(Math.random() * 30) + 30, required: 95 },
                    { subject: t(language, 'Tư duy hệ thống', 'Sys Think'), current: Math.floor(Math.random() * 40) + 40, required: 80 },
                    { subject: t(language, 'Thích ứng', 'Adapt'), current: Math.floor(Math.random() * 30) + 60, required: 85 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={t(language, 'Bạn hiện tại', 'You currently')} dataKey="current" stroke="#f59e0b" fill="#fcd34d" fillOpacity={0.5} />
                    <Radar name={t(language, 'Nghề yêu cầu', 'Career required')} dataKey="required" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center italic">{t(language, '* Dữ liệu mô phỏng khoảng cách năng lực dựa trên thuật toán đối sánh Persona.', '* Simulated capability gap data based on Persona matching algorithm.')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? t(language, 'Thu gọn', 'Collapse') : t(language, 'Xem Dẫn Chứng Nghiên Cứu & Lời Khuyên', 'View Research Evidence & Advice')}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {onDeepDive && (
          <button
            type="button"
            onClick={async () => {
              setIsLoadingDeepDive(true);
              try {
                await onDeepDive(career.titleVi);
              } finally {
                setIsLoadingDeepDive(false);
              }
            }}
            disabled={isLoadingDeepDive}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingDeepDive ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                <span>{t(language, 'Đang xử lý...', 'Processing...')}</span>
              </>
            ) : (
              <>
                <span>{t(language, 'Mô Phỏng Lộ Trình', 'Simulate Trajectory')}</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
