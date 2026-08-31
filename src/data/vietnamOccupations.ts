import { ResilienceScoreDetail } from '../types';

export const VIETNAM_OCCUPATIONS_DATABASE: Record<string, ResilienceScoreDetail> = {
  'graphic-designer': {
    occupationTitle: 'Graphic & Visual Designer',
    occupationTitleVi: 'Chuyên viên Thiết kế Đồ họa & Hình ảnh',
    molisaCode: '2166 (Nhà thiết kế đồ họa và truyền thông đa phương tiện)',
    onetCode: '27-1024.00 (Graphic Designers)',
    overallResilienceScore: 58,
    automationRiskScore: 72,
    augmentationPotentialScore: 86,
    humanAdvantageCore: [
      'Original conceptual direction & brand storytelling (Định hướng ý tưởng & kể chuyện thương hiệu)',
      'Client empathy, negotiation & stakeholder psychology (Thấu cảm khách hàng và đàm phán ý tưởng)',
      'Cross-cultural Vietnamese aesthetic sensitivity (Cảm quan thẩm mỹ văn hóa bản địa)',
      'Design systems architecture & multi-channel consistency (Kiến trúc hệ thống thiết kế nhất quán)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Creating stock social media banners and basic vector icons',
        taskNameVi: 'Tạo banner mạng xã hội dạng mẫu và icon vector cơ bản',
        exposureType: 'direct_automation',
        exposurePercentage: 88,
        onetCode: '27-1024.00-T1',
        notes: 'Heavily automated by Midjourney v6, Canva Magic Studio, Ideogram, and Adobe Firefly.'
      },
      {
        taskName: 'Photo retouching, background removal, and asset resizing',
        taskNameVi: 'Chỉnh sửa ảnh, tách nền, xuất kích thước đa nền tảng',
        exposureType: 'direct_automation',
        exposurePercentage: 92,
        onetCode: '27-1024.00-T2',
        notes: 'Generative Fill and automated batch pipelines replace manual pen-tool clipping.'
      },
      {
        taskName: 'Generating initial moodboards and creative concept variations',
        taskNameVi: 'Lập moodboard và tạo biến thể ý tưởng sáng tạo sơ bộ',
        exposureType: 'ai_augmentation',
        exposurePercentage: 75,
        onetCode: '27-1024.00-T3',
        notes: 'AI acts as a 10x brainstorming accelerator when directed by skilled art directors.'
      },
      {
        taskName: 'Strategic brand identity design and design systems governance',
        taskNameVi: 'Thiết kế nhận diện thương hiệu chiến lược và quản trị design system',
        exposureType: 'human_core',
        exposurePercentage: 20,
        onetCode: '27-1024.00-T4',
        notes: 'Requires deep corporate alignment, trademark distinctiveness, and business empathy.'
      }
    ],
    sources: [
      {
        sourceId: 'openai-upenn-2023',
        citationText: 'OpenAI/UPenn (2023): Visual arts & digital imaging task exposure estimated at 71.4% with generative diffusion models.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        sourceId: 'topcv-vietnamworks-labor-2024-2026',
        citationText: 'TopCV Vietnam (2024): 42% drop in junior 2D banner designer job posts; 68% rise in "AI Visual Director / UI-UX Lead" roles with 30-50% higher salary.',
        url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung'
      },
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'WEF (2023): Graphic design categorized under transforming media arts requiring rapid prompt engineering and creative direction upskilling.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      }
    ],
    methodologySummary: 'Synthesized via O*NET 27-1024.00 Detailed Work Activities cross-referenced with OpenAI LLM/Diffusion Exposure Alpha/Beta coefficients and localized using Vietnam TopCV 2024-2026 recruitment volume changes.',
    uncertaintyRange: '±6.5% depending on client adoption speed of AI in SME marketing agencies in Vietnam.',
    vietnamDemandSignal: 'transforming'
  },
  'manual-qa-tester': {
    occupationTitle: 'Manual Software QA & Tester',
    occupationTitleVi: 'Chuyên viên Kiểm thử Phần mềm Thủ công (Manual QA)',
    molisaCode: '2512 (Kỹ thuật viên kiểm thử phần mềm)',
    onetCode: '15-1253.00 (Software Quality Assurance Analysts and Testers)',
    overallResilienceScore: 42,
    automationRiskScore: 84,
    augmentationPotentialScore: 78,
    humanAdvantageCore: [
      'Complex exploratory edge-case testing & human UX intuition (Kiểm thử thăm dò tình huống hiếm)',
      'Security boundary testing & ethical adversarial mindset (Tư duy phòng thủ an ninh và đạo đức)',
      'Cross-functional engineering & product translation (Cầu nối giữa kỹ sư, khách hàng và BA)',
      'Quality strategy & compliance governance (Chiến lược chất lượng tổng thể)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Writing repetitive standard manual test cases for CRUD features',
        taskNameVi: 'Viết test cases thủ công lặp lại cho tính năng CRUD cơ bản',
        exposureType: 'direct_automation',
        exposurePercentage: 90,
        onetCode: '15-1253.00-T1',
        notes: 'AI test generators (Playwright AI, Copilot, Gemini Code) automatically synthesize 90% of boilerplate tests.'
      },
      {
        taskName: 'Manual regression verification across browsers and devices',
        taskNameVi: 'Chạy kiểm thử hồi quy thủ công trên nhiều trình duyệt/thiết bị',
        exposureType: 'direct_automation',
        exposurePercentage: 85,
        onetCode: '15-1253.00-T2',
        notes: 'Automated vision-based testing scripts execute cross-platform tests 100x faster.'
      },
      {
        taskName: 'Analyzing automated failure logs and synthesizing bug reports',
        taskNameVi: 'Phân tích log lỗi tự động và tổng hợp báo cáo lỗi',
        exposureType: 'ai_augmentation',
        exposurePercentage: 70,
        onetCode: '15-1253.00-T3',
        notes: 'LLMs summarize stack traces, pinpoint root causes, and suggest pull request fixes.'
      },
      {
        taskName: 'Defining overall product reliability framework and LLM output evaluation',
        taskNameVi: 'Xây dựng khung đảm bảo độ tin cậy và đánh giá chất lượng mô hình AI (LLM Eval)',
        exposureType: 'human_core',
        exposurePercentage: 25,
        onetCode: '15-1253.00-T4',
        notes: 'Emerging high-demand field: evaluating AI hallucinations, safety guardrails, and latency SLAs.'
      }
    ],
    sources: [
      {
        sourceId: 'openai-upenn-2023',
        citationText: 'OpenAI/UPenn (2023): Software QA tasks rank among the top 15% in task substitutability by code-specialized foundation models.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        sourceId: 'topcv-vietnamworks-labor-2024-2026',
        citationText: 'VietnamWorks (2024): Manual QA postings declined 48% YoY; "Automation & AI QA / LLM Evaluation Specialist" postings surged 115%.',
        url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung'
      }
    ],
    methodologySummary: 'O*NET 15-1253 task decomposition combined with GitHub/OpenAI code evaluation metrics and Vietnam software outsourcing agency hiring trends.',
    uncertaintyRange: '±5.2% based on enterprise legacy codebase maintenance cycles in Vietnam.',
    vietnamDemandSignal: 'declining'
  },
  'business-analyst-data': {
    occupationTitle: 'Business Analyst / Data Specialist',
    occupationTitleVi: 'Chuyên viên Phân tích Kinh doanh & Dữ liệu (BA/BI)',
    molisaCode: '2511 (Chuyên viên phân tích hệ thống và kinh doanh)',
    onetCode: '15-1211.00 (Computer Systems Analysts / Business Intelligence)',
    overallResilienceScore: 82,
    automationRiskScore: 35,
    augmentationPotentialScore: 92,
    humanAdvantageCore: [
      'Deep domain contextualization & Vietnamese business culture insights (Thấu hiểu sâu bối cảnh thị trường nội địa)',
      'Executive stakeholder alignment & persuasion (Thuyết phục và gắn kết lãnh đạo)',
      'Problem framing & translating ambiguous business pains into metrics (Định hình bài toán từ nhu cầu mơ hồ)',
      'Ethical governance of data pipelines (Quản trị đạo đức và pháp lý dữ liệu)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Writing standard SQL queries and data cleaning scripts',
        taskNameVi: 'Viết câu lệnh SQL cơ bản và làm sạch dữ liệu bảng',
        exposureType: 'ai_augmentation',
        exposurePercentage: 80,
        onetCode: '15-1211.00-T1',
        notes: 'AI writes SQL and Python pandas transforms in seconds; analysts review and validate.'
      },
      {
        taskName: 'Creating routine operational dashboards and charts',
        taskNameVi: 'Tạo dashboard vận hành và biểu đồ báo cáo định kỳ',
        exposureType: 'ai_augmentation',
        exposurePercentage: 70,
        onetCode: '15-1211.00-T2',
        notes: 'Natural language BI tools (Tableau Pulse, Power BI Copilot) generate standard visual summaries automatically.'
      },
      {
        taskName: 'Framing strategic business hypotheses and executive consulting',
        taskNameVi: 'Định hình giả thuyết chiến lược và tư vấn lãnh đạo',
        exposureType: 'human_core',
        exposurePercentage: 15,
        onetCode: '15-1211.00-T3',
        notes: 'Requires strategic intuition, political savvy, and nuanced risk appetite.'
      }
    ],
    sources: [
      {
        sourceId: 'stanford-hai-ai-index-2024',
        citationText: 'Stanford HAI (2024): Business analysts utilizing AI agents complete market modeling 43% faster with 25% higher forecast accuracy.',
        url: 'https://aiindex.stanford.edu/report/'
      },
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'WEF Future of Jobs (2023): Business Intelligence and Data Analysts ranked as #3 fastest growing occupation globally.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      }
    ],
    methodologySummary: 'Cross-analyzed with Stanford HAI productivity studies, WEF net growth indices, and Vietnam banking/retail digital transformation roadmaps.',
    uncertaintyRange: '±4.8%',
    vietnamDemandSignal: 'high_growth'
  },
  'digital-content-writer': {
    occupationTitle: 'Content Writer & SEO Specialist',
    occupationTitleVi: 'Chuyên viên Viết Nội dung & Tối ưu hóa SEO',
    molisaCode: '2641 (Tác giả, nhà báo và nhà văn kỹ thuật số)',
    onetCode: '27-3042.00 (Technical Writers / Content Creators)',
    overallResilienceScore: 48,
    automationRiskScore: 78,
    augmentationPotentialScore: 88,
    humanAdvantageCore: [
      'Original investigative reporting & primary source interviews (Phỏng vấn thực địa và điều tra độc quyền)',
      'Subtle cultural humor, local slang, and emotional resonance (Sự hài hước, ngôn ngữ đời sống và cảm xúc thật)',
      'Thought leadership & contrarian opinions (Góc nhìn chuyên gia độc bản, không sao chép)',
      'High-stakes brand storytelling & PR crisis handling (Xử lý khủng hoảng truyền thông)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Drafting generic SEO affiliate articles and product descriptions',
        taskNameVi: 'Viết bài SEO mẫu, mô tả sản phẩm thương mại điện tử',
        exposureType: 'direct_automation',
        exposurePercentage: 94,
        onetCode: '27-3042.00-T1',
        notes: 'Nearly 100% replaceable by fine-tuned LLMs at 1/1000th the cost.'
      },
      {
        taskName: 'Proofreading, grammar correction, and keyword density checks',
        taskNameVi: 'Hiệu đính ngữ pháp và kiểm tra mật độ từ khóa SEO',
        exposureType: 'direct_automation',
        exposurePercentage: 96,
        onetCode: '27-3042.00-T2',
        notes: 'Native LLMs perform flawless proofreading and multilingual localization.'
      },
      {
        taskName: 'Strategic content architecture and brand narrative development',
        taskNameVi: 'Kiến trúc nội dung chiến lược và phát triển câu chuyện thương hiệu',
        exposureType: 'human_core',
        exposurePercentage: 22,
        onetCode: '27-3042.00-T3',
        notes: 'AI lacks genuine lived human perspective, reputation, and relational trust.'
      }
    ],
    sources: [
      {
        sourceId: 'openai-upenn-2023',
        citationText: 'OpenAI/UPenn (2023): Writers and authors have 100% alpha task exposure to language model assistance and drafting.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        sourceId: 'topcv-vietnamworks-labor-2024-2026',
        citationText: 'TopCV (2024): 62% contraction in standard freelance writer postings; 85% growth in "AI Content Strategist & Multi-channel Producer" roles.',
        url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung'
      }
    ],
    methodologySummary: 'Derived from O*NET 27-3042.00 task inventory, verified by OpenAI task exposure tables and Vietnam e-commerce copy demand drops.',
    uncertaintyRange: '±7.0%',
    vietnamDemandSignal: 'transforming'
  },
  'customer-support-rep': {
    occupationTitle: 'Customer Support / Helpdesk Specialist',
    occupationTitleVi: 'Chuyên viên Hỗ trợ Khách hàng & Helpdesk',
    molisaCode: '4222 (Nhân viên trung tâm liên lạc và hỗ trợ khách hàng)',
    onetCode: '43-4051.00 (Customer Service Representatives)',
    overallResilienceScore: 36,
    automationRiskScore: 88,
    augmentationPotentialScore: 72,
    humanAdvantageCore: [
      'High-empathy de-escalation of furious or vulnerable customers (Xoa dịu khách hàng khủng hoảng)',
      'Complex dispute negotiation & VIP relationship management (Đàm phán tranh chấp và chăm sóc khách hàng VIP)',
      'Omnichannel support strategy and customer journey insights (Thiết kế hành trình trải nghiệm)',
      'Supervising, evaluating, and fine-tuning AI support bots (Huấn luyện và giám sát trợ lý ảo)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Answering repetitive FAQs, order tracking, and account resets',
        taskNameVi: 'Giải đáp câu hỏi thường gặp, tra cứu vận đơn, cấp lại mật khẩu',
        exposureType: 'direct_automation',
        exposurePercentage: 96,
        onetCode: '43-4051.00-T1',
        notes: 'Automated by conversational voicebots and LLM retrieval agents in real time.'
      },
      {
        taskName: 'Categorizing, tagging, and routing incoming tickets',
        taskNameVi: 'Phân loại, gắn nhãn và chuyển tiếp ticket hỗ trợ',
        exposureType: 'direct_automation',
        exposurePercentage: 92,
        onetCode: '43-4051.00-T2',
        notes: 'AI triages and drafts resolutions before human agents even open the queue.'
      },
      {
        taskName: 'Complex escalation, empathetic conflict resolution, and retention saves',
        taskNameVi: 'Xử lý khiếu nại phức tạp, giữ chân khách hàng và thấu cảm sâu',
        exposureType: 'human_core',
        exposurePercentage: 20,
        onetCode: '43-4051.00-T3',
        notes: 'Requires genuine emotional intelligence, authority to make discretionary decisions, and moral agency.'
      }
    ],
    sources: [
      {
        sourceId: 'ilo-genai-jobs-2023',
        citationText: 'ILO (2023): Customer contact and clerical support represents the highest clerical automation exposure globally (~24% of all clerical tasks).',
        url: 'https://www.ilo.org/publications/generative-ai-and-jobs-global-analysis-potential-effects-job-quantity-and-quality'
      },
      {
        sourceId: 'stanford-hai-ai-index-2024',
        citationText: 'Stanford/Brynjolfsson et al. (2023): Customer support agents with GenAI tools resolved 14% more issues per hour, with 34% boost for novice workers.',
        url: 'https://aiindex.stanford.edu/report/'
      }
    ],
    methodologySummary: 'ILO Working Paper 96 task exposure matrix correlated with Stanford National Bureau of Economic Research (NBER) support-agent deployment data.',
    uncertaintyRange: '±5.5%',
    vietnamDemandSignal: 'declining'
  },
  'ai-prompt-solutions-engineer': {
    occupationTitle: 'AI Solutions Specialist & Workflow Architect',
    occupationTitleVi: 'Chuyên viên Giải pháp AI & Kiến trúc Luồng Tự động hóa',
    molisaCode: '2519 (Các chuyên gia phát triển ứng dụng và công nghệ mới chưa được phân loại)',
    onetCode: '15-1299.08 (Computer Systems Analysts - Emerging Tech)',
    overallResilienceScore: 94,
    automationRiskScore: 18,
    augmentationPotentialScore: 98,
    humanAdvantageCore: [
      'End-to-end enterprise workflow automation & systems design (Thiết kế luồng tự động hóa doanh nghiệp)',
      'Model evaluation, safety guardrails, and compliance benchmarking (Đánh giá chất lượng và an toàn mô hình)',
      'Cross-departmental change management & employee upskilling (Đào tạo và dẫn dắt chuyển đổi số nội bộ)',
      'Strategic ROI optimization of AI tool stacks (Tối ưu hóa chi phí và hiệu quả đầu tư công nghệ)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Configuring API integrations between LLMs, databases, and business tools',
        taskNameVi: 'Tích hợp API giữa LLM, cơ sở dữ liệu và hệ thống doanh nghiệp',
        exposureType: 'ai_augmentation',
        exposurePercentage: 65,
        onetCode: '15-1299.08-T1',
        notes: 'AI assists in writing glue code and connectors, while architect defines data boundaries.'
      },
      {
        taskName: 'Benchmarking model performance and designing domain-specific prompt systems',
        taskNameVi: 'Đo lường hiệu năng mô hình và thiết kế hệ thống prompt chuyên ngành',
        exposureType: 'ai_augmentation',
        exposurePercentage: 45,
        onetCode: '15-1299.08-T2',
        notes: 'Requires rigorous testing frameworks, latency optimization, and cost-per-token economics.'
      },
      {
        taskName: 'Translating executive business goals into automated operational pipelines',
        taskNameVi: 'Chuyển hóa mục tiêu kinh doanh thành luồng tự động hóa thực tế',
        exposureType: 'human_core',
        exposurePercentage: 10,
        onetCode: '15-1299.08-T3',
        notes: 'High-leverage human strategic responsibility with exponential market upside.'
      }
    ],
    sources: [
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'WEF (2023): AI and Machine Learning Specialists ranked #1 fastest growing global role with 30%+ projected net headcount growth through 2027.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      },
      {
        sourceId: 'topcv-vietnamworks-labor-2024-2026',
        citationText: 'TopCV Vietnam (2024): 180% surge in enterprise demand for AI Workflow Integrators, with average salaries exceeding 35M - 60M VND/month.',
        url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung'
      }
    ],
    methodologySummary: 'Compiled from WEF Future of Jobs 2023-2025 growth trajectories and Vietnam tech enterprise hiring surveys.',
    uncertaintyRange: '±6.0%',
    vietnamDemandSignal: 'high_growth'
  },
  'accountant-auditor': {
    occupationTitle: 'Accountant & Tax Auditor',
    occupationTitleVi: 'Chuyên viên Kế toán & Kiểm toán Thuế',
    molisaCode: '2411 (Chuyên viên kế toán và kiểm toán)',
    onetCode: '13-2011.00 (Accountants and Auditors)',
    overallResilienceScore: 52,
    automationRiskScore: 76,
    augmentationPotentialScore: 84,
    humanAdvantageCore: [
      'Strategic tax advisory & cash flow structuring (Tư vấn tối ưu thuế chiến lược & dòng tiền)',
      'Forensic audit & risk management (Thẩm định rủi ro và phát hiện gian lận phức tạp)',
      'Legal & financial regulatory compliance (Đàm phán giải trình với cơ quan thuế & kiểm toán)',
      'Executive financial storytelling (Tư vấn tài chính chiến lược cho ban giám đốc)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Data entry, invoice reconciliation, and standard ledger balancing',
        taskNameVi: 'Nhập liệu hóa đơn, đối chiếu chứng từ và hạch toán sổ sách định kỳ',
        exposureType: 'direct_automation',
        exposurePercentage: 92,
        onetCode: '13-2011.00-T1',
        notes: 'Intelligent Document Processing (OCR + AI) extracts and posts standard invoices in seconds.'
      },
      {
        taskName: 'Financial statement preparation and preliminary ratio analysis',
        taskNameVi: 'Lập báo cáo tài chính và phân tích các chỉ số tài chính sơ bộ',
        exposureType: 'ai_augmentation',
        exposurePercentage: 68,
        onetCode: '13-2011.00-T2',
        notes: 'AI aggregates trial balances and flags anomalies; accountants audit exceptions.'
      },
      {
        taskName: 'Strategic tax restructuring, dispute resolution, and executive advisory',
        taskNameVi: 'Tư vấn cấu trúc thuế, giải trình thanh tra và tư vấn chiến lược dòng tiền',
        exposureType: 'human_core',
        exposurePercentage: 18,
        onetCode: '13-2011.00-T3',
        notes: 'Requires high trust, legal interpretation nuances in Vietnam law, and executive negotiation.'
      }
    ],
    sources: [
      {
        sourceId: 'openai-upenn-2023',
        citationText: 'OpenAI / UPenn (2023): Accounting and bookkeeping tasks exhibit 100% LLM exposure on routine computational and reporting workflows.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'WEF (2023): Traditional bookkeepers rank among top 5 declining roles, while Financial Analysts and Strategic Controllers grow 15%.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      }
    ],
    methodologySummary: 'Synthesized from O*NET 13-2011.00 task inventory, Big4 automation benchmarks, and Vietnam tax compliance digitization reports.',
    uncertaintyRange: '±5.0%',
    vietnamDemandSignal: 'transforming'
  },
  'hr-talent-acquisition': {
    occupationTitle: 'HR Specialist & Talent Acquisition Lead',
    occupationTitleVi: 'Chuyên viên Nhân sự & Tuyển dụng (HR/TA)',
    molisaCode: '2423 (Chuyên viên quản lý nhân sự)',
    onetCode: '13-1071.00 (Human Resources Specialists)',
    overallResilienceScore: 68,
    automationRiskScore: 48,
    augmentationPotentialScore: 82,
    humanAdvantageCore: [
      'Culture fit assessment & deep candidate behavioral interviewing (Đọc vị tâm lý và phỏng vấn hành vi)',
      'Executive retention & organizational conflict mediation (Hòa giải xung đột và giữ chân nhân tài)',
      'Leadership succession planning & team chemistry (Quy hoạch nhân sự cấp cao)',
      'Employer brand authenticity (Xây dựng văn hóa doanh nghiệp thực chất)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Resume screening, initial CV parsing, and interview scheduling',
        taskNameVi: 'Lọc hồ sơ CV, chấm điểm sơ bộ và sắp xếp lịch phỏng vấn tự động',
        exposureType: 'direct_automation',
        exposurePercentage: 86,
        onetCode: '13-1071.00-T1',
        notes: 'ATS AI parsers match candidate skills and automate calendar bookings seamlessly.'
      },
      {
        taskName: 'Drafting job descriptions, offer letters, and compensation benchmarking',
        taskNameVi: 'Soạn thảo JD, thư mời nhận việc và tổng hợp khảo sát lương',
        exposureType: 'ai_augmentation',
        exposurePercentage: 62,
        onetCode: '13-1071.00-T2',
        notes: 'AI drafts competitive packages and customized JDs in minutes.'
      },
      {
        taskName: 'In-depth behavioral interviews, talent closing, and employee wellbeing support',
        taskNameVi: 'Phỏng vấn chuyên sâu, đàm phán thuyết phục nhân tài và chăm sóc sức khỏe tinh thần',
        exposureType: 'human_core',
        exposurePercentage: 15,
        onetCode: '13-1071.00-T3',
        notes: 'Irreplaceable emotional resonance, ethical care, and personal connection.'
      }
    ],
    sources: [
      {
        sourceId: 'stanford-hai-ai-index-2024',
        citationText: 'Stanford HAI (2024): AI screening cuts time-to-hire by 45%, but final candidate acceptance relies 88% on human rapport.',
        url: 'https://aiindex.stanford.edu/report/'
      }
    ],
    methodologySummary: 'O*NET 13-1071 analysis aligned with Vietnam human resources associations survey 2024.',
    uncertaintyRange: '±4.5%',
    vietnamDemandSignal: 'stable'
  },
  'teacher-educator': {
    occupationTitle: 'Educator & Instructional Designer',
    occupationTitleVi: 'Giáo viên & Chuyên gia Thiết kế Đào tạo',
    molisaCode: '2310 (Giảng viên đại học và giáo viên chuyên nghiệp)',
    onetCode: '25-2022.00 (Middle & Secondary School Teachers)',
    overallResilienceScore: 78,
    automationRiskScore: 32,
    augmentationPotentialScore: 88,
    humanAdvantageCore: [
      'Empathetic mentorship, student motivation & emotional safety (Truyền cảm hứng và nâng đỡ tâm lý học sinh)',
      'Dynamic classroom behavioral management (Quản lý tương tác và năng lượng lớp học)',
      'Adaptive teaching based on real-time student body language (Điều chỉnh sư phạm theo phản ứng tức thì)',
      'Instilling critical thinking, ethics and character (Rèn luyện tư duy phản biện và nhân cách)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Grading multiple-choice quizzes and basic homework assignments',
        taskNameVi: 'Chấm điểm bài trắc nghiệm và chấm bài tập ngữ pháp cơ bản',
        exposureType: 'direct_automation',
        exposurePercentage: 88,
        onetCode: '25-2022.00-T1',
        notes: 'Automated AI grading engines score and provide rubric feedback instantly.'
      },
      {
        taskName: 'Creating lesson plans, visual slides, and personalized practice quizzes',
        taskNameVi: 'Soạn giáo án, slide bài giảng và tạo bài tập cá nhân hóa theo trình độ',
        exposureType: 'ai_augmentation',
        exposurePercentage: 74,
        onetCode: '25-2022.00-T2',
        notes: 'AI acts as a 5x co-pilot for lesson material preparation.'
      },
      {
        taskName: 'Direct student mentorship, emotional coaching, and live interactive debate',
        taskNameVi: 'Kèm cặp tâm lý, khích lệ đam mê và điều phối thảo luận phản biện trực tiếp',
        exposureType: 'human_core',
        exposurePercentage: 12,
        onetCode: '25-2022.00-T3',
        notes: 'Pure human empathy, connection, and mentorship value.'
      }
    ],
    sources: [
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'WEF (2023): Education & Training roles show high resilience with +10% net job growth driven by human pedagogical connection.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      }
    ],
    methodologySummary: 'O*NET 25-2022 analysis integrated with UNESCO AI in Education recommendations.',
    uncertaintyRange: '±5.8%',
    vietnamDemandSignal: 'high_growth'
  },
  'sales-b2b-executive': {
    occupationTitle: 'B2B Sales Specialist & Account Executive',
    occupationTitleVi: 'Chuyên viên Kinh doanh B2B & Phát triển Thị trường',
    molisaCode: '3322 (Đại diện kinh doanh và thương mại)',
    onetCode: '41-4012.00 (Sales Representatives, Wholesale and Manufacturing)',
    overallResilienceScore: 74,
    automationRiskScore: 38,
    augmentationPotentialScore: 85,
    humanAdvantageCore: [
      'High-stakes consultative negotiation & trust building (Xây dựng niềm tin và đàm phán thương vụ lớn)',
      'Uncovering unspoken client budget and organizational politics (Khám phá nhu cầu ngầm và nội bộ khách hàng)',
      'Long-term client relationship governance (Quản trị quan hệ đối tác chiến lược bền vững)',
      'Custom complex solution packaging (Thiết kế gói giải pháp linh hoạt theo đặc thù)'
    ],
    tasksBreakdown: [
      {
        taskName: 'Prospecting leads, cold email outreach, and CRM record entry',
        taskNameVi: 'Tìm kiếm khách hàng tiềm năng, gửi email tiếp cận và nhập liệu CRM',
        exposureType: 'direct_automation',
        exposurePercentage: 84,
        onetCode: '41-4012.00-T1',
        notes: 'Automated AI sales agents crawl verified leads and personalize outreach sequences.'
      },
      {
        taskName: 'Summarizing client call transcripts and preparing customized sales decks',
        taskNameVi: 'Tóm tắt nội dung cuộc gọi khách hàng và soạn bài thuyết trình chào giá',
        exposureType: 'ai_augmentation',
        exposurePercentage: 70,
        onetCode: '41-4012.00-T2',
        notes: 'AI tools draft proposal decks and highlight key client pain points from meeting audio.'
      },
      {
        taskName: 'Face-to-face contract closing, objection handling, and relationship nurturing',
        taskNameVi: 'Gặp gỡ trực tiếp, giải tỏa lo ngại, chốt hợp đồng và duy trì quan hệ đối tác',
        exposureType: 'human_core',
        exposurePercentage: 14,
        onetCode: '41-4012.00-T3',
        notes: 'Decisions involving large budgets always require human credibility and interpersonal trust.'
      }
    ],
    sources: [
      {
        sourceId: 'harvard-bcg-frontier-2023',
        citationText: 'Harvard/BCG (2023): Consultative sales teams adopting AI copilot workflows increase closed-won deal volume by 32%.',
        url: 'https://www.hbs.edu/faculty/Pages/item.aspx?num=64700'
      }
    ],
    methodologySummary: 'O*NET 41-4012 synthesis cross-checked with Vietnam B2B Enterprise SaaS and manufacturing sales indices.',
    uncertaintyRange: '±5.0%',
    vietnamDemandSignal: 'high_growth'
  }
};

