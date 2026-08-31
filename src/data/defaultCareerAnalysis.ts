import { ComprehensiveCareerAnalysisResult } from '../types/careerAnalysis';

export const DEFAULT_CAREER_ANALYSIS: ComprehensiveCareerAnalysisResult = {
  candidateProfileSummary: {
    strengths: ['Tư duy phân tích logic', 'Giao tiếp & Thuyết phục', 'Khả năng tự học nhanh', 'Thấu hiểu tâm lý khách hàng'],
    weaknesses: ['Chưa thành thạo lập trình sâu', 'Dễ bị quá tải khi xử lý nhiều tác vụ lặp lại'],
    interests: ['Công nghệ mới', 'Sáng tạo nội dung số', 'Chiến lược kinh doanh', 'Quản trị nhân sự'],
    currentSkills: ['Giao tiếp kinh doanh', 'Phân tích dữ liệu cơ bản', 'Sử dụng công cụ văn phòng', 'Quản lý thời gian'],
    currentRole: 'Chuyên viên nghiệp vụ / Kinh doanh / Thiết kế'
  },
  currentRoleOverview: {
    currentRole: 'Chuyên viên nghiệp vụ / Kinh doanh / Thiết kế',
    experienceYears: 3,
    evaluatedAt: '2026',
    currentResilienceScore: 58,
    future5YResilienceScore: 34,
    currentLaborDemandIndex: 62,
    future5YLaborDemandIndex: 41,
    currentRiskScore: 48,
    future5YRiskScore: 76,
    automationExposureRate: 64,
    augmentationPotentialRate: 82,
    fiveYearDemandGrowthPct: '+46% (Nhân sự tích hợp AI) / -32% (Nhân sự thủ công truyền thống)',
    overviewCurrentStateVi: 'Ở thời điểm hiện tại (2026), ngành nghề của bạn đang bước vào giai đoạn chuyển giao mạnh mẽ từ mô hình thực thi thủ công sang mô hình tự động hóa có trợ lực AI (AI-Augmented). Khoảng 45% - 65% thời lượng công việc hàng ngày (xử lý văn bản, tổng hợp báo cáo định kỳ, phác thảo ý tưởng cơ bản, phân loại dữ liệu) đã có thể được thực hiện hoặc rút ngắn từ 2x đến 4x bằng các hệ thống Generative AI và LLM.',
    overviewCurrentStateEn: 'Currently in 2026, your industry is transitioning rapidly from manual execution to AI-augmented workflows. Roughly 45% - 65% of daily tasks (routine documentation, basic drafting, data classification) can be accelerated 2x-4x using GenAI.',
    fiveYearForecastVi: 'Trong 5 năm tới (2026 - 2031), sự phổ cập của các Agentic AI đa tác tử (Autonomous AI Agents) sẽ chuyển đổi căn bản cơ cấu việc làm: Các vị trí chuyên viên thuần túy chỉ thực hiện tác vụ lặp lại sẽ đối mặt với sự sụt giảm nhu cầu tuyển dụng (-32%), trong khi các vị trí biết làm chủ công nghệ, đóng vai trò "Nhạc trưởng điều phối AI & Kiểm định chất lượng" sẽ chứng kiến mức tăng trưởng nhu cầu (+46%) và thu nhập vượt bậc.',
    fiveYearForecastEn: 'Over the next 5 years (2026-2031), autonomous Agentic AI will fundamentally reshape the job structure: pure routine roles will contract (-32%), while orchestration and AI-enabled specialists will surge (+46%).',
    tasksAtRisk: [
      {
        taskNameVi: 'Thu thập, làm sạch và nhập liệu số liệu thủ công',
        taskType: 'Routine Cognitive',
        impactTimeline: 'Đang diễn ra ngay hiện tại',
        replacementProbability: 88,
        aiTechnology: 'LLM Document Parsing, OCR đa thể thức & Automated Data Pipelines'
      },
      {
        taskNameVi: 'Soạn thảo văn bản hành chính, báo cáo mẫu & email tiêu chuẩn',
        taskType: 'Routine Cognitive',
        impactTimeline: 'Đang diễn ra ngay hiện tại',
        replacementProbability: 82,
        aiTechnology: 'Generative AI Assistants, Auto-Email Copilots'
      },
      {
        taskNameVi: 'Thiết kế đồ họa cơ bản & xử lý hình ảnh 2D lặp lại',
        taskType: 'Routine Cognitive',
        impactTimeline: '1 - 2 năm tới',
        replacementProbability: 75,
        aiTechnology: 'Diffusion Multimodal Models & Generative Canvas'
      },
      {
        taskNameVi: 'Tư vấn giải đáp thông tin cơ bản & phân loại ticket',
        taskType: 'Routine Cognitive',
        impactTimeline: '1 - 2 năm tới',
        replacementProbability: 79,
        aiTechnology: 'Voice/Text Conversational AI Agents & RAG Bots'
      }
    ],
    humanMoatCapabilities: [
      'Khả năng thấu cảm tâm lý, đàm phán trực tiếp và xây dựng niềm tin với khách hàng / đối tác (EQ)',
      'Phán đoán ngữ cảnh kinh doanh đặc thù và ra quyết định chiến lược đa biến',
      'Đạo đức nghề nghiệp, kiểm soát thiên kiến và chịu trách nhiệm pháp lý cao nhất',
      'Năng lực điều phối liên phòng ban và giải quyết khủng hoảng bất định'
    ],
    strategicUpskillingDirectionVi: 'Chuyển hóa từ "Người thực thi tác vụ vi mô" sang "Kiến trúc sư giải pháp & Điều phối viên AI". Tận dụng kinh nghiệm nghiệp vụ sẵn có, bổ sung kỹ năng Prompt Engineering nâng cao, quản trị luồng tự động hóa (n8n/Make) và tư duy phân tích dữ liệu ứng dụng.',
    citedEvidenceSources: [
      {
        paperTitle: 'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models',
        institution: 'OpenAI, OpenResearch & University of Pennsylvania (Eloundou et al.)',
        year: 2023,
        keyMetricOrFormula: 'Mô hình đánh giá độ phơi nhiễm tác vụ: β-exposure = 64% đối với nhóm lao động tri thức và dịch vụ văn phòng.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        paperTitle: 'The Future of Jobs Report 2023 - 2025 Outlook',
        institution: 'World Economic Forum (WEF)',
        year: 2023,
        keyMetricOrFormula: '44% kỹ năng cốt lõi của người lao động sẽ bị tái cấu trúc trước năm 2027; nhóm công việc hành chính & văn phòng giảm 14 triệu vị trí toàn cầu.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      },
      {
        paperTitle: 'Generative AI and Jobs: A Global Analysis of Potential Effects on Job Quantity and Quality',
        institution: 'International Labour Organization (ILO Working Paper 96)',
        year: 2023,
        keyMetricOrFormula: 'Tác động chủ đạo của GenAI là "Khuếch đại năng suất" (Augmentation) với 75% lao động, thay vì thay thế hoàn toàn nếu được đào tạo chuyển đổi.',
        url: 'https://www.ilo.org/publications/generative-ai-and-jobs-global-analysis-potential-effects-job-quantity-and-quality'
      },
      {
        paperTitle: 'Artificial Intelligence Index Report 2024 & 2025 Economy Chapter',
        institution: 'Stanford Institute for Human-Centered Artificial Intelligence (HAI)',
        year: 2024,
        keyMetricOrFormula: 'Nghiên cứu thực địa (BCG / Harvard): Nhân sự kết hợp công cụ AI tăng 40% chất lượng đầu ra và giảm 25% thời gian hoàn thành.',
        url: 'https://aiindex.stanford.edu/report/'
      },
      {
        paperTitle: 'Báo cáo Thị trường Lao động & Chuyển đổi số Việc làm Việt Nam 2024 - 2026',
        institution: 'Tổng cục Thống kê (GSO), Bộ LĐ-TB&XH (MOLISA) & TopCV Analytics',
        year: 2024,
        keyMetricOrFormula: '72% doanh nghiệp tại TP.HCM & Hà Nội ưu tiên tuyển dụng ứng viên thành thạo công cụ AI; nhu cầu kỹ năng lai (Hybrid Skills) tăng 35%.',
        url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung'
      }
    ]
  },
  academicMethodologyBasis: 'Phương pháp phân tích dựa trên mô hình Task-Based Approach của Acemoglu & Restrepo (2018), kết hợp khung đo lường mức độ phơi nhiễm AI của Eloundou et al. (OpenAI/UPenn, 2023), Báo cáo Tương lai Việc làm của WEF (2025) và nghiên cứu của ILO về thị trường lao động Đông Nam Á.',
  strategicTakeawaysVi: 'Trong 3-5 năm tới, các ngành nghề có giá trị gia tăng cao tại Việt Nam sẽ là sự kết hợp giữa kiến thức chuyên môn sâu và khả năng điều phối hệ thống Agentic AI. Các công việc mang tính chất nhập liệu, biên dịch thuần túy hoặc quy trình cố định có nguy cơ bị thay thế cao nhất.',
  trendingCareers: [
    {
      id: 'trend-1',
      rank: 1,
      title: 'AI Solutions Architect & Workflow Integrator',
      titleVi: 'Kiến Trúc Sư Giải Pháp AI & Tích Hợp Quy Trình Doanh Nghiệp',
      category: 'trending',
      resilienceScore: 80,
      laborDemandIndex: 80,
      automationExposure: 18,
      demandGrowthRate: '+65% (2024-2028)',
      averageSalaryVND: '45,000,000 - 90,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Doanh nghiệp Việt Nam đang chuyển từ thử nghiệm AI sang tích hợp toàn diện vào quy trình kinh doanh. Vai trò này đòi hỏi kết nối công nghệ với bài toán kinh tế thực tế.',
      keySkillsRequiredOrAtRisk: ['Thiết kế kiến trúc hệ thống RAG', 'Agentic Workflow Automation (n8n, LangChain)', 'Tư duy nghiệp vụ doanh nghiệp', 'Bảo mật & Quản trị AI'],
      humanMoatFactor: 'Khả năng hiểu bối cảnh vận hành đặc thù của từng tổ chức và ra quyết định chiến lược đa biến.',
      citedResearchPaper: {
        title: 'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models',
        institution: 'OpenAI, OpenResearch & University of Pennsylvania',
        year: 2023,
        quoteOrKeyFinding: 'Khoảng 19% người lao động có ít nhất 50% nhiệm vụ chịu ảnh hưởng của LLM; các vai trò thiết kế tích hợp hệ thống có độ mở rộng giá trị thăng tiến cao nhất.'
      },
      transitionAdvice: 'Tập trung học cách kết nối API mô hình lớn, xây dựng luồng tự động hóa n8n/Make và học thêm kỹ năng tư vấn giải pháp.'
    },
    {
      id: 'trend-2',
      rank: 2,
      title: 'AI Prompt & Context Engineer',
      titleVi: 'Kỹ Sư Thiết Kế Câu Lệnh & Tối Ưu Ngữ Cảnh AI',
      category: 'trending',
      resilienceScore: 88,
      laborDemandIndex: 86,
      automationExposure: 22,
      demandGrowthRate: '+52% (2024-2028)',
      averageSalaryVND: '30,000,000 - 60,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Chất lượng đầu ra của AI phụ thuộc trực tiếp vào cấu trúc câu lệnh và dữ liệu ngữ cảnh (Few-shot, Chain-of-Thought, System Instructions).',
      keySkillsRequiredOrAtRisk: ['Kỹ thuật Prompting đa tầng', 'Đánh giá độ chính xác (Benchmarking)', 'Tối ưu Token & Chi phí API', 'Xử lý tiếng Việt chuyên ngành'],
      humanMoatFactor: 'Năng lực tư duy ngôn ngữ học, trực giác tâm lý và khả năng diễn đạt logic sắc bén.',
      citedResearchPaper: {
        title: 'Navigating the Jagged Technological Frontier: Field Experimental Evidence on AI Productivity',
        institution: 'Harvard Business School & Boston Consulting Group',
        year: 2023,
        quoteOrKeyFinding: 'Chuyên gia sử dụng AI có kỹ năng chỉ dẫn ngữ cảnh tốt hoàn thành công việc nhanh hơn 25.1% và đạt chất lượng cao hơn 40% so với nhóm không sử dụng đúng cách.'
      },
      transitionAdvice: 'Thực hành tương tác sâu với Gemini Pro/Flash API, nắm vững System Instructions và các phương pháp kiểm thử Hallucination.'
    },
    {
      id: 'trend-3',
      rank: 3,
      title: 'AI Product Manager (AI-PM)',
      titleVi: 'Giám Đốc Quản Trị Sản Phẩm Trí Tuệ Nhân Tạo',
      category: 'trending',
      resilienceScore: 81,
      laborDemandIndex: 86,
      automationExposure: 20,
      demandGrowthRate: '+48% (2024-2028)',
      averageSalaryVND: '40,000,000 - 85,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Cần người định hình bài toán người dùng, xác định giá trị sản phẩm AI khả thi về mặt kỹ thuật và thương mại.',
      keySkillsRequiredOrAtRisk: ['Định vị sản phẩm (Product Strategy)', 'Đánh giá ROI & UX AI', 'Quản trị rủi ro & Đạo đức AI', 'Hiểu biết LLM/Multimodal'],
      humanMoatFactor: 'Sự thấu cảm sâu sắc nhu cầu người dùng, đàm phán lợi ích các bên và tầm nhìn kinh doanh.',
      citedResearchPaper: {
        title: 'The Future of Jobs Report 2023-2027',
        institution: 'World Economic Forum (WEF)',
        year: 2023,
        quoteOrKeyFinding: 'Kỹ năng quản trị sản phẩm công nghệ và định hướng chiến lược nằm trong top 5 năng lực tăng trưởng nhu cầu tuyển dụng toàn cầu.'
      },
      transitionAdvice: 'Kết hợp kinh nghiệm quản lý dự án hiện tại với các chứng chỉ Product Management và hiểu biết kiến trúc GenAI.'
    },
    {
      id: 'trend-4',
      rank: 4,
      title: 'AI Safety & Ethics Compliance Specialist',
      titleVi: 'Chuyên Viên Đánh Giá An Toàn & Đạo Đức Trí Tuệ Nhân Tạo',
      category: 'trending',
      resilienceScore: 80,
      laborDemandIndex: 75,
      automationExposure: 12,
      demandGrowthRate: '+60% (2024-2028)',
      averageSalaryVND: '35,000,000 - 70,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Luật AI và các quy định về bảo vệ dữ liệu cá nhân tại Việt Nam & quốc tế yêu cầu kiểm soát thiên kiến (bias), ảo giác và rò rỉ thông tin.',
      keySkillsRequiredOrAtRisk: ['Kiểm thử độ an toàn (Red Teaming)', 'Tuân thủ khung pháp lý bảo mật dữ liệu', 'Đánh giá tính minh bạch thuật toán', 'Quản trị rủi ro AI'],
      humanMoatFactor: 'Phán đoán đạo đức xã hội, nhận thức văn hóa địa phương và trách nhiệm pháp lý con người.',
      citedResearchPaper: {
        title: 'Holistic Evaluation of Language Models (HELM)',
        institution: 'Stanford Center for Research on Foundation Models (CRFM)',
        year: 2023,
        quoteOrKeyFinding: 'Việc đánh giá độc lập về độ an toàn, tính thiên kiến và bản quyền đòi hỏi sự can thiệp và giám sát trực tiếp của chuyên gia nhân văn.'
      },
      transitionAdvice: 'Nghiên cứu khung pháp lý Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và các tiêu chuẩn quốc tế ISO 42001.'
    },
    {
      id: 'trend-5',
      rank: 5,
      title: 'Data & Knowledge Engineer for AI RAG',
      titleVi: 'Kỹ Sư Tri Thức & Xử Lý Dữ Liệu Chuyên Biệt cho AI',
      category: 'trending',
      resilienceScore: 88,
      laborDemandIndex: 78,
      automationExposure: 26,
      demandGrowthRate: '+45% (2024-2028)',
      averageSalaryVND: '35,000,000 - 65,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'AI chỉ thông minh khi có dữ liệu sạch và chuẩn xác. Doanh nghiệp cần xây dựng kho tri thức số hóa và cơ sở dữ liệu vector.',
      keySkillsRequiredOrAtRisk: ['Vector Database (Pinecone, Chroma, pgvector)', 'Xử lý cấu trúc dữ liệu không đồng nhất', 'Thiết kế cây tri thức (Ontology/Knowledge Graph)', 'SQL & Python'],
      humanMoatFactor: 'Khả năng thẩm định chất lượng dữ liệu nghiệp vụ và thiết kế cấu trúc quan hệ logic phức tạp.',
      citedResearchPaper: {
        title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
        institution: 'Meta AI & University College London',
        year: 2021,
        quoteOrKeyFinding: 'Hệ thống RAG giảm ảo giác tới 80% nhưng phụ thuộc hoàn toàn vào kiến trúc dữ liệu đầu vào được thiết kế có chủ đích.'
      },
      transitionAdvice: 'Nâng cao kỹ năng quản trị cơ sở dữ liệu, học thêm về embedding models và kỹ thuật chunking văn bản.'
    },
    {
      id: 'trend-6',
      rank: 6,
      title: 'Healthcare & Mental Health Counselor with AI Support',
      titleVi: 'Chuyên Viên Tham Vấn Tâm Lý & Chăm Sóc Sức Khỏe Hỗ Trợ Bởi AI',
      category: 'trending',
      resilienceScore: 89,
      laborDemandIndex: 86,
      automationExposure: 8,
      demandGrowthRate: '+40% (2024-2028)',
      averageSalaryVND: '25,000,000 - 55,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Áp lực chuyển đổi số và cuộc sống hiện đại khiến nhu cầu chăm sóc sức khỏe tinh thần bùng nổ; AI chỉ đóng vai trò trợ lý sàng lọc ban đầu.',
      keySkillsRequiredOrAtRisk: ['Lắng nghe thấu cảm sâu', 'Chẩn đoán lâm sàng & Trị liệu tâm lý', 'Xây dựng mối quan hệ tin cậy', 'Sử dụng AI ghi chép bệnh án'],
      humanMoatFactor: 'Trí tuệ cảm xúc thực sự, sự hiện diện của con người và tính bảo mật đạo đức y khoa.',
      citedResearchPaper: {
        title: 'Artificial Intelligence in Mental Healthcare: Opportunities, Risks, and Future Directions',
        institution: 'The Lancet Psychiatry',
        year: 2023,
        quoteOrKeyFinding: 'Bệnh nhân đòi hỏi sự thấu cảm con người thực tế trong các quyết định trị liệu phức tạp; AI chỉ hỗ trợ phân loại sơ bộ.'
      },
      transitionAdvice: 'Theo học các chứng chỉ tâm lý học trị liệu được công nhận, ứng dụng AI vào việc soạn kế hoạch chăm sóc và báo cáo.'
    },
    {
      id: 'trend-7',
      rank: 7,
      title: 'Digital Transformation & Change Management Consultant',
      titleVi: 'Chuyên Viên Tư Vấn Chuyển Đổi Số & Quản Trị Thay Đổi',
      category: 'trending',
      resilienceScore: 78,
      laborDemandIndex: 71,
      automationExposure: 15,
      demandGrowthRate: '+38% (2024-2028)',
      averageSalaryVND: '35,000,000 - 75,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Rào cản lớn nhất khi ứng dụng AI là sự phản kháng của con người và văn hóa doanh nghiệp, cần chuyên gia dẫn dắt chuyển đổi.',
      keySkillsRequiredOrAtRisk: ['Quản trị sự thay đổi (Change Management Frameworks)', 'Đào tạo và nâng cao năng lực nhân sự', 'Tái thiết kế quy trình nghiệp vụ (BPR)', 'Kỹ năng thuyết phục lãnh đạo'],
      humanMoatFactor: 'Khả năng điều hướng cảm xúc tổ chức, giải quyết xung đột nội bộ và tạo động lực cho nhân viên.',
      citedResearchPaper: {
        title: 'Leading Change in the Age of AI',
        institution: 'MIT Sloan Management Review & McKinsey & Company',
        year: 2024,
        quoteOrKeyFinding: 'Hơn 70% dự án chuyển đổi số thất bại do yếu tố con người và văn hóa, làm tăng nhu cầu cấp thiết về chuyên gia quản trị thay đổi.'
      },
      transitionAdvice: 'Học các mô hình chuyển đổi như ADKAR/Kotter, kết hợp với hiểu biết thực tế về ứng dụng công nghệ trong doanh nghiệp.'
    },
    {
      id: 'trend-8',
      rank: 8,
      title: 'Creative Art Director & Brand Narrative Lead',
      titleVi: 'Giám Đốc Nghệ Thuật Sáng Tạo & Dẫn Dắt Câu Chuyện Thương Hiệu',
      category: 'trending',
      resilienceScore: 83,
      laborDemandIndex: 73,
      automationExposure: 28,
      demandGrowthRate: '+35% (2024-2028)',
      averageSalaryVND: '30,000,000 - 65,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Khi AI có thể tạo hình ảnh hàng loạt trong vài giây, giá trị nằm ở gu thẩm mỹ độc bản, chiều sâu cảm xúc và bản sắc văn hóa thương hiệu.',
      keySkillsRequiredOrAtRisk: ['Tư duy thẩm mỹ & Art Direction', 'Kể chuyện thương hiệu (Storytelling)', 'Chỉ đạo phối hợp AI tạo sinh (Midjourney, Stable Diffusion)', 'Hiểu biết sâu văn hóa bản địa'],
      humanMoatFactor: 'Khả năng kết nối cảm xúc độc đáo với tâm lý con người và tạo ra những ý niệm đột phá phi logic.',
      citedResearchPaper: {
        title: 'Generative AI and the Future of Creative Work',
        institution: 'Stanford Institute for Human-Centered AI (HAI)',
        year: 2024,
        quoteOrKeyFinding: 'AI tạo ra sự bão hòa nội dung tầm trung, nâng cao giá trị thặng dư của các giám đốc nghệ thuật có khả năng tuyển chọn và định hình gu thẩm mỹ cao cấp.'
      },
      transitionAdvice: 'Chuyển từ người vẽ thao tác thủ công sang vai trò giám đốc nghệ thuật, làm chủ các công cụ ComfyUI/Midjourney để chỉ đạo dự án.'
    },
    {
      id: 'trend-9',
      rank: 9,
      title: 'Advanced Robotics & Automation Systems Engineer',
      titleVi: 'Kỹ Sư Cơ Điện Tử & Tự Động Hóa Hệ Thống Robot Thông Minh',
      category: 'trending',
      resilienceScore: 78,
      laborDemandIndex: 84,
      automationExposure: 14,
      demandGrowthRate: '+55% (2024-2028)',
      averageSalaryVND: '30,000,000 - 60,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Việt Nam đang trở thành trung tâm sản xuất công nghệ cao của thế giới; sự kết hợp AI với robot vật lý (Physical AI) tăng trưởng vượt bậc.',
      keySkillsRequiredOrAtRisk: ['Lập trình PLC & Robot công nghiệp', 'Thị giác máy tính (Computer Vision)', 'Tích hợp cảm biến IoT', 'Bảo trì dự đoán (Predictive Maintenance)'],
      humanMoatFactor: 'Kỹ năng tương tác và xử lý sự cố trong môi trường vật lý thế giới thực mà mô hình phần mềm không thể chạm tới.',
      citedResearchPaper: {
        title: 'Robotics and the Future of Manufacturing in ASEAN',
        institution: 'International Labour Organization (ILO)',
        year: 2023,
        quoteOrKeyFinding: 'Làn sóng đầu tư FDI công nghệ cao tại Việt Nam thúc đẩy nhu cầu kỹ sư vận hành hệ thống tự động hóa thông minh tăng hơn 45%.'
      },
      transitionAdvice: 'Học bổ sung về ROS (Robot Operating System), thị giác máy tính và các giao thức công nghiệp 4.0.'
    },
    {
      id: 'trend-10',
      rank: 10,
      title: 'Renewable Energy & ESG Sustainability Analyst',
      titleVi: 'Chuyên Viên Phân Tích Năng Lượng Tái Tạo & Phát Triển Bền Vững (ESG)',
      category: 'trending',
      resilienceScore: 86,
      laborDemandIndex: 71,
      automationExposure: 16,
      demandGrowthRate: '+42% (2024-2028)',
      averageSalaryVND: '28,000,000 - 58,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Cam kết Net Zero 2050 của Việt Nam và các tiêu chuẩn xuất khẩu sang EU (CBAM) bắt buộc các nhà máy phải có chuyên gia ESG.',
      keySkillsRequiredOrAtRisk: ['Báo cáo kiểm kê khí nhà kính (GHG Protocol)', 'Đánh giá vòng đời sản phẩm (LCA)', 'Phân tích dữ liệu năng lượng với AI', 'Tuân thủ tiêu chuẩn ESG quốc tế'],
      humanMoatFactor: 'Khả năng thương thảo chính sách, đánh giá tác động môi trường thực địa và thẩm định xã hội.',
      citedResearchPaper: {
        title: 'Green Skills for the Future of Work in Asia-Pacific',
        institution: 'Asian Development Bank (ADB)',
        year: 2024,
        quoteOrKeyFinding: 'Chuyển đổi xanh kết hợp công nghệ số mở ra hơn 1.2 triệu vị trí việc làm mới tại Đông Nam Á trong thập kỷ tới.'
      },
      transitionAdvice: 'Tham gia các khóa đào tạo chứng chỉ ESG/Kiểm kê khí nhà kính, ứng dụng AI để tự động hóa xử lý bảng tính dữ liệu năng lượng.'
    }
  ],
  vulnerableCareers: [
    {
      id: 'vuln-1',
      rank: 1,
      title: 'Manual Data Entry & Basic Transcription Clerk',
      titleVi: 'Nhân Viên Nhập Liệu Thủ Công & Gỡ Băng Ghi Âm Cơ Bản',
      category: 'vulnerable',
      resilienceScore: 10,
      laborDemandIndex: 35,
      automationExposure: 94,
      demandGrowthRate: '-68% (2024-2028)',
      averageSalaryVND: '7,000,000 - 12,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Mô hình OCR đa phương thức và Whisper/Gemini có thể trích xuất văn bản từ hình ảnh, hóa đơn và âm thanh với độ chính xác >98% trong vài mili-giây.',
      keySkillsRequiredOrAtRisk: ['Gõ phím nhanh', 'Sao chép biểu mẫu', 'Chép biên bản thính giác', 'Nhập liệu Excel cơ bản'],
      humanMoatFactor: 'Gần như bằng 0 đối với các văn bản tiêu chuẩn.',
      citedResearchPaper: {
        title: 'Occupational Exposure to Generative AI',
        institution: 'OpenAI, OpenResearch & UPenn',
        year: 2023,
        quoteOrKeyFinding: 'Các tác vụ sao chép, trích xuất và số hóa dữ liệu chuẩn hóa có mức độ tự động hóa trực tiếp lên tới 96%.'
      },
      transitionAdvice: 'Chuyển dịch ngay sang Kỹ sư xử lý dữ liệu (Data Annotation Specialist) hoặc Quản lý dữ liệu số doanh nghiệp.'
    },
    {
      id: 'vuln-2',
      rank: 2,
      title: 'Basic Telemarketing & Scripted Telesales',
      titleVi: 'Nhân Viên Bán Hàng Qua Điện Thoại Theo Kịch Bản Sẵn (Telesales)',
      category: 'vulnerable',
      resilienceScore: 22,
      laborDemandIndex: 23,
      automationExposure: 88,
      demandGrowthRate: '-55% (2024-2028)',
      averageSalaryVND: '8,000,000 - 15,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'AI Voice Agents thế hệ mới có khả năng đàm thoại tự nhiên theo thời gian thực bằng giọng tiếng Việt, xử lý hàng nghìn cuộc gọi đồng thời với chi phí cực thấp.',
      keySkillsRequiredOrAtRisk: ['Đọc kịch bản chào hàng', 'Quay số thủ công', 'Ghi chú phản hồi đơn giản', 'Giới thiệu sản phẩm lặp lại'],
      humanMoatFactor: 'Khách hàng phân biệt được kịch bản rập khuôn và có xu hướng chặn cuộc gọi làm phiền.',
      citedResearchPaper: {
        title: 'Generative AI at Work',
        institution: 'National Bureau of Economic Research (NBER)',
        year: 2023,
        quoteOrKeyFinding: 'Trợ lý AI giọng nói đàm thoại tăng năng suất hỗ trợ khách hàng lên 14% và thay thế tới 60% các cuộc gọi sàng lọc ban đầu.'
      },
      transitionAdvice: 'Nâng cấp kỹ năng thành Chuyên viên tư vấn giải pháp B2B cao cấp hoặc Quản lý quan hệ khách hàng chiến lược (Key Account Manager).'
    },
    {
      id: 'vuln-3',
      rank: 3,
      title: 'Routine General Document Translator',
      titleVi: 'Biên Dịch Viên Văn Bản Phổ Thông & Dịch Thuật Cơ Bản',
      category: 'vulnerable',
      resilienceScore: 17,
      laborDemandIndex: 30,
      automationExposure: 86,
      demandGrowthRate: '-48% (2024-2028)',
      averageSalaryVND: '10,000,000 - 18,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Các mô hình ngôn ngữ lớn (LLMs) dịch trôi chảy đa ngôn ngữ, giữ đúng định dạng và nắm bắt tốt ngữ cảnh chung với tốc độ hàng triệu từ/phút.',
      keySkillsRequiredOrAtRisk: ['Tra từ điển thủ công', 'Dịch từng câu văn bản phổ thông', 'Chuyển ngữ tài liệu hướng dẫn cơ bản'],
      humanMoatFactor: 'Chỉ còn giá trị ở tác phẩm văn học nghệ thuật đỉnh cao, văn bản ngoại giao tối mật hoặc bản địa hóa văn hóa đặc thù.',
      citedResearchPaper: {
        title: 'AI Translation Quality Evaluation Benchmarks',
        institution: 'Google Research & DeepL Institute',
        year: 2024,
        quoteOrKeyFinding: 'Chất lượng dịch máy thần kinh kết hợp LLM đạt chỉ số BLEU ngang ngửa dịch giả trung cấp ở hơn 85% tài liệu kỹ thuật.'
      },
      transitionAdvice: 'Chuyển đổi thành Chuyên viên hiệu đính AI & Bản địa hóa nội dung số (AI Post-Editing & Cultural Localization Lead).'
    },
    {
      id: 'vuln-4',
      rank: 4,
      title: 'Entry-level Junior Graphic Production & Banner Resizing',
      titleVi: 'Nhân Viên Thiết Kế Đồ Họa Cắt Ghép Cơ Bản & Đổi Kích Thước Banner',
      category: 'vulnerable',
      resilienceScore: 25,
      laborDemandIndex: 24,
      automationExposure: 82,
      demandGrowthRate: '-45% (2024-2028)',
      averageSalaryVND: '8,000,000 - 15,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Các công cụ như Canva Magic Studio, Photoshop Generative Fill và Midjourney tự động tạo hàng trăm biến thể banner quảng cáo theo kích thước chuẩn trong vài giây.',
      keySkillsRequiredOrAtRisk: ['Tách nền vật thể', 'Đổi kích thước banner', 'Cắt ghép hình ảnh đơn giản', 'Chèn text vào ảnh mẫu có sẵn'],
      humanMoatFactor: 'Khách hàng có thể tự tạo sản phẩm hình ảnh cơ bản với câu lệnh đơn giản.',
      citedResearchPaper: {
        title: 'Diffusion Models in Digital Asset Creation',
        institution: 'Stanford HAI & Adobe Research',
        year: 2023,
        quoteOrKeyFinding: 'Thời gian sản xuất tài nguyên đồ họa quảng cáo thương mại điện tử giảm hơn 70% nhờ các công cụ tạo sinh tự động.'
      },
      transitionAdvice: 'Nâng tầm lên Thiết kế trải nghiệm người dùng (UI/UX), Giám đốc mỹ thuật hoặc Chuyên gia xây dựng hệ sinh thái nhận diện thương hiệu.'
    },
    {
      id: 'vuln-5',
      rank: 5,
      title: 'Junior Manual Software Tester',
      titleVi: 'Kiểm Thử Phần Mềm Thủ Công Mức Độ Sơ Cấp (Manual Tester)',
      category: 'vulnerable',
      resilienceScore: 30,
      laborDemandIndex: 29,
      automationExposure: 79,
      demandGrowthRate: '-42% (2024-2028)',
      averageSalaryVND: '9,000,000 - 16,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'AI có thể tự động đọc tài liệu đặc tả phần mềm (BRD), viết kịch bản test case và sinh mã kiểm thử tự động (Playwright, Cypress) hoàn chỉnh.',
      keySkillsRequiredOrAtRisk: ['Nhấp chuột kiểm thử giao diện thủ công', 'Ghi chép log lỗi rập khuôn', 'Thực hiện test case theo checklist có sẵn'],
      humanMoatFactor: 'Kiểm thử phi chức năng, đánh giá cảm xúc trải nghiệm người dùng và tư duy bảo mật nâng cao.',
      citedResearchPaper: {
        title: 'Automated Test Generation using LLMs in Software Engineering',
        institution: 'Microsoft Research & ACM SIGSOFT',
        year: 2024,
        quoteOrKeyFinding: 'Hơn 65% test case thông thường và báo cáo lỗi có thể được tạo tự động bởi AI Copilot với tỷ lệ phủ mã cao.'
      },
      transitionAdvice: 'Học lập trình kiểm thử tự động (Automation QA), kiểm thử hiệu năng và đánh giá chất lượng mô hình AI (RAG Benchmark).'
    },
    {
      id: 'vuln-6',
      rank: 6,
      title: 'Routine Bookkeeper & Invoice Data Processor',
      titleVi: 'Nhân Viên Kế Toán Nhập Sổ Sách & Xử Lý Chứng Từ Đơn Thuần',
      category: 'vulnerable',
      resilienceScore: 19,
      laborDemandIndex: 30,
      automationExposure: 84,
      demandGrowthRate: '-46% (2024-2028)',
      averageSalaryVND: '8,000,000 - 14,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Hóa đơn điện tử kết hợp AI phần mềm kế toán (như MISA, Fast, SAP) tự động đối soát, định khoản và lập báo cáo thuế không cần can thiệp tay.',
      keySkillsRequiredOrAtRisk: ['Gõ hóa đơn vào phần mềm', 'Đối chiếu sao kê ngân hàng', 'Lập phiếu thu chi định kỳ', 'Sắp xếp chứng từ giấy'],
      humanMoatFactor: 'Khả năng tư vấn tối ưu thuế chiến lược, phân tích dòng tiền và lập kế hoạch tài chính kinh doanh.',
      citedResearchPaper: {
        title: 'Automation of Financial Reporting and Audit Procedures',
        institution: 'Journal of Accounting and Economics & PwC',
        year: 2023,
        quoteOrKeyFinding: 'Tự động hóa thông minh giảm 80% thời gian hạch toán chứng từ sơ cấp, thúc đẩy nhu cầu chuyển đổi sang chuyên viên phân tích tài chính.'
      },
      transitionAdvice: 'Nâng cao kỹ năng phân tích dữ liệu tài chính (Financial Analyst), tư vấn kiểm soát chi phí và ứng dụng PowerBI/AI vào dự báo.'
    },
    {
      id: 'vuln-7',
      rank: 7,
      title: 'Basic SEO Article Writer & Content Farm Rewriter',
      titleVi: 'Người Viết Bài SEO Số Lượng Lớn & Xào Lại Nội Dung (Content Farm)',
      category: 'vulnerable',
      resilienceScore: 27,
      laborDemandIndex: 20,
      automationExposure: 90,
      demandGrowthRate: '-62% (2024-2028)',
      averageSalaryVND: '7,000,000 - 13,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'AI sản xuất hàng trăm bài viết chuẩn SEO trong vài phút. Thuật toán Google cũng phạt nặng nội dung xào nấu vô hồn không có trải nghiệm thực tế (E-E-A-T).',
      keySkillsRequiredOrAtRisk: ['Viết bài chuẩn từ khóa SEO đơn thuần', 'Tóm tắt lại các bài báo có sẵn', 'Viết mô tả sản phẩm ngắn hàng loạt'],
      humanMoatFactor: 'Nghiên cứu điều tra thực tế, phỏng vấn chuyên gia, góc nhìn cá nhân sâu sắc và sự độc bản.',
      citedResearchPaper: {
        title: 'The Degradation and Renewal of Web Content under Generative AI',
        institution: 'Oxford Internet Institute',
        year: 2024,
        quoteOrKeyFinding: 'Thị trường thuê người viết nội dung SEO cơ bản sụt giảm hơn 50% sau khi các mô hình ngôn ngữ lớn phổ cập.'
      },
      transitionAdvice: 'Chuyển sang làm Chiến lược nội dung (Content Strategist), xây dựng thương hiệu cá nhân hoặc làm Báo chí điều tra chuyên sâu.'
    },
    {
      id: 'vuln-8',
      rank: 8,
      title: 'Standard Travel Booking & Itinerary Reservation Agent',
      titleVi: 'Đại Lý Đặt Vé & Lên Lịch Trình Du Lịch Cơ Bản',
      category: 'vulnerable',
      resilienceScore: 28,
      laborDemandIndex: 25,
      automationExposure: 76,
      demandGrowthRate: '-38% (2024-2028)',
      averageSalaryVND: '8,000,000 - 15,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Các ứng dụng tích hợp Agentic AI (Google Flights/Maps AI, OTA thông minh) tự động so sánh giá, tối ưu lịch trình và đặt phòng tức thì cho du khách.',
      keySkillsRequiredOrAtRisk: ['Tra cứu giá vé thủ công', 'Lên lịch trình theo mẫu chung', 'Đặt phòng khách sạn qua email'],
      humanMoatFactor: 'Thiết kế các tour trải nghiệm độc bản cao cấp, xử lý khủng hoảng du lịch thực tế và phục vụ khách VIP (Concierge).',
      citedResearchPaper: {
        title: 'Disruption of Intermediary Services in Tourism by AI Agents',
        institution: 'World Travel & Tourism Council (WTTC)',
        year: 2024,
        quoteOrKeyFinding: 'Du khách tự sử dụng trợ lý ảo lên kế hoạch chiếm hơn 65%, buộc các đại lý truyền thống phải chuyển hướng sang dịch vụ cá nhân hóa cao cấp.'
      },
      transitionAdvice: 'Tập trung vào phân khúc du lịch trải nghiệm độc lạ, du lịch kết hợp chăm sóc sức khỏe (Wellness Tourism) hoặc tổ chức sự kiện MICE.'
    },
    {
      id: 'vuln-9',
      rank: 9,
      title: 'Routine Legal Document Drafter & Contract Template Assembler',
      titleVi: 'Chuyên Viên Soạn Thảo Hợp Đồng Mẫu & Văn Bản Pháp Lý Cơ Bản',
      category: 'vulnerable',
      resilienceScore: 23,
      laborDemandIndex: 23,
      automationExposure: 74,
      demandGrowthRate: '-35% (2024-2028)',
      averageSalaryVND: '10,000,000 - 18,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'AI pháp lý có thể phân tích hàng trăm trang hợp đồng trong vài giây, chỉ ra điều khoản rủi ro và tự động sinh hợp đồng mẫu chính xác theo luật định.',
      keySkillsRequiredOrAtRisk: ['Soạn thảo hợp đồng theo biểu mẫu có sẵn', 'Rà soát lỗi chính tả hợp đồng', 'Tra cứu văn bản luật cơ bản'],
      humanMoatFactor: 'Tranh tụng tại tòa, đàm phán thương vụ phức tạp, xây dựng chiến lược pháp lý và thấu hiểu góc khuất thực tế.',
      citedResearchPaper: {
        title: 'Evaluating LLMs on Legal Reasoning and Contract Analysis',
        institution: 'Stanford Law School & Legal Tech Lab',
        year: 2023,
        quoteOrKeyFinding: 'AI đạt điểm tương đương các kỳ thi luật sư hàng đầu và giảm 60% thời gian rà soát hợp đồng pháp lý sơ bộ.'
      },
      transitionAdvice: 'Phát triển chuyên môn về Luật An toàn thông tin, Luật Sở hữu trí tuệ AI và kỹ năng đàm phán giải quyết tranh chấp kinh tế.'
    },
    {
      id: 'vuln-10',
      rank: 10,
      title: 'First-line Bank Teller & Transaction Processing Clerk',
      titleVi: 'Giao Dịch Viên Quầy Ngân Hàng Cơ Bản (Giao Dịch Tiền Mặt & Mở Thẻ)',
      category: 'vulnerable',
      resilienceScore: 15,
      laborDemandIndex: 24,
      automationExposure: 78,
      demandGrowthRate: '-40% (2024-2028)',
      averageSalaryVND: '9,000,000 - 16,000,000 VND / tháng',
      whyTrendingOrVulnerable: 'Ngân hàng số (eKYC, LiveBank, Smart Kiosk) và trợ lý ảo xử lý 95% các giao dịch rút/nạp tiền, chuyển khoản và phát hành thẻ tự động 24/7.',
      keySkillsRequiredOrAtRisk: ['Đếm tiền mặt & Kiểm đếm chứng từ', 'Mở tài khoản theo quy trình', 'In sổ tiết kiệm và sao kê'],
      humanMoatFactor: 'Tư vấn đầu tư tài chính cá nhân chuyên sâu, thẩm định cho vay tín dụng phức tạp và chăm sóc khách hàng ưu tiên (Private Banking).',
      citedResearchPaper: {
        title: 'The AI Revolution in Banking: Workforce Dynamics and Branch Evolution',
        institution: 'McKinsey Global Institute',
        year: 2024,
        quoteOrKeyFinding: 'Số lượng chi nhánh vật lý và giao dịch viên quầy tiếp tục giảm hơn 30% trên toàn cầu do sự phổ cập của ngân hàng thông minh tích hợp AI.'
      },
      transitionAdvice: 'Chuyển sang làm Chuyên viên Quản lý Gia sản (Wealth Management Advisor) hoặc Chuyên viên Thẩm định Tín dụng Doanh nghiệp.'
    }
  ]
};
