import { CareerSuggestion, UserIntakeProfile } from '../types';
import { VIETNAM_OCCUPATIONS_DATABASE } from './vietnamOccupations';

export interface GoldenPersona {
  id: string;
  name: string;
  nameVi: string;
  currentRole: string;
  avatarSeed: string;
  summaryQuote: string;
  intakeProfile: UserIntakeProfile;
  suggestions: CareerSuggestion[];
}

export const GOLDEN_PROFILES: GoldenPersona[] = [
  {
    id: 'persona-thao-designer',
    name: 'Lê Minh Thảo',
    nameVi: 'Lê Minh Thảo (TP. Hồ Chí Minh)',
    currentRole: 'Junior Graphic Designer (2.5 năm kinh nghiệm)',
    avatarSeed: 'Thao',
    summaryQuote: 'Thấy Midjourney v6 và Canva AI tạo banner chỉ trong 10 giây, em lo 2 năm nữa thị trường freelancer và agency không còn chỗ cho 2D designer truyền thống.',
    intakeProfile: {
      fullName: 'Lê Minh Thảo',
      currentRole: 'Graphic Designer',
      experienceYears: 2.5,
      education: 'Cử nhân Thiết kế Đồ họa (Đại học Kiến Trúc TP.HCM)',
      location: 'TP. Hồ Chí Minh',
      interests: ['Visual Design', 'UI/UX', 'AI Art Direction', 'Branding', 'Photography'],
      personalityTraits: ['Sáng tạo', 'Tỉ mỉ', 'Thích quan sát xu hướng', 'Trực giác thẩm mỹ cao'],
      needsPriorities: {
        salary: 4,
        stability: 4,
        meaning: 5,
        remoteFlexibility: 4,
        workLifeBalance: 3
      },
      strengths: ['Adobe Creative Suite (Photoshop, Illustrator)', 'Cảm quan màu sắc & bố cục', 'Lắng nghe brief khách hàng', 'Thấu cảm thương hiệu'],
      weaknesses: ['Chưa biết lập trình giao diện', 'Chưa có quy trình kiểm soát prompt AI nâng cao', 'Ngại số liệu định lượng'],
      constraints: {
        budgetVND: 2500000,
        hoursPerWeekAvailable: 12,
        preferredLocation: 'TP. Hồ Chí Minh / Hybrid',
        riskTolerance: 'moderate'
      },
      values: ['Tính sáng tạo độc bản', 'Sự công nhận nghề nghiệp', 'Thu nhập bền vững theo năng lực'],
      workStyle: 'Làm việc theo dự án linh hoạt, thích môi trường agency năng động hoặc product studio',
      forecastMode: 'realistic'
    },
    suggestions: [
      {
        id: 'sug-thao-1',
        roleTitle: 'AI Art Director & Brand Narrative Specialist',
        roleTitleVi: 'Giám đốc Mỹ thuật Ứng dụng AI & Kể chuyện Thương hiệu',
        aiResilienceScore: 84,
        matchScore: 92,
        reasoning: 'Tận dụng trực giác thẩm mỹ và năng lực định hướng thị giác sẵn có để chuyển từ "người vẽ thuê từng chi tiết" sang "nhạc trưởng điều phối luồng sáng tạo AI" cho chiến dịch đa kênh.',
        whyItFitsYou: 'Bạn có nền tảng học thuật thiết kế vững chắc (Arch Uni), điều mà người dùng AI phong trào thiếu. Kết hợp năng lực curation thẩm mỹ với khả năng kiểm soát prompt và design system sẽ đưa bạn lên vị trí quản lý sáng tạo.',
        transferableSkillsMatch: ['Bố cục thị giác & Color theory', 'Thấu hiểu brand guidelines', 'Kỹ năng làm việc với Art Director', 'Kể chuyện bằng hình ảnh'],
        skillsGap: ['Kỹ thuật Prompting & Inpainting chuyên sâu (Midjourney, ComfyUI, ControlNet)', 'Quản lý dự án sáng tạo AI (AI Creative Workflow)', 'Xây dựng Design System quy chuẩn cho Product'],
        averageSalaryRangeVND: '22,000,000 - 45,000,000 VND / tháng',
        evidenceCitations: [
          {
            paperTitle: 'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of LLMs',
            source: 'OpenAI / University of Pennsylvania',
            year: 2023,
            url: 'https://arxiv.org/abs/2303.10130',
            quoteOrDataPoint: 'Task exposure in 2D illustration is 71.4%, but higher-order conceptual direction and brand alignment remain strongly human-dependent.'
          },
          {
            paperTitle: 'Vietnam Labor Market Report 2024-2026',
            source: 'TopCV Vietnam Analytics',
            year: 2024,
            url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung',
            quoteOrDataPoint: 'Agency tuyển dụng vị trí "AI Art Director" trả mức lương cao hơn 35-50% so với Designer truyền thống cùng số năm kinh nghiệm.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['graphic-designer'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Stay & Become AI Art Director',
            pathTitleVi: 'Ở lại ngành Sáng tạo & Lên Giám đốc Mỹ thuật Ứng dụng AI',
            feasibilityScore: 88,
            estimatedTimelineMonths: 4,
            shortDescription: 'Nâng cấp quy trình thiết kế hiện tại: làm chủ ComfyUI, ControlNet, Photoshop Firefly để tăng tốc độ ra concept gấp 5 lần và giữ vai trò Art Lead.',
            targetRoles: ['Senior Graphic & AI Specialist', 'Associate Art Director', 'Creative Lead'],
            skillsToAcquire: ['ComfyUI & ControlNet parameters', 'Adobe Firefly Advanced Workflow', 'Creative Concept Pitching'],
            transferableSkills: ['Màu sắc, Typography, Brand Empathy'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [14, 20, 28, 36, 45],
            rationale: 'Rủi ro thấp nhất vì bạn phát huy 100% kinh nghiệm thẩm mỹ sẵn có và gia tăng năng suất vượt trội.',
            actionStepNow: 'Thực hành tạo 1 bộ nhận diện thương hiệu hoàn chỉnh phối hợp ComfyUI + Illustrator trong tuần này.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to UI/UX Product Designer with AI',
            pathTitleVi: 'Chuyển nhánh sang Thiết kế Trải nghiệm Sản phẩm (UI/UX Product Design)',
            feasibilityScore: 78,
            estimatedTimelineMonths: 6,
            shortDescription: 'Chuyển dịch sang mảng thiết kế sản phẩm số (App/Web UI/UX), nơi bài toán tập trung vào luồng người dùng, tâm lý học hành vi và kiến trúc thông tin.',
            targetRoles: ['UI/UX Designer', 'Product Designer', 'AI Interaction Designer'],
            skillsToAcquire: ['Figma & Component Auto-layout', 'User Research & Usability Testing', 'AI-assisted Rapid Wireframing'],
            transferableSkills: ['Visual hierarchy, Thiết kế icon, Cảm quan giao diện'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [14, 22, 32, 42, 55],
            rationale: 'Thị trường Tech Product tại VN có nhu cầu tuyển UI/UX ổn định với khung lương cao hơn agency quảng cáo.',
            actionStepNow: 'Hoàn thành 1 case study thiết kế Redesign ứng dụng di động có áp dụng AI wireframing trong Figma.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Full Switch to 3D & Spatial Interaction Design',
            pathTitleVi: 'Chuyển hẳn sang Thiết kế Không gian & Tương tác 3D (Spatial Design)',
            feasibilityScore: 55,
            estimatedTimelineMonths: 12,
            shortDescription: 'Đầu tư học Blender, Unreal Engine, Spline để bước vào lĩnh vực thiết kế 3D, game asset và giao diện AR/VR.',
            targetRoles: ['3D Motion Designer', 'Spatial Experience Designer', 'Game Asset Artist'],
            skillsToAcquire: ['Blender 3D Modeling & Shader', 'Spline 3D Web Integration', 'Unreal Engine basics'],
            transferableSkills: ['Tư duy thẩm mỹ, ánh sáng, chất liệu'],
            riskLevel: 'high',
            fiveYearSalaryProjection: [14, 18, 30, 48, 65],
            rationale: 'Đường cong học tập dốc (12 tháng), đòi hỏi cấu hình máy tính mạnh, nhưng ít bị cạnh tranh bởi AI đại trà.',
            actionStepNow: 'Cài đặt Blender và hoàn thành khóa học căn bản Donut tutorial trong 2 tuần.'
          }
        ],
        roadmap: [
          {
            id: 'thao-m1',
            milestoneNumber: 1,
            phaseName: 'Foundation & AI Tooling',
            phaseNameVi: 'Giai đoạn 1: Nền tảng & Tích hợp Công cụ AI thế hệ mới',
            title: 'Master Generative Creative Toolchain',
            titleVi: 'Làm chủ Bộ công cụ Sáng tạo AI (Midjourney v6, ComfyUI, Adobe Firefly)',
            estimatedHours: 35,
            weeksDuration: 4,
            skillsCovered: ['Prompt Engineering for Visual Arts', 'Image-to-Image & Inpainting', 'Consistent Character & Brand Styling'],
            freeResources: [
              {
                name: 'OpenArt AI Prompt Book & ComfyUI Academy',
                provider: 'OpenArt (Free Guide)',
                url: 'https://openart.ai/promptbook',
                type: 'doc'
              },
              {
                name: 'Adobe Firefly Professional Workflow Series',
                provider: 'Adobe Creative Cloud YouTube',
                url: 'https://www.youtube.com/adobecreativecloud',
                type: 'video'
              }
            ],
            checkpointQuiz: {
              question: 'Để duy trì tính nhất quán về nhân vật và màu sắc thương hiệu khi sinh ảnh bằng AI, phương pháp nào mang lại độ kiểm soát chính xác nhất?',
              options: [
                'Chỉ viết prompt dài hơn với nhiều tính từ',
                'Sử dụng ControlNet (OpenPose/Canny) kết hợp Seed và IP-Adapter',
                'Bấm nút Reroll liên tục cho đến khi ưng ý',
                'Chỉ sử dụng ảnh có sẵn trên mạng'
              ],
              correctIndex: 1,
              explanation: 'ControlNet cùng IP-Adapter cho phép cố định cấu trúc xương cơ thể, đường nét và phong cách màu sắc, tạo ra sự nhất quán cấp độ thương hiệu thương mại.'
            }
          },
          {
            id: 'thao-m2',
            milestoneNumber: 2,
            phaseName: 'Core Product & UI/UX',
            phaseNameVi: 'Giai đoạn 2: Kỹ năng Cốt lõi & Thiết kế Trải nghiệm Sản phẩm',
            title: 'Figma Mastery & Design Systems with AI Plugins',
            titleVi: 'Làm chủ Figma & Xây dựng Design System quy chuẩn với AI Plugins',
            estimatedHours: 45,
            weeksDuration: 5,
            skillsCovered: ['Figma Auto Layout & Variables', 'Design Tokens & Atomic Design', 'Wireframing with AI (Relume, Galileo)'],
            freeResources: [
              {
                name: 'Figma 101 Official Certification Track',
                provider: 'Figma Community (Free)',
                url: 'https://help.figma.com/hc/en-us/categories/360002051613',
                type: 'doc'
              },
              {
                name: 'Google UX Design Professional Certificate Notes',
                provider: 'Coursera / Google (Audit Free)',
                url: 'https://grow.google/certificates/ux-design/',
                type: 'course'
              }
            ],
            checkpointQuiz: {
              question: 'Trong quy trình thiết kế Design System trên Figma, "Variables" và "Design Tokens" giúp giải quyết bài toán nào?',
              options: [
                'Giúp vẽ icon vector nhanh hơn',
                'Quản trị nhất quán màu sắc, khoảng cách (spacing), dark mode trên toàn hệ sinh thái sản phẩm và đồng bộ với code',
                'Tự động viết code backend cho ứng dụng',
                'Nén dung lượng file thiết kế xuất ra'
              ],
              correctIndex: 1,
              explanation: 'Variables & Tokens tạo ra nguồn chân lý duy nhất (Single Source of Truth) giữa Design và Engineering, giảm 70% lỗi giao diện.'
            }
          },
          {
            id: 'thao-m3',
            milestoneNumber: 3,
            phaseName: 'Portfolio & Validation',
            phaseNameVi: 'Giai đoạn 3: Xây dựng Portfolio & Đánh giá Năng lực',
            title: 'Ship 2 Commercial-Grade AI Case Studies',
            titleVi: 'Hoàn thiện 2 Case Study Thương mại Thực chiến (Agency & Product)',
            estimatedHours: 40,
            weeksDuration: 4,
            skillsCovered: ['Case Study Storytelling', 'Before/After Efficiency Metrics', 'Interactive Figma Prototype'],
            freeResources: [
              {
                name: 'Cofolios - Tech Company Design Intern & Junior Portfolios',
                provider: 'Cofolios (Curated Free)',
                url: 'https://cofolios.com',
                type: 'repo'
              }
            ],
            checkpointQuiz: {
              question: 'Yếu tố quan trọng nhất giúp một portfolio thiết kế có ứng dụng AI gây ấn tượng với nhà tuyển dụng cao cấp là gì?',
              options: [
                'Số lượng ảnh đẹp tạo bằng Midjourney càng nhiều càng tốt',
                'Minh chứng rõ ràng về tư duy giải quyết vấn đề kinh doanh, số liệu tăng tốc quy trình và tính độc bản thương hiệu',
                'Giấu việc mình dùng AI để giả vờ vẽ tay',
                'Chỉ ghi tên các phần mềm đã dùng'
              ],
              correctIndex: 1,
              explanation: 'Nhà tuyển dụng tìm kiếm người có tư duy kinh doanh và khả năng dẫn dắt công cụ, chứ không phải người bấm nút ngẫu nhiên.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'persona-kiet-qa',
    name: 'Nguyễn Tuấn Kiệt',
    nameVi: 'Nguyễn Tuấn Kiệt (Đà Nẵng)',
    currentRole: 'Manual QA Tester (3 năm kinh nghiệm)',
    avatarSeed: 'Kiet',
    summaryQuote: 'Dự án outsource của công ty em bắt đầu giảm một nửa số lượng Manual Tester vì khách hàng yêu cầu viết kịch bản Playwright và tích hợp AI test tự động.',
    intakeProfile: {
      fullName: 'Nguyễn Tuấn Kiệt',
      currentRole: 'Manual Software QA',
      experienceYears: 3.0,
      education: 'Cử nhân Công nghệ Thông tin (Đại học Bách Khoa Đà Nẵng)',
      location: 'Đà Nẵng',
      interests: ['Software Testing', 'Automation', 'AI Model Evaluation', 'Cybersecurity', 'Python'],
      personalityTraits: ['Logic', 'Cẩn trọng', 'Thích tìm lỗi & tối ưu', 'Kiên nhẫn'],
      needsPriorities: {
        salary: 4,
        stability: 5,
        meaning: 3,
        remoteFlexibility: 5,
        workLifeBalance: 4
      },
      strengths: ['Tư duy tìm edge-case sâu', 'Hiểu quy trình phần mềm (Agile/Scrum)', 'Giao tiếp tốt với Developers', 'Viết tài liệu lỗi rõ ràng'],
      weaknesses: ['Chưa tự tin viết code automation từ đầu', 'Chưa có kinh nghiệm benchmark LLM', 'Ngại phỏng vấn tiếng Anh kỹ thuật'],
      constraints: {
        budgetVND: 3000000,
        hoursPerWeekAvailable: 15,
        preferredLocation: 'Đà Nẵng / Remote toàn cầu',
        riskTolerance: 'moderate'
      },
      values: ['Độ tin cậy công việc cao', 'Cơ hội làm việc remote cho công ty quốc tế', 'Môi trường kỹ thuật chuẩn mực'],
      workStyle: 'Làm việc theo mục tiêu (Sprint-based), thích quy trình rõ ràng và tự động hóa',
      forecastMode: 'realistic'
    },
    suggestions: [
      {
        id: 'sug-kiet-1',
        roleTitle: 'Automation QA & LLM Evaluation Engineer',
        roleTitleVi: 'Kỹ sư Đảm bảo Chất lượng Tự động hóa & Đánh giá Mô hình AI (AI/LLM Eval)',
        aiResilienceScore: 91,
        matchScore: 95,
        reasoning: 'Chuyển hóa trực giác bắt lỗi sâu sắc và hiểu biết về vòng đời phần mềm thành kỹ năng tự động hóa kiểm thử với Playwright/Python và đánh giá an toàn mô hình AI (Ragas, DeepEval).',
        whyItFitsYou: 'Nhu cầu kiểm thử an toàn, chống ảo giác (hallucination) và bảo mật cho các ứng dụng tích hợp GenAI tại các công ty Outsource/Product ở Đà Nẵng và Remote đang tăng vọt 115%.',
        transferableSkillsMatch: ['Tư duy Boundary & Edge cases', 'Quy trình Bug Tracking & JIRA', 'Hiểu biết API REST/JSON', 'Kỹ năng giao tiếp kỹ thuật'],
        skillsGap: ['Playwright / Cypress với TypeScript/Python', 'Khung đánh giá LLM (Ragas, TruLens, DeepEval)', 'Tích hợp CI/CD GitHub Actions cho Test Automation'],
        averageSalaryRangeVND: '25,000,000 - 52,000,000 VND / tháng (hoặc 1,200$ - 2,500$ Remote)',
        evidenceCitations: [
          {
            paperTitle: 'Vietnam Labor Market Report 2024-2026',
            source: 'VietnamWorks & TopCV Tech Labor Group',
            year: 2024,
            url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung',
            quoteOrDataPoint: 'Manual QA postings declined 48% YoY, while "Automation QA / AI Eval Specialist" salaries jumped to 30-55M VND in Hanoi, HCMC, Da Nang.'
          },
          {
            paperTitle: 'The Future of Jobs Report 2023 & 2025',
            source: 'World Economic Forum (WEF)',
            year: 2023,
            url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
            quoteOrDataPoint: 'Quality assurance roles that transition to software test engineering and AI safety evaluation rank in top quartile of technological longevity.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['manual-qa-tester'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Stay & Master Playwright + AI Code Assist',
            pathTitleVi: 'Nâng cấp lên Senior Automation QA với Playwright & Copilot',
            feasibilityScore: 92,
            estimatedTimelineMonths: 3.5,
            shortDescription: 'Học viết kịch bản kiểm thử E2E bằng Playwright kết hợp Gemini Code Assist để tự động hóa 80% regression testing trong dự án hiện tại.',
            targetRoles: ['Automation Test Engineer', 'QA Lead', 'SDET Junior'],
            skillsToAcquire: ['Playwright / TypeScript', 'API Testing (Postman + Newman)', 'CI/CD Test Runner'],
            transferableSkills: ['Test plan design, Edge-case analysis, Bug reporting'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [15, 24, 34, 44, 52],
            rationale: 'Thời gian chuyển đổi nhanh nhất, được công ty hiện tại ủng hộ và có thể áp dụng ngay vào dự án thực tế.',
            actionStepNow: 'Viết bộ test tự động Playwright đầu tiên cho chức năng đăng nhập và thanh toán trên trang mẫu.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to LLM Evaluation & AI Safety Engineer',
            pathTitleVi: 'Chuyển sang Kỹ sư Đánh giá & An toàn Mô hình AI (LLM Evaluation Specialist)',
            feasibilityScore: 82,
            estimatedTimelineMonths: 5,
            shortDescription: 'Trở thành chuyên gia đánh giá độ chính xác của RAG, đo lường hallucination, kiểm thử tấn công prompt injection và tối ưu hóa benchmark cho doanh nghiệp.',
            targetRoles: ['LLM Evaluation Engineer', 'AI Safety QA', 'AI Product QA Lead'],
            skillsToAcquire: ['Ragas / DeepEval framework', 'Prompt Injection Red-teaming', 'Python for Evaluation Pipelines'],
            transferableSkills: ['Adversarial testing mindset, Systematic metric tracking'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [15, 28, 42, 58, 75],
            rationale: 'Thị trường toàn cầu cực kỳ thiếu hụt kỹ sư đánh giá AI chất lượng cao, tiềm năng làm việc remote với mức lương USD.',
            actionStepNow: 'Chạy thử thư viện Ragas để đo lường độ Faithful và Answer Relevance trên một tập dữ liệu Q&A tiếng Việt.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Full Switch to DevOps & MLOps Infrastructure',
            pathTitleVi: 'Chuyển hẳn sang Kỹ sư Vận hành Hạ tầng AI/DevOps (MLOps Engineer)',
            feasibilityScore: 60,
            estimatedTimelineMonths: 10,
            shortDescription: 'Học quản trị Docker, Kubernetes, CI/CD pipelines và triển khai mô hình AI trên đám mây (GCP Cloud Run, Vertex AI).',
            targetRoles: ['DevOps Engineer', 'MLOps Engineer', 'Cloud Infrastructure QA'],
            skillsToAcquire: ['Docker & Kubernetes', 'GCP / Cloud Run / Terraform', 'Model Monitoring & Observability'],
            transferableSkills: ['Hệ thống, Tư duy quy trình, Kỷ luật kỹ thuật'],
            riskLevel: 'high',
            fiveYearSalaryProjection: [15, 22, 38, 55, 78],
            rationale: 'Mức thu nhập trần rất cao nhưng cần đầu tư thời gian học hạ tầng mạng và hệ điều hành sâu.',
            actionStepNow: 'Tạo tài khoản Google Cloud và deploy ứng dụng container đầu tiên lên Cloud Run.'
          }
        ],
        roadmap: [
          {
            id: 'kiet-m1',
            milestoneNumber: 1,
            phaseName: 'Foundation Automation',
            phaseNameVi: 'Giai đoạn 1: Nền tảng Tự động hóa với Playwright & TypeScript',
            title: 'Modern E2E Test Automation Pipeline',
            titleVi: 'Xây dựng Luồng Kiểm thử Tự động E2E với Playwright & TypeScript',
            estimatedHours: 40,
            weeksDuration: 4,
            skillsCovered: ['Playwright Locators & Assertions', 'Page Object Model (POM)', 'API & Network Mocking'],
            freeResources: [
              {
                name: 'Playwright Official Documentation & Quickstart',
                provider: 'Microsoft Playwright (Free)',
                url: 'https://playwright.dev/docs/intro',
                type: 'doc'
              },
              {
                name: 'TypeScript for Testers Masterclass',
                provider: 'freeCodeCamp (Free YouTube)',
                url: 'https://www.freecodecamp.org',
                type: 'video'
              }
            ],
            checkpointQuiz: {
              question: 'Tại sao Page Object Model (POM) được coi là chuẩn thiết kế hàng đầu trong Test Automation?',
              options: [
                'Vì nó giúp test chạy nhanh hơn gấp 10 lần',
                'Vì nó tách biệt cấu trúc trang (UI locators) khỏi logic kịch bản test, giúp bảo trì dễ dàng khi giao diện thay đổi',
                'Vì nó không cần viết code',
                'Vì nó chỉ dùng được cho một trang duy nhất'
              ],
              correctIndex: 1,
              explanation: 'POM giúp tái sử dụng mã nguồn và khi UI thay đổi, bạn chỉ cần sửa locator ở 1 file duy nhất thay vì hàng trăm file test.'
            }
          },
          {
            id: 'kiet-m2',
            milestoneNumber: 2,
            phaseName: 'AI Model Testing',
            phaseNameVi: 'Giai đoạn 2: Kỹ thuật Đánh giá Mô hình AI & RAG Benchmarking',
            title: 'LLM Evaluation & Ragas/DeepEval Mastery',
            titleVi: 'Làm chủ Khung Đánh giá AI & Đo lường RAG (Faithfulness & Hallucination)',
            estimatedHours: 45,
            weeksDuration: 5,
            skillsCovered: ['RAG Triad (Context Precision, Recall, Faithfulness)', 'Red-Teaming & Prompt Injection Testing', 'Automated CI/CD Quality Gates for AI'],
            freeResources: [
              {
                name: 'Ragas: Evaluation Framework for LLM & RAG',
                provider: 'Exploding Gradients (Open Source Docs)',
                url: 'https://docs.ragas.io',
                type: 'doc'
              },
              {
                name: 'DeepEval: The Open-Source LLM Evaluation Framework',
                provider: 'Confident AI (Free Docs & Tutorials)',
                url: 'https://docs.confident-ai.com',
                type: 'doc'
              }
            ],
            checkpointQuiz: {
              question: 'Chỉ số "Faithfulness" trong đánh giá hệ thống RAG (Retrieval-Augmented Generation) đo lường điều gì?',
              options: [
                'Tốc độ phản hồi của API',
                'Mức độ câu trả lời của AI dựa hoàn toàn vào tài liệu tham khảo được cung cấp (không tự bịa ra thông tin)',
                'Độ dài của câu trả lời',
                'Số lượng từ ngữ học thuật sử dụng'
              ],
              correctIndex: 1,
              explanation: 'Faithfulness đo lường tỷ lệ các luận điểm trong câu trả lời có thể suy ra trực tiếp từ Context, là cốt lõi để chống ảo giác (Hallucination).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'persona-chi-business',
    name: 'Trần Mai Chi',
    nameVi: 'Trần Mai Chi (Hà Nội)',
    currentRole: 'Sinh viên mới tốt nghiệp Quản trị Kinh doanh / Marketing',
    avatarSeed: 'Chi',
    summaryQuote: 'Mới ra trường apply các vị trí Content Marketing và Data Entry đều nhận phản hồi tuyển dụng đóng lại do doanh nghiệp chuyển sang dùng AI tools.',
    intakeProfile: {
      fullName: 'Trần Mai Chi',
      currentRole: 'Fresh Business Graduate',
      experienceYears: 0.5,
      education: 'Cử nhân Quản trị Kinh doanh (Đại học Kinh tế Quốc dân - NEU)',
      location: 'Hà Nội',
      interests: ['Business Analytics', 'Digital Marketing', 'AI Workflow Automation', 'E-commerce', 'Project Management'],
      personalityTraits: ['Năng động', 'Thích học cái mới', 'Tư duy logic kinh doanh', 'Kỹ năng giao tiếp tốt'],
      needsPriorities: {
        salary: 4,
        stability: 4,
        meaning: 4,
        remoteFlexibility: 3,
        workLifeBalance: 3
      },
      strengths: ['Tư duy tổng quan về doanh nghiệp', 'Tiếng Anh IELTS 7.0', 'Thuyết trình mạch lạc', 'Khả năng tự học nhanh'],
      weaknesses: ['Thiếu kinh nghiệm thực chiến công nghệ sâu', 'Chưa có portfolio dự án cụ thể'],
      constraints: {
        budgetVND: 1500000,
        hoursPerWeekAvailable: 18,
        preferredLocation: 'Hà Nội / Hybrid',
        riskTolerance: 'high'
      },
      values: ['Cơ hội thăng tiến nhanh', 'Được làm việc trực tiếp với ban lãnh đạo', 'Tiếp cận công nghệ mới'],
      workStyle: 'Nhiệt huyết, thích giải quyết bài toán tăng trưởng và tối ưu vận hành',
      forecastMode: 'optimistic'
    },
    suggestions: [
      {
        id: 'sug-chi-1',
        roleTitle: 'AI Operations & Business Automation Specialist',
        roleTitleVi: 'Chuyên viên Vận hành AI & Tự động hóa Quy trình Doanh nghiệp (AI Ops Analyst)',
        aiResilienceScore: 89,
        matchScore: 94,
        reasoning: 'Kết hợp nền tảng tư duy kinh doanh và tiếng Anh xuất sắc để trở thành cầu nối số 1 giữa nhu cầu ban giám đốc và các công cụ AI (tự động hóa marketing, CRM, báo cáo tài chính).',
        whyItFitsYou: 'Doanh nghiệp SME và tập đoàn tại Hà Nội đang khát các bạn trẻ hiểu ngôn ngữ kinh doanh nhưng biết dùng n8n, Make, Zapier và Gemini API để tối ưu chi phí vận hành 40%.',
        transferableSkillsMatch: ['Tư duy kinh doanh (Marketing/Finance)', 'Tiếng Anh làm việc quốc tế', 'Kỹ năng thuyết trình & Stakeholder alignment'],
        skillsGap: ['Xây dựng luồng tự động hóa No-code/Low-code (n8n, Make)', 'Phân tích dữ liệu với Python/SQL cơ bản', 'Prompt Engineering cho báo cáo kinh doanh'],
        averageSalaryRangeVND: '16,000,000 - 32,000,000 VND / tháng cho Fresher/Junior AI Ops',
        evidenceCitations: [
          {
            paperTitle: 'Stanford HAI AI Index Report 2024',
            source: 'Stanford Institute for Human-Centered AI',
            year: 2024,
            url: 'https://aiindex.stanford.edu/report/',
            quoteOrDataPoint: 'Business and operational analysts leveraging automated AI pipelines exhibit 43% higher efficiency and rapid promotion velocity.'
          },
          {
            paperTitle: 'The Future of Jobs Report 2023 & 2025',
            source: 'World Economic Forum (WEF)',
            year: 2023,
            url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
            quoteOrDataPoint: 'Business Development & Operations Specialists with AI tool fluency represent the fastest net employment additions in Asian services.'
          }
        ],
        resilienceDetail: VIETNAM_OCCUPATIONS_DATABASE['business-analyst-data'],
        trajectories: [
          {
            pathId: 'stay_augment',
            pathTitle: 'Become AI Growth & Ops Analyst',
            pathTitleVi: 'Trở thành Chuyên viên Tăng trưởng & Vận hành AI (AI Ops Analyst)',
            feasibilityScore: 90,
            estimatedTimelineMonths: 3,
            shortDescription: 'Học kết hợp Make/n8n với Gemini API để xây dựng hệ thống tự động hóa marketing, chăm sóc khách hàng và tổng hợp báo cáo tuần.',
            targetRoles: ['AI Operations Analyst', 'Growth Ops Associate', 'Digital Transformation Executive'],
            skillsToAcquire: ['Make.com & n8n Workflows', 'Gemini & OpenAI API Integration', 'Google Sheets Advanced & Looker Studio'],
            transferableSkills: ['Business strategy, English communication, Presentation'],
            riskLevel: 'low',
            fiveYearSalaryProjection: [12, 20, 32, 45, 60],
            rationale: 'Tận dụng 100% bằng cử nhân kinh tế và tiếng Anh, không yêu cầu bằng CNTT chuyên sâu.',
            actionStepNow: 'Tạo tài khoản Make.com và tự động hóa luồng lấy tin tức thị trường gửi vào Google Sheets và Telegram.'
          },
          {
            pathId: 'pivot_adjacent',
            pathTitle: 'Pivot to Product Management (AI Products)',
            pathTitleVi: 'Chuyển sang Quản lý Sản phẩm Công nghệ AI (Associate Product Manager - APM)',
            feasibilityScore: 75,
            estimatedTimelineMonths: 6,
            shortDescription: 'Định hướng trở thành APM chuyên trách các tính năng AI trong ứng dụng fintech, edtech hoặc e-commerce.',
            targetRoles: ['Associate Product Manager', 'Product Analyst', 'Scrum Product Owner'],
            skillsToAcquire: ['Product Discovery & User Journey', 'PRD (Product Requirement Document) Writing', 'Tech Architecture Fundamentals'],
            transferableSkills: ['Market research, User empathy, Business case framing'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [12, 24, 38, 55, 75],
            rationale: 'Con đường sự nghiệp quản lý cấp cao rất sáng giá với tiềm năng trở thành CPO / VP of Product.',
            actionStepNow: 'Viết 1 bản PRD chi tiết đề xuất tính năng trợ lý AI cho ứng dụng mua sắm thương mại điện tử.'
          },
          {
            pathId: 'full_switch',
            pathTitle: 'Switch to Quantitative Business Intelligence',
            pathTitleVi: 'Chuyển hẳn sang Chuyên viên Trí tuệ Doanh nghiệp & Dữ liệu Lớn (BI Engineer)',
            feasibilityScore: 65,
            estimatedTimelineMonths: 8,
            shortDescription: 'Học sâu SQL, Python (Pandas/NumPy), Power BI và Data Warehouse để xử lý dữ liệu quy mô lớn.',
            targetRoles: ['BI Analyst', 'Data Analyst', 'Commercial Analytics Lead'],
            skillsToAcquire: ['SQL & Data Modeling', 'Python for Data Analysis', 'Power BI / Tableau DAX'],
            transferableSkills: ['Business logic, Statistical intuition'],
            riskLevel: 'moderate',
            fiveYearSalaryProjection: [12, 22, 35, 50, 70],
            rationale: 'Nền tảng kỹ thuật vững chắc giúp bạn không bao giờ lỗi thời trong mọi chu kỳ kinh tế.',
            actionStepNow: 'Hoàn thành khóa học SQL for Data Analytics miễn phí trên W3Schools và Kaggle.'
          }
        ],
        roadmap: [
          {
            id: 'chi-m1',
            milestoneNumber: 1,
            phaseName: 'No-Code AI Automation',
            phaseNameVi: 'Giai đoạn 1: Tự động hóa Không cần Code với n8n/Make & Gemini',
            title: 'Enterprise Workflow Automation with Gemini API',
            titleVi: 'Xây dựng Luồng Tự động hóa Doanh nghiệp với Make.com & Gemini API',
            estimatedHours: 35,
            weeksDuration: 4,
            skillsCovered: ['Make / n8n Webhooks & JSON', 'Gemini API Function Calling Basics', 'Automated Reporting to Google Sheets & Slack'],
            freeResources: [
              {
                name: 'Make.com Academy Foundation Level 1 & 2',
                provider: 'Make.com Official (Free Certification)',
                url: 'https://academy.make.com',
                type: 'course'
              },
              {
                name: 'Google AI Studio & Gemini API Quickstart Tutorial',
                provider: 'Google for Developers',
                url: 'https://ai.google.dev/gemini-api/docs/quickstart',
                type: 'doc'
              }
            ],
            checkpointQuiz: {
              question: 'Khi cần tự động trích xuất thông tin khách hàng từ email gửi vào bảng tính Google Sheets và gửi tóm tắt cho Sales qua Telegram, giải pháp tối ưu nhất là gì?',
              options: [
                'Thuê 1 nhân viên ngồi trực 24/7 copy paste',
                'Sử dụng Webhook kích hoạt luồng Make.com/n8n gọi Gemini API trích xuất JSON rồi ghi trực tiếp vào Sheets và gửi bot Telegram',
                'Tắt tính năng nhận email',
                'In email ra giấy'
              ],
              correctIndex: 1,
              explanation: 'Luồng tự động hóa kết hợp Gemini trích xuất cấu trúc dữ liệu JSON thực hiện trong < 2 giây với chi phí gần như 0 đồng.'
            }
          }
        ]
      }
    ]
  }
];

export function getGoldenPersonaById(id: string): GoldenPersona | undefined {
  return GOLDEN_PROFILES.find(p => p.id === id);
}