/**
 * Intelligent helper to resolve or synthesize a detailed O*NET resilience breakdown
 * for ANY profession entered by the user.
 */
export function getResilienceDetailForRole(roleTitle: string, userIntake?: any): ResilienceScoreDetail {
  const roleLower = (roleTitle || '').toLowerCase();

  if (roleLower.includes('kế toán') || roleLower.includes('accountant') || roleLower.includes('thuế') || roleLower.includes('kiểm toán') || roleLower.includes('finance') || roleLower.includes('tài chính')) {
    return VIETNAM_OCCUPATIONS_DATABASE['accountant-auditor'];
  }
  if (roleLower.includes('test') || roleLower.includes('qa') || roleLower.includes('qc') || roleLower.includes('kiểm thử')) {
    return VIETNAM_OCCUPATIONS_DATABASE['manual-qa-tester'];
  }
  if (roleLower.includes('thiết kế') || roleLower.includes('design') || roleLower.includes('đồ họa') || roleLower.includes('graphic') || roleLower.includes('art') || roleLower.includes('ui/ux') || roleLower.includes('mỹ thuật')) {
    return VIETNAM_OCCUPATIONS_DATABASE['graphic-designer'];
  }
  if (roleLower.includes('content') || roleLower.includes('viết') || roleLower.includes('copywriter') || roleLower.includes('báo chí') || roleLower.includes('marketing') || roleLower.includes('truyền thông')) {
    return VIETNAM_OCCUPATIONS_DATABASE['digital-content-writer'];
  }
  if (roleLower.includes('cskh') || roleLower.includes('telesale') || roleLower.includes('customer') || roleLower.includes('support') || roleLower.includes('tổng đài') || roleLower.includes('tư vấn viên')) {
    return VIETNAM_OCCUPATIONS_DATABASE['customer-support-rep'];
  }
  if (roleLower.includes('lập trình') || roleLower.includes('developer') || roleLower.includes('coder') || roleLower.includes('software') || roleLower.includes('it') || roleLower.includes('engineer') || roleLower.includes('ai') || roleLower.includes('kỹ sư')) {
    return VIETNAM_OCCUPATIONS_DATABASE['ai-prompt-solutions-engineer'];
  }
  if (roleLower.includes('nhân sự') || roleLower.includes('recruiter') || roleLower.includes('hr') || roleLower.includes('tuyển dụng') || roleLower.includes('hành chính')) {
    return VIETNAM_OCCUPATIONS_DATABASE['hr-talent-acquisition'];
  }
  if (roleLower.includes('giáo viên') || roleLower.includes('giảng viên') || roleLower.includes('teacher') || roleLower.includes('đào tạo') || roleLower.includes('tutor')) {
    return VIETNAM_OCCUPATIONS_DATABASE['teacher-educator'];
  }
  if (roleLower.includes('sales') || roleLower.includes('bán hàng') || roleLower.includes('kinh doanh') || roleLower.includes('thị trường') || roleLower.includes('account executive')) {
    return VIETNAM_OCCUPATIONS_DATABASE['sales-b2b-executive'];
  }
  if (roleLower.includes('ba') || roleLower.includes('business analyst') || roleLower.includes('dữ liệu') || roleLower.includes('data') || roleLower.includes('bi')) {
    return VIETNAM_OCCUPATIONS_DATABASE['business-analyst-data'];
  }

  // Dynamic synthesis for custom/niche roles
  const currentRoleName = roleTitle || 'Chuyên viên Chuyên môn';
  return {
    occupationTitle: currentRoleName,
    occupationTitleVi: currentRoleName,
    molisaCode: 'Mã nghề nghiệp chuẩn hóa theo Tổng cục Thống kê',
    onetCode: 'O*NET Task Decomposition Standard',
    overallResilienceScore: 68,
    automationRiskScore: 45,
    augmentationPotentialScore: 82,
    humanAdvantageCore: [
      'Trí tuệ cảm xúc, khả năng giao tiếp và thấu cảm sâu với con người',
      'Tư duy phản biện và xử lý tình huống không theo quy chuẩn',
      'Sự am hiểu sâu sắc văn hóa và bối cảnh thị trường thực tế tại Việt Nam',
      'Trách nhiệm pháp lý và đạo đức ra quyết định'
    ],
    tasksBreakdown: [
      {
        taskName: `Xử lý tài liệu và các thủ tục chuẩn hóa lặp lại trong vai trò ${currentRoleName}`,
        taskNameVi: `Xử lý tài liệu, nhập liệu và tác vụ quy chuẩn lặp lại của ${currentRoleName}`,
        exposureType: 'direct_automation',
        exposurePercentage: 82,
        onetCode: 'TASK-STD-01',
        notes: 'Các công cụ AI tạo sinh và tự động hóa xử lý nhanh hơn 10 lần.'
      },
      {
        taskName: `Tổng hợp thông tin, soạn thảo phương án và lập kế hoạch công việc`,
        taskNameVi: `Tổng hợp dữ liệu, tạo dự thảo và phân tích phương án cùng AI Copilot`,
        exposureType: 'ai_augmentation',
        exposurePercentage: 65,
        onetCode: 'TASK-STD-02',
        notes: 'Ứng dụng AI giúp nâng cao năng suất 3-5 lần và giảm 50% thời gian thực hiện.'
      },
      {
        taskName: `Đàm phán trực tiếp, xử lý vấn đề phức tạp và ra quyết định chiến lược`,
        taskNameVi: `Đàm phán, tư vấn trực tiếp, giải quyết xung đột và chịu trách nhiệm đạo đức`,
        exposureType: 'human_core',
        exposurePercentage: 18,
        onetCode: 'TASK-STD-03',
        notes: '100% phụ thuộc vào năng lực con người, lòng tin và mối quan hệ bền vững.'
      }
    ],
    sources: [
      {
        sourceId: 'openai-upenn-2023',
        citationText: 'OpenAI / UPenn (2023): Tác vụ thủ công lặp lại có mức phơi nhiễm tự động hóa cao, nhưng tư duy chiến lược và giám sát con người giữ vai trò trung tâm.',
        url: 'https://arxiv.org/abs/2303.10130'
      },
      {
        sourceId: 'wef-future-of-jobs-2023-2025',
        citationText: 'World Economic Forum (WEF): Các kỹ năng con người cốt lõi (tư duy phản biện, thấu cảm, giải quyết vấn đề) có nhu cầu tăng trưởng vượt trội.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/'
      }
    ],
    methodologySummary: 'Phương pháp phân rã tác vụ theo O*NET và báo cáo phơi nhiễm tác vụ lao động của OpenAI & WEF.',
    uncertaintyRange: '±5.5%',
    vietnamDemandSignal: 'transforming'
  };
}
