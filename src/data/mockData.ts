import { CommunityPost, EmployerJobListing, JobPostingItem, JobSecurityNewsItem, ProofMetricsData, VerifiedTransitionStory } from '../types';

export const INITIAL_NEWS_ITEMS: JobSecurityNewsItem[] = [
  {
    id: 'news-1',
    title: 'Báo cáo Diễn đàn Kinh tế Thế giới (WEF) 2026: Làn sóng AI Agents định hình lại cấu trúc việc làm toàn cầu và Đông Nam Á',
    source: 'World Economic Forum (WEF)',
    publishDate: '2026-02-18',
    url: 'https://www.weforum.org/reports/',
    summaryVi: 'WEF ghi nhận các tác tử AI (AI Agents) tự hành đang thay thế dần các quy trình lặp lại trong chuỗi dịch vụ. Tuy nhiên, nhu cầu về nhân sự biết thiết kế, giám sát và kiểm thử chất lượng hệ thống AI tại các quốc gia như Việt Nam tăng trưởng hơn 48%.',
    summaryEn: 'WEF highlights that autonomous AI Agents are streamlining repetitive workflows, driving a 48% surge in demand for AI supervision and quality evaluators in emerging markets.',
    impactLevel: 'high',
    affectedFields: ['Công nghệ thông tin', 'Tài chính - Ngân hàng', 'Dịch vụ doanh nghiệp'],
    isGrounded: true
  },
  {
    id: 'news-2',
    title: 'Khảo sát Thị trường Lao động Việt Nam 2026: Mức lương nhân sự có kỹ năng AI cao hơn 35-50% so với mặt bằng chung',
    source: 'VietnamWorks & TopCV Labor Trends 2026',
    publishDate: '2026-02-22',
    url: 'https://www.vietnamworks.com/',
    summaryVi: 'Các doanh nghiệp tại Hà Nội và TP.HCM ghi nhận sự chuyển dịch rõ rệt: thay vì tuyển mới ồ ạt, 78% ưu tiên đào tạo lại (reskill) nhân sự hiện có để làm chủ các công cụ AI. Nhân sự biết ứng dụng AI tăng năng suất cá nhân được đề xuất mức thưởng và lương tăng trưởng vượt bậc.',
    summaryEn: '78% of enterprises in Vietnam prioritize internal AI reskilling; professionals proficient in AI workflows enjoy a 35-50% salary premium.',
    impactLevel: 'high',
    affectedFields: ['Marketing & Sáng tạo', 'Hành chính - Nhân sự', 'Kinh doanh & Bán hàng'],
    isGrounded: true
  },
  {
    id: 'news-3',
    title: 'Nghiên cứu Stanford HAI & ILO 2026: Mô hình "Con người kết hợp AI" (Human-in-the-Loop) đạt hiệu quả vượt trội',
    source: 'Stanford HAI & ILO Policy Brief 2026',
    publishDate: '2026-02-10',
    url: 'https://aiindex.stanford.edu/',
    summaryVi: 'Đánh giá trên 1.200 doanh nghiệp cho thấy các giải pháp AI độc lập thường gặp lỗi văn hóa và giới hạn ngữ cảnh. Khi kết hợp cùng chuyên gia con người đưa ra quyết định chiến lược, tỷ lệ hài lòng của khách hàng và độ chính xác dữ liệu đạt trên 94%.',
    summaryEn: 'Stanford HAI and ILO demonstrate that human-in-the-loop strategies achieve over 94% accuracy, outpacing fully automated systems in nuanced cultural and business contexts.',
    impactLevel: 'medium',
    affectedFields: ['Giáo dục & Đào tạo', 'Y tế & Chăm sóc sức khỏe', 'Tư vấn Pháp lý'],
    isGrounded: true
  },
  {
    id: 'news-4',
    title: 'Bộ Thông tin & Truyền thông cùng Bộ LĐ-TB&XH: Đẩy mạnh chương trình Phổ cập kỹ năng AI Quốc gia',
    source: 'Cổng thông tin Chính phủ / Bộ LĐ-TB&XH',
    publishDate: '2026-02-25',
    url: 'https://molisa.gov.vn/',
    summaryVi: 'Việt Nam thúc đẩy các khung đào tạo kỹ năng số và AI ứng dụng cho người lao động trẻ và sinh viên đại học, hướng tới mục tiêu xây dựng 100.000 chuyên gia kỹ thuật số chất lượng cao trong kỷ nguyên công nghiệp thông minh.',
    summaryEn: 'Vietnam accelerates national AI literacy and reskilling initiatives to equip 100,000 high-caliber digital professionals for the smart economy.',
    impactLevel: 'high',
    affectedFields: ['Kỹ thuật & Sản xuất', 'Logistics & Chuỗi cung ứng', 'Thương mại điện tử'],
    isGrounded: true
  }
];

export const INITIAL_JOB_POSTINGS: JobPostingItem[] = [
  {
    id: 'job-1',
    title: 'AI Art Director & Visual Design Lead',
    company: 'VNG Corporation / ZingPlay Studio',
    location: 'Quận 7, TP. Hồ Chí Minh (Hybrid)',
    salaryTextVND: '32,000,000 - 55,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Midjourney / ComfyUI pipeline', 'Figma Design System', 'Art Direction', 'Game UI/UX'],
    summary: 'Dẫn dắt đội ngũ thiết kế thị giác, ứng dụng Generative AI để tăng tốc quy trình sản xuất asset game và xây dựng brand narrative đẳng cấp quốc tế.',
    applyUrl: 'https://career.vng.com.vn',
    postedDate: '2026-02-18',
    sourceTag: 'TopCV / Verified'
  },
  {
    id: 'job-2',
    title: 'Automation QA & LLM Quality Evaluator',
    company: 'FPT Software Global Delivery Center',
    location: 'Sơn Trà, Đà Nẵng (Remote Friendly)',
    salaryTextVND: '28,000,000 - 48,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Playwright', 'TypeScript / Python', 'Ragas LLM Benchmark', 'CI/CD GitHub Actions'],
    summary: 'Thiết lập quy trình kiểm thử tự động cho hệ thống RAG enterprise của khách hàng Nhật Bản và Bắc Mỹ; đo lường độ chính xác và an toàn mô hình AI.',
    applyUrl: 'https://fptsoftware.com/careers',
    postedDate: '2026-02-22',
    sourceTag: 'VietnamWorks / Direct'
  },
  {
    id: 'job-3',
    title: 'Junior AI Operations & Growth Analyst',
    company: 'Tiki Corporation (E-commerce Operations)',
    location: 'Cầu Giấy, Hà Nội (Onsite)',
    salaryTextVND: '18,000,000 - 30,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Make / n8n Automation', 'Gemini API', 'Google Sheets / SQL', 'English Fluent'],
    summary: 'Tối ưu hóa luồng vận hành bán hàng, tự động hóa phân tích sentiment đánh giá của khách hàng và trích xuất dữ liệu đối thủ cạnh tranh.',
    applyUrl: 'https://tiki.vn/careers',
    postedDate: '2026-02-24',
    sourceTag: 'TopCV / Hot'
  },
  {
    id: 'job-4',
    title: 'AI Content Strategist & Multi-channel Producer',
    company: 'MindX Technology & Education School',
    location: 'Thanh Xuân, Hà Nội / Hybrid',
    salaryTextVND: '16,000,000 - 26,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Content Architecture', 'Gemini/Claude Prompts', 'Video Scripting', 'SEO Semantics'],
    summary: 'Định hướng chiến lược nội dung giáo dục số, điều phối các công cụ AI để sản xuất chuỗi bài giảng và tài liệu học tập cá nhân hóa.',
    applyUrl: 'https://mindx.edu.vn/careers',
    postedDate: '2026-02-20',
    sourceTag: 'VietnamWorks'
  },
  {
    id: 'job-5',
    title: 'Business Intelligence & Data Product Specialist',
    company: 'MoMo (M_Service Payment Platform)',
    location: 'Quận 3, TP. Hồ Chí Minh',
    salaryTextVND: '35,000,000 - 60,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['SQL & BigQuery', 'Python Analytics', 'AI Copilot Integration', 'Financial Modeling'],
    summary: 'Xây dựng các mô hình dự báo hành vi thanh toán người dùng, tích hợp các thuật toán học máy phân tích rủi ro gian lận giao dịch.',
    applyUrl: 'https://momo.vn/tuyen-dung',
    postedDate: '2026-02-25',
    sourceTag: 'Direct Employer'
  },
  {
    id: 'job-6',
    title: 'AI Product Experience Designer (UI/UX)',
    company: 'VNG Corporation (Zalo AI Studio)',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salaryTextVND: '28,000,000 - 45,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Figma AI Plugins', 'Prompt Architecture', 'Design System Automation', 'User Research'],
    summary: 'Thiết kế giao diện và trải nghiệm đàm thoại thế hệ mới cho các sản phẩm tích hợp Trợ lý ảo AI phục vụ hàng chục triệu người dùng Việt Nam.',
    applyUrl: 'https://careers.vng.com.vn',
    postedDate: '2026-02-26',
    sourceTag: 'VietnamWorks / Hot'
  },
  {
    id: 'job-7',
    title: 'AI QA & Automated Testing Engineer',
    company: 'Enclave Tech Solutions',
    location: 'Hải Châu, Đà Nẵng / Hybrid',
    salaryTextVND: '22,000,000 - 38,000,000 VND',
    isAiAugmented: true,
    requiredSkills: ['Playwright', 'AI Test Script Generation', 'CI/CD Pipeline', 'API Testing'],
    summary: 'Áp dụng các công cụ LLM tự động hóa sinh test case và kịch bản regression test cho các dự án phần mềm xuất khẩu thị trường Nhật Bản & Mỹ.',
    applyUrl: 'https://enclave.vn/careers',
    postedDate: '2026-02-26',
    sourceTag: 'TopDev'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorAlias: 'Ẩn danh (Designer 3 năm kinh nghiệm)',
    isAnonymous: true,
    userCurrentRole: '2D Graphic Designer',
    locationName: 'Quận 1, TP. Hồ Chí Minh',
    coordinates: {
      lat: 10.7769,
      lng: 106.7009
    },
    salaryBeforeM: 12,
    salaryAfterM: 28,
    transitionMonths: 5,
    avatarSeed: 'designer_hcm',
    createdAt: '2026-02-23T14:30:00Z',
    tag: 'fear_of_displacement',
    title: 'Có ai ở đây từng cảm thấy bất an khi khách hàng dùng Canva/Midjourney tự làm ảnh không?',
    content: 'Dạo này mình thấy nhiều khách hàng quen không còn order banner hay vẽ illustration như trước nữa. Họ bảo chỉ cần nhập text là AI vẽ xong trong 30 giây. Nhiều đêm mình mất ngủ vì không biết nếu tiếp tục thế này thì 1-2 năm nữa thu nhập sẽ ra sao. Mình muốn học chuyển hướng nhưng chưa biết bắt đầu từ đâu để không bị bỏ lại phía sau...',
    likesCount: 38,
    replies: [
      {
        id: 'rep-1-1',
        authorAlias: 'Lê Minh Thảo (Đã chuyển đổi thành công)',
        createdAt: '2026-02-23T16:15:00Z',
        content: 'Chào bạn, mình từng ở đúng tâm trạng này cách đây 8 tháng! Bí quyết của mình là đừng xem AI là đối thủ mà biến nó thành trợ lý cấp tốc. Hãy học thêm về Brand Narrative và tư duy Design System trong Figma. Khách hàng có thể tự tạo ảnh nhưng họ KHÔNG BIẾT phối hợp hình ảnh đó vào chiến lược kinh doanh tổng thể thế nào. Đó chính là giá trị con người độc bản của bạn!',
        isVerifiedTransition: true
      },
      {
        id: 'rep-1-2',
        authorAlias: 'Trợ lý Định hướng La Bàn (Hệ thống)',
        createdAt: '2026-02-23T16:16:00Z',
        content: '🌟 Lời nhắn từ La Bàn: Nỗi sợ là phản xạ rất tự nhiên trước sự dịch chuyển công nghệ. Nghiên cứu của OpenAI và Stanford chỉ ra rằng 71% tác vụ thủ công bị ảnh hưởng, nhưng nhu cầu Giám đốc Mỹ thuật định hướng AI lại tăng trưởng 68%. Bạn hoàn toàn có thể chạy giả lập 3 lộ trình chuyển đổi miễn phí trên La Bàn để có bản đồ kỹ năng cụ thể cho riêng mình nhé!',
        isAiSupportive: true
      }
    ]
  },
  {
    id: 'post-2',
    authorAlias: 'Tuấn Kiệt',
    isAnonymous: false,
    userCurrentRole: 'Ex-Manual QA -> Automation & LLM Eval',
    locationName: 'Hải Châu, Đà Nẵng',
    coordinates: {
      lat: 16.0544,
      lng: 108.2022
    },
    salaryBeforeM: 11,
    salaryAfterM: 32,
    transitionMonths: 4,
    avatarSeed: 'qa_danang',
    createdAt: '2026-02-20T09:20:00Z',
    tag: 'success_story',
    title: 'Chia sẻ hành trình 4 tháng từ Manual Tester lương 11 triệu lên Automation QA lương 32 triệu',
    content: 'Mình từng rất chật vật khi dự án cũ cắt giảm 50% tester. Nhờ bám sát lộ trình từng tuần của La Bàn, mình kiên trì học Playwright + TypeScript mỗi tối 2 tiếng và làm quen với framework đánh giá AI Ragas. Tuần trước mình vừa ký hợp đồng chính thức với mức lương gấp gần 3 lần. Các bạn đừng bỏ cuộc nhé, cơ hội mới cho người chủ động học là rất lớn!',
    likesCount: 92,
    replies: [
      {
        id: 'rep-2-1',
        authorAlias: 'Hải Đăng (Hà Nội)',
        createdAt: '2026-02-20T11:45:00Z',
        content: 'Chúc mừng anh Kiệt! Anh cho em hỏi giai đoạn đầu học Playwright có cần học sâu JavaScript trước không hay nhảy vào viết test luôn ạ?'
      },
      {
        id: 'rep-2-2',
        authorAlias: 'Tuấn Kiệt (Đà Nẵng)',
        createdAt: '2026-02-20T13:10:00Z',
        content: 'Nên nắm vững Promise, async/await và Type cơ bản trong TypeScript khoảng 1 tuần rồi thực hành viết test thực tế luôn em nhé, vừa làm vừa sửa sẽ nhớ rất lâu!',
        isVerifiedTransition: true
      }
    ]
  },
  {
    id: 'post-3',
    authorAlias: 'Hương Giang',
    isAnonymous: false,
    userCurrentRole: 'Fresher Business Operations',
    locationName: 'Cầu Giấy, Hà Nội',
    coordinates: {
      lat: 21.0333,
      lng: 105.7833
    },
    salaryBeforeM: 8,
    salaryAfterM: 20,
    transitionMonths: 3.5,
    avatarSeed: 'neu_hanoi',
    createdAt: '2026-02-24T18:00:00Z',
    tag: 'career_pivot',
    title: 'Sinh viên ngành Kinh tế / Ngoại thương nên học công cụ AI nào đầu tiên để có lợi thế phỏng vấn?',
    content: 'Chào mọi người, em vừa tốt nghiệp ngành Kinh tế đối ngoại. Em thấy các công ty hiện nay hỏi rất nhiều về việc ứng viên biết dùng AI vào công việc thực tế ra sao. Em nên học Make/n8n hay tập trung vào phân tích dữ liệu với Python ạ?',
    likesCount: 24,
    replies: [
      {
        id: 'rep-3-1',
        authorAlias: 'Mai Chi (AI Ops Tiki)',
        createdAt: '2026-02-24T19:30:00Z',
        content: 'Khuyên bạn nên bắt đầu bằng Make.com hoặc n8n trước nhé! Chỉ cần 2 tuần là bạn có thể tự dựng luồng trích xuất email gửi vào Google Sheets và báo cáo Slack. Đem sản phẩm này vào phỏng vấn là gây ấn tượng cực mạnh với sếp tuyển dụng!',
        isVerifiedTransition: true
      }
    ]
  },
  {
    id: 'post-4',
    authorAlias: 'Trần Văn Hưng (Cần Thơ)',
    isAnonymous: false,
    userCurrentRole: 'Kế toán viên -> Tư vấn giải pháp ERP & FinTech',
    locationName: 'Ninh Kiều, Cần Thơ',
    coordinates: {
      lat: 10.0333,
      lng: 105.7833
    },
    salaryBeforeM: 9.5,
    salaryAfterM: 25,
    transitionMonths: 6,
    avatarSeed: 'acc_cantho',
    createdAt: '2026-02-21T10:15:00Z',
    tag: 'success_story',
    title: 'Kế toán truyền thống vùng Đồng bằng Sông Cửu Long đổi mới với AI & PowerBI',
    content: 'Nhiều anh em kế toán ở miền Tây than vãn hóa đơn điện tử và OCR quét sạch việc nhập liệu thủ công. Thay vì chờ đợi, mình chuyển sang học thiết lập dashboard tài chính tự động hóa và tích hợp trợ lý thuế AI. Giờ mình làm tư vấn độc lập cho 4 doanh nghiệp thủy sản trong vùng!',
    likesCount: 56,
    replies: []
  },
  {
    id: 'post-5',
    authorAlias: 'Nguyễn Bích Ngọc (Hải Phòng)',
    isAnonymous: false,
    userCurrentRole: 'Telesales -> Chuyên viên Trải nghiệm Khách hàng (CX AI Lead)',
    locationName: 'Ngô Quyền, Hải Phòng',
    coordinates: {
      lat: 20.8651,
      lng: 106.6838
    },
    salaryBeforeM: 7.5,
    salaryAfterM: 22,
    transitionMonths: 4.5,
    avatarSeed: 'cx_haiphong',
    createdAt: '2026-02-22T08:45:00Z',
    tag: 'success_story',
    title: 'Từng khóc vì bị Voicebot AI thay thế cuộc gọi, giờ làm người huấn luyện Chatbot & CX Lead',
    content: 'Khi công ty triển khai AI Voicebot tự động gọi cho khách hàng, nhóm 10 bạn telesales của mình chỉ còn giữ lại 2 người. Mình xung phong nhận nhiệm vụ kiểm tra kịch bản và huấn luyện câu trả lời cho bot. Nhờ thấu hiểu tâm lý giận dữ của khách hàng, mình đã giúp công ty tăng tỷ lệ hài lòng lên 92%. Đừng sợ bot, hãy làm người làm chủ và huấn luyện nó!',
    likesCount: 110,
    replies: []
  },
  {
    id: 'post-6',
    authorAlias: 'Thanh Phong (Nha Trang)',
    isAnonymous: true,
    userCurrentRole: 'Phiên dịch viên Du lịch -> Chuyên viên Content Đa Ngữ AI',
    locationName: 'Nha Trang, Khánh Hòa',
    coordinates: {
      lat: 12.2388,
      lng: 109.1967
    },
    salaryBeforeM: 10,
    salaryAfterM: 24,
    transitionMonths: 3,
    avatarSeed: 'trans_nhatrang',
    createdAt: '2026-02-23T19:20:00Z',
    tag: 'career_pivot',
    title: 'Biên dịch viên có thật sự hết thời khi DeepL & Gemini dịch siêu mượt?',
    content: 'Thực tế nếu chỉ dịch word-by-word thì đúng là hết cửa. Nhưng nếu bạn biết văn hóa địa phương, biết cách prompt AI tạo ra 10 biến thể ngôn ngữ marketing phù hợp từng nền văn hóa (Hàn, Trung, Nga, Âu) thì bạn trở thành tài sản vô giá của các tập đoàn khách sạn resort.',
    likesCount: 47,
    replies: []
  },
  {
    id: 'post-7',
    authorAlias: 'Hải Anh (Hà Nội)',
    isAnonymous: false,
    userCurrentRole: 'Nhân sự Đào tạo (L&D)',
    locationName: 'Đống Đa, Hà Nội',
    coordinates: {
      lat: 21.0125,
      lng: 105.8252
    },
    salaryBeforeM: 12,
    salaryAfterM: 22,
    transitionMonths: 5,
    avatarSeed: 'hr_hanoi',
    createdAt: '2026-02-25T08:15:00Z',
    tag: 'transition_fatigue',
    title: 'Có ai bị ngợp trước hàng chục khóa học Prompt Engineering không?',
    content: 'Mình làm đào tạo nhân sự và đang bị giao nhiệm vụ xây dựng giáo trình AI cho công ty. Vấn đề là trên mạng có quá nhiều tài liệu, cái nào cũng "nhất", "tuyệt chiêu". Đôi lúc mình bị stress đến mức không muốn mở máy lên. La Bàn có gợi ý nào để lọc tài liệu học chuẩn chỉnh không ạ?',
    likesCount: 35,
    replies: [
      {
        id: 'rep-7-1',
        authorAlias: 'Trợ lý Định hướng La Bàn (Hệ thống)',
        createdAt: '2026-02-25T08:20:00Z',
        content: '🌟 Lời nhắn từ La Bàn: Bạn hãy dùng tính năng "Lộ trình học theo Milestone" của La Bàn. Hệ thống đã lọc sẵn các tài nguyên chuẩn quốc tế (như từ Google, Microsoft, Stanford) thay vì các khóa học trôi nổi. Học chậm nhưng chắc bạn nhé!',
        isAiSupportive: true
      }
    ]
  },
  {
    id: 'post-8',
    authorAlias: 'Ẩn danh (Dev 5 năm)',
    isAnonymous: true,
    userCurrentRole: 'Backend Developer (Java)',
    locationName: 'Dĩ An, Bình Dương',
    coordinates: {
      lat: 10.9022,
      lng: 106.7562
    },
    salaryBeforeM: 35,
    salaryAfterM: 45,
    transitionMonths: 6,
    avatarSeed: 'dev_binhduong',
    createdAt: '2026-02-26T09:10:00Z',
    tag: 'salary_negotiation',
    title: 'Review lương khi đã áp dụng thành thạo Copilot và Codeium vào dự án',
    content: 'Vừa review lương đầu năm. Mình dùng AI để auto generate unit tests, setup pipeline CI/CD nhanh hơn gấp 2 lần. Sếp thấy năng suất cao nên đã offer tăng 10 củ, đồng thời giao mình hướng dẫn team áp dụng công cụ AI. Kỹ năng giao tiếp và hướng dẫn (mentoring) bây giờ quan trọng không kém gì code đâu anh em!',
    likesCount: 88,
    replies: []
  },
  {
    id: 'post-9',
    authorAlias: 'Ngọc Lan',
    isAnonymous: false,
    userCurrentRole: 'Nhân viên Pháp lý (Legal Assistant)',
    locationName: 'Biên Hòa, Đồng Nai',
    coordinates: {
      lat: 10.9576,
      lng: 106.8427
    },
    salaryBeforeM: 10,
    salaryAfterM: 15,
    transitionMonths: 3,
    avatarSeed: 'legal_dongnai',
    createdAt: '2026-02-26T11:45:00Z',
    tag: 'seeking_mentor',
    title: 'Cần tìm mentor hướng dẫn dùng AI tóm tắt hợp đồng và tra cứu luật',
    content: 'Mình đang chìm trong đống hồ sơ hợp đồng cần duyệt mỗi ngày. Mình nghe nói có thể dùng LLM để phát hiện rủi ro hợp đồng, nhưng do là dữ liệu bảo mật nên không dám quăng thẳng lên ChatGPT. Có ai có kinh nghiệm chạy mô hình Local (như Ollama) hoặc giải pháp RAG bảo mật hướng dẫn mình với!',
    likesCount: 42,
    replies: []
  },
  {
    id: 'post-10',
    authorAlias: 'Quốc Bảo (Huế)',
    isAnonymous: false,
    userCurrentRole: 'Video Editor -> AI Storyteller',
    locationName: 'TP. Huế',
    coordinates: {
      lat: 16.4637,
      lng: 107.5909
    },
    salaryBeforeM: 9,
    salaryAfterM: 20,
    transitionMonths: 4,
    avatarSeed: 'editor_hue',
    createdAt: '2026-02-25T20:30:00Z',
    tag: 'success_milestone',
    title: 'Hoàn thành dự án phim ngắn 100% bằng AI (Sora/Runway)',
    content: 'Chào mọi người, mình vừa thắng giải thưởng sáng tạo nhờ một TVC dùng AI generate toàn bộ video footages. Nghề dựng phim đang dịch chuyển mạnh sang khả năng chỉ đạo nghệ thuật (AI Directing). Mình sẽ làm 1 bài tutorial chia sẻ prompt cho ai quan tâm nhé!',
    likesCount: 156,
    replies: []
  }
];

export const INITIAL_SCIENTIFIC_LABOR_REPORT = {
  lastUpdated: '2026-02-25T18:00:00Z',
  reportCycle: 'Hằng ngày (Cronjob 23:59 GMT+7)',
  totalOccupationsAnalyzed: 1240,
  dataSources: [
    'World Economic Forum (WEF) Future of Jobs Report 2025-2026',
    'Stanford University HAI AI Index 2025/2026',
    'ILO Policy Brief on Generative AI & Jobs in Developing Nations',
    'OpenAI & University of Pennsylvania (Eloundou et al. O*NET Task Decomposition)',
    'Tổng Cục Thống Kê & Bộ Lao động - Thương binh và Xã hội (MOLISA Vietnam)'
  ],
  trendingList: [
    {
      id: 'trend-1',
      rank: 1,
      roleVi: 'Kỹ sư Tác nhân AI & Tự động hóa Quy trình (AI Agents & Workflow Engineer)',
      roleEn: 'AI Agents & Automation Engineer',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 8,
      growthRatePct: 48,
      primarySource: 'WEF Future of Jobs 2025-2026 / Stanford HAI',
      year: 2025,
      paperUrl: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
      coreExplanationVi: 'Xây dựng chuỗi quy trình tự vận hành bằng Agent AI kết hợp các hệ thống ERP, CRM doanh nghiệp.',
      humanAdvantageFactorVi: 'Tư duy logic kiến trúc hệ thống và xử lý lỗi biên giới hạn kỹ thuật (edge cases).',
      vietnamDemandSignal: 'bùng_nổ' as const
    },
    {
      id: 'trend-2',
      rank: 2,
      roleVi: 'Chuyên gia Đạo đức AI & Đảm bảo An toàn Dữ liệu (AI Safety & Compliance Specialist)',
      roleEn: 'AI Safety & Compliance Specialist',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 5,
      growthRatePct: 42,
      primarySource: 'OECD AI Policy Observatory & Stanford HAI',
      year: 2025,
      paperUrl: 'https://oecd.ai',
      coreExplanationVi: 'Đảm bảo mô hình AI tuân thủ Luật An ninh mạng Việt Nam và Nghị định bảo vệ dữ liệu cá nhân (PDPD).',
      humanAdvantageFactorVi: 'Phán đoán đạo đức xã hội, trách nhiệm pháp lý con người và tư duy nhân bản.',
      vietnamDemandSignal: 'bùng_nổ' as const
    },
    {
      id: 'trend-3',
      rank: 3,
      roleVi: 'Giám đốc Trải nghiệm Mỹ thuật AI (AI Art Director & Design System Architect)',
      roleEn: 'AI Art Director & Design System Architect',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 12,
      growthRatePct: 38,
      primarySource: 'Harvard Business Review (Augmenting Human Creativity 2024)',
      year: 2024,
      paperUrl: 'https://hbr.org',
      coreExplanationVi: 'Định hình ngôn ngữ thị giác tổng thể, phối hợp công cụ AI tạo sinh với Design Token doanh nghiệp.',
      humanAdvantageFactorVi: 'Cảm thụ nghệ thuật độc bản, thị hiếu văn hóa và sự thấu cảm khách hàng.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    },
    {
      id: 'trend-4',
      rank: 4,
      roleVi: 'Kỹ sư Kiểm định Chất lượng LLM (LLM Quality & Evaluation Engineer)',
      roleEn: 'LLM Quality & Evaluation Engineer',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 10,
      growthRatePct: 36,
      primarySource: 'OpenAI Benchmarking Frameworks 2025',
      year: 2025,
      paperUrl: 'https://openai.com/research',
      coreExplanationVi: 'Xây dựng bộ test benchmark đo lường độ chính xác (hallucination reduction) và độ an toàn cho ứng dụng AI.',
      humanAdvantageFactorVi: 'Tư duy phản biện nghiêm ngặt và kiểm soát logic thực tế.',
      vietnamDemandSignal: 'bùng_nổ' as const
    },
    {
      id: 'trend-5',
      rank: 5,
      roleVi: 'Chuyên viên Tái cấu trúc Vận hành Doanh nghiệp (AI Business Process Transformation Lead)',
      roleEn: 'AI Business Process Transformation Lead',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 9,
      growthRatePct: 34,
      primarySource: 'McKinsey Global Institute (The Economic Potential of Generative AI)',
      year: 2024,
      paperUrl: 'https://www.mckinsey.com',
      coreExplanationVi: 'Tái định hình cơ cấu phòng ban và nâng cao năng suất nhân viên nhờ tích hợp AI.',
      humanAdvantageFactorVi: 'Kỹ năng quản trị thay đổi (Change Management) và giao tiếp thuyết phục lãnh đạo.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    },
    {
      id: 'trend-6',
      rank: 6,
      roleVi: 'Bác sĩ & Chuyên gia Y tế Hỗ trợ AI (AI-Assisted Healthcare & Diagnostics Specialist)',
      roleEn: 'AI-Assisted Healthcare Specialist',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 6,
      growthRatePct: 32,
      primarySource: 'Lancet Digital Health & WHO Guidelines',
      year: 2025,
      paperUrl: 'https://www.thelancet.com/digital-health',
      coreExplanationVi: 'Sử dụng công cụ thị giác máy tính đọc phim X-quang/CT để chẩn đoán sớm và điều trị cá thể hóa.',
      humanAdvantageFactorVi: 'Đạo đức ngành y, trách nhiệm lâm sàng và sự an ủi tinh thần người bệnh.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    },
    {
      id: 'trend-7',
      rank: 7,
      roleVi: 'Chuyên gia Chiến lược Dữ liệu & RAG Enterprise (Enterprise RAG & Data Architect)',
      roleEn: 'Enterprise RAG & Data Architect',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 8,
      growthRatePct: 35,
      primarySource: 'Gartner Top Strategic Tech Trends 2025',
      year: 2025,
      paperUrl: 'https://www.gartner.com',
      coreExplanationVi: 'Tổ chức cơ sở tri thức nội bộ doanh nghiệp và kết nối với Vector Database phục vụ nhân viên.',
      humanAdvantageFactorVi: 'Quy hoạch thông tin phức tạp và bảo mật dữ liệu độc quyền.',
      vietnamDemandSignal: 'bùng_nổ' as const
    },
    {
      id: 'trend-8',
      rank: 8,
      roleVi: 'Chuyên gia Năng lượng Xanh & Tối ưu AI Trung tâm Dữ liệu (Green AI & Energy Specialist)',
      roleEn: 'Green AI & Data Center Energy Specialist',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 7,
      growthRatePct: 30,
      primarySource: 'International Energy Agency (IEA 2025)',
      year: 2025,
      paperUrl: 'https://www.iea.org',
      coreExplanationVi: 'Giải quyết bài toán điện năng tiêu thụ và làm mát cho các cụm máy chủ GPU phục vụ AI.',
      humanAdvantageFactorVi: 'Kỹ thuật vật lý nhiệt động lực học và quy hoạch thực địa công trình.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    },
    {
      id: 'trend-9',
      rank: 9,
      roleVi: 'Chuyên viên Tâm lý học Tổ chức & Đào tạo Thích ứng (Workforce Reskilling Coach)',
      roleEn: 'Workforce Reskilling Coach',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 4,
      growthRatePct: 29,
      primarySource: 'ILO World Employment and Social Outlook 2025',
      year: 2025,
      paperUrl: 'https://www.ilo.org',
      coreExplanationVi: 'Đồng hành giảm bớt âu lo sa thải cho nhân sự và xây dựng lộ trình học tập nội bộ.',
      humanAdvantageFactorVi: 'Trí tuệ cảm xúc (EQ), sự đồng cảm con người và kỹ năng sư phạm truyền cảm hứng.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    },
    {
      id: 'trend-10',
      rank: 10,
      roleVi: 'Kỹ sư Robot Công nghiệp & Cảm biến Thực địa (Field Robotics & Automation Integrator)',
      roleEn: 'Field Robotics & Automation Integrator',
      type: 'trending_high_growth' as const,
      displacementRiskPct: 11,
      growthRatePct: 28,
      primarySource: 'MOLISA Vietnam Industrial 4.0 Assessment',
      year: 2025,
      paperUrl: 'https://molisa.gov.vn',
      coreExplanationVi: 'Lắp ráp, bảo trì và tích hợp robot thị giác vào dây chuyền sản xuất may mặc, điện tử tại Việt Nam.',
      humanAdvantageFactorVi: 'Khả năng thao tác xúc giác tinh xảo và xử lý tình huống thực địa.',
      vietnamDemandSignal: 'tăng_trưởng' as const
    }
  ],
  vulnerableList: [
    {
      id: 'vuln-1',
      rank: 1,
      roleVi: 'Nhân viên Nhập liệu & Xử lý Văn bản Thủ công (Data Entry Clerk)',
      roleEn: 'Manual Data Entry Clerk',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 89,
      growthRatePct: -46,
      primarySource: 'OpenAI (Eloundou et al. 2023) / ILO Report',
      year: 2023,
      paperUrl: 'https://arxiv.org/abs/2303.10130',
      coreExplanationVi: 'Hệ thống OCR thông minh và LLM trích xuất dữ liệu đa định dạng tự động với độ chính xác trên 99%.',
      humanAdvantageFactorVi: 'Rất thấp nếu chỉ gõ phím sao chép thuần túy.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-2',
      rank: 2,
      roleVi: 'Nhân viên Telesales & Chăm sóc Khách hàng Theo Kịch bản Cố định (Scripted Telemarketer)',
      roleEn: 'Scripted Telemarketer',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 86,
      growthRatePct: -42,
      primarySource: 'WEF Future of Jobs 2025',
      year: 2025,
      paperUrl: 'https://www.weforum.org',
      coreExplanationVi: 'Voice AI tự động gọi điện với ngữ điệu tự nhiên như người thật, xử lý đồng thời hàng chục nghìn cuộc gọi.',
      humanAdvantageFactorVi: 'Chỉ giữ lại ở phân khúc B2B giá trị cao và đàm phán hợp đồng phức tạp.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-3',
      rank: 3,
      roleVi: 'Lập trình viên Cắt HTML/CSS Giao diện Mẫu (Routine Front-end Slice Coder)',
      roleEn: 'Routine HTML/CSS Coder',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 78,
      growthRatePct: -38,
      primarySource: 'Stanford HAI AI Index / GitHub Octoverse 2025',
      year: 2025,
      paperUrl: 'https://aiindex.stanford.edu',
      coreExplanationVi: 'Các mô hình AI Vision tự động dịch thiết kế Figma/ảnh chụp thành code chuẩn chỉnh trong vài giây.',
      humanAdvantageFactorVi: 'Cần nâng cấp lên kiến trúc hệ thống, bảo mật hoặc thiết kế trải nghiệm tương tác.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-4',
      rank: 4,
      roleVi: 'Kiểm thử Phần mềm Thủ công Lặp lại (Manual QA / Functional Tester)',
      roleEn: 'Manual Functional Tester',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 76,
      growthRatePct: -35,
      primarySource: 'Capgemini World Quality Report 2025',
      year: 2025,
      paperUrl: 'https://www.capgemini.com',
      coreExplanationVi: 'AI Agent tự động khám phá luồng người dùng, sinh test case và tự sửa script kiểm thử khi UI thay đổi.',
      humanAdvantageFactorVi: 'Cần chuyển dịch sang kiểm thử phi chức năng, bảo mật và thẩm định đạo đức AI.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-5',
      rank: 5,
      roleVi: 'Người Viết Bài SEO & Biên tập Tin tức Tóm tắt (Routine SEO Copywriter)',
      roleEn: 'Routine SEO Content Writer',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 74,
      growthRatePct: -36,
      primarySource: 'Gartner Marketing Predictions 2025',
      year: 2025,
      paperUrl: 'https://www.gartner.com',
      coreExplanationVi: 'LLM tạo bài viết chuẩn SEO, tóm tắt bài báo với tốc độ hàng trăm bài mỗi giờ với chi phí gần bằng 0.',
      humanAdvantageFactorVi: 'Phải chuyển sang phóng sự điều tra hiện trường, xây dựng góc nhìn cá nhân độc bản.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-6',
      rank: 6,
      roleVi: 'Kế toán viên Nhập chứng từ & Hạch toán Cơ bản (Basic Bookkeeper)',
      roleEn: 'Basic Bookkeeper & Invoice Processor',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 72,
      growthRatePct: -32,
      primarySource: 'OECD Future of Work & ACCA Global 2025',
      year: 2025,
      paperUrl: 'https://www.accaglobal.com',
      coreExplanationVi: 'Hóa đơn điện tử kết hợp AI tự động khớp lệnh thanh toán, định khoản và xuất báo cáo tài chính sơ bộ.',
      humanAdvantageFactorVi: 'Cần nâng cấp lên tư vấn cấu trúc thuế, quản trị rủi ro dòng tiền và thẩm định dự án.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-7',
      rank: 7,
      roleVi: 'Biên dịch viên Tài liệu Phổ thông (General Document Translator)',
      roleEn: 'General Text Translator',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 70,
      growthRatePct: -30,
      primarySource: 'European Language Resource Coordination (ELRC)',
      year: 2024,
      paperUrl: 'https://lr-coordination.eu',
      coreExplanationVi: 'Các mô hình dịch máy nơ-ron đa ngữ thế hệ mới đạt độ trôi chảy gần tương đương người bản ngữ.',
      humanAdvantageFactorVi: 'Cần chuyển dịch sang dịch thuật văn học, nội địa hóa sâu sắc hoặc chuyển ngữ ngoại giao.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-8',
      rank: 8,
      roleVi: 'Thiết kế Đồ họa Banner Cơ bản & Cắt ghép Ảnh (Template Graphic Editor)',
      roleEn: 'Template Graphic Designer',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 68,
      growthRatePct: -29,
      primarySource: 'Adobe Digital Economy Index / Stanford HAI',
      year: 2025,
      paperUrl: 'https://www.adobe.com',
      coreExplanationVi: 'Canva Magic Studio và Generative Fill tự động đổi kích thước, tách nền, thay màu trong một cú click.',
      humanAdvantageFactorVi: 'Cần chuyển dịch sang Art Direction, xây dựng chiến lược thương hiệu và sản xuất đa phương tiện.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-9',
      rank: 9,
      roleVi: 'Nhân viên Soát vé & Thu ngân Quầy Cố định (Cashier & Toll Collector)',
      roleEn: 'Fixed Counter Cashier',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 82,
      growthRatePct: -40,
      primarySource: 'MOLISA Vietnam Labor Report 2024-2025',
      year: 2025,
      paperUrl: 'https://molisa.gov.vn',
      coreExplanationVi: 'Thanh toán không tiền mặt qua mã QR, RFID tự động và kiosk tự phục vụ thay thế quầy thủ công.',
      humanAdvantageFactorVi: 'Rất thấp ở tác vụ lặp lại.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    },
    {
      id: 'vuln-10',
      rank: 10,
      roleVi: 'Môi giới Bất động sản Cơ bản / Đăng tin Rao vặt (Basic Listing Agent)',
      roleEn: 'Routine Property Listing Agent',
      type: 'vulnerable_displacement' as const,
      displacementRiskPct: 62,
      growthRatePct: -25,
      primarySource: 'National Association of Realtors (Tech Impact Report 2025)',
      year: 2025,
      paperUrl: 'https://www.nar.realtor',
      coreExplanationVi: 'AI định giá nhà tự động, tour 3D ảo và bot tư vấn pháp lý sơ bộ giúp khách hàng tự tìm kiếm.',
      humanAdvantageFactorVi: 'Đàm phán tâm lý cấp cao, thẩm định pháp lý thực địa và mạng lưới quan hệ độc quyền.',
      vietnamDemandSignal: 'suy_giảm_mạnh' as const
    }
  ],
  executiveSummaryVi: 'Sự phân hóa thị trường lao động tại Việt Nam đang diễn ra theo trục "Năng lực phối hợp AI vs Thao tác lặp lại". Lao động chuyển đổi sớm sang vai trò điều phối AI có mức tăng lương 35-50%, trong khi các vị trí thuần túy nhập liệu và cắt dán đối mặt nguy cơ thu hẹp biên chế tới 40% trước năm 2028.'
};

export const VERIFIED_TRANSITION_STORIES: VerifiedTransitionStory[] = [
  {
    id: 'story-1',
    seekerName: 'Lê Minh Thảo',
    previousRole: 'Junior 2D Graphic Designer (Agency)',
    newRole: 'AI Art Director & Visual Experience Lead',
    companyOrIndustry: 'Creative Studio / FinTech Product',
    timeTakenMonths: 4.5,
    storyQuote: 'La Bàn cho mình thấy rõ tác vụ nào AI đang thay thế và tác vụ nào chỉ con người mới làm được. Nhờ đó mình không hoảng sợ mà tập trung vào xây dựng Design System và điều phối AI.',
    topSkillsAcquired: ['ComfyUI & ControlNet', 'Figma Design Tokens', 'Brand Narrative Direction'],
    verifiedDate: '2026-01-15'
  },
  {
    id: 'story-2',
    seekerName: 'Nguyễn Tuấn Kiệt',
    previousRole: 'Manual QA Tester',
    newRole: 'Automation QA & LLM Evaluation Engineer',
    companyOrIndustry: 'FPT Software & Remote US Client',
    timeTakenMonths: 4.0,
    storyQuote: 'Lộ trình chia nhỏ theo từng tuần kèm bài test checkpoint giúp mình giữ kỷ luật mỗi tối. Mức thu nhập tăng 160% và công việc thú vị hơn rất nhiều.',
    topSkillsAcquired: ['Playwright E2E Testing', 'Ragas LLM Faithfulness', 'CI/CD Pipelines'],
    verifiedDate: '2026-02-01'
  },
  {
    id: 'story-3',
    seekerName: 'Phạm Đức Anh',
    previousRole: 'Traditional SEO Content Writer',
    newRole: 'AI Content Architect & Operations Specialist',
    companyOrIndustry: 'EdTech Platform',
    timeTakenMonths: 3.5,
    storyQuote: 'Từ người viết bài 50k/bài, giờ mình xây dựng hệ thống tự động tạo nội dung cá nhân hóa cho 50,000 học viên với Gemini API.',
    topSkillsAcquired: ['Gemini API Prompt Engineering', 'Make.com Workflows', 'Content Architecture'],
    verifiedDate: '2026-02-12'
  }
];

export const INITIAL_EMPLOYER_LISTINGS: EmployerJobListing[] = [
  {
    id: 'emp-1',
    companyName: 'FPT Software AI Innovation Lab',
    industry: 'Information Technology & Software Outsource',
    roleTitle: 'AI Quality Assurance & Benchmark Engineer',
    location: 'Đà Nẵng & Hà Nội',
    aiSkillsDemanded: ['LLM Benchmark', 'Playwright', 'Python', 'Security Red-teaming'],
    salaryBudgetVND: '30,000,000 - 55,000,000 VND',
    description: 'Tìm kiếm các kỹ sư có nền tảng QA vững chắc muốn chuyển đổi sang mảng kiểm thử an toàn và chất lượng cho hệ thống AI phục vụ khách hàng Fortune 500.',
    contactEmail: 'talent.ai@fpt.com',
    postedDate: '2026-02-21',
    applicantsCount: 14
  },
  {
    id: 'emp-2',
    companyName: 'VNG Games Creative Hub',
    industry: 'Digital Entertainment & Game Studio',
    roleTitle: 'Associate AI Creative Director',
    location: 'TP. Hồ Chí Minh',
    aiSkillsDemanded: ['Midjourney v6', 'ComfyUI', 'Figma', 'Visual Storytelling'],
    salaryBudgetVND: '35,000,000 - 65,000,000 VND',
    description: 'Tuyển dụng Art Lead dẫn dắt quy trình sản xuất asset mỹ thuật với Generative AI, đảm bảo chuẩn nhận diện thương hiệu cho các tựa game hàng đầu.',
    contactEmail: 'recruitment@vng.com.vn',
    postedDate: '2026-02-23',
    applicantsCount: 22
  }
];

export const INITIAL_PROOF_METRICS: ProofMetricsData = {
  totalUsersServed: 12480,
  suggestionsGenerated: 28940,
  trajectoriesSimulated: 19420,
  roadmapsCreated: 14650,
  verifiedSuccessfulTransitions: 312,
  jobMatchesFacilitated: 845,
  communityPostsCount: 1540,
  employerListingsCount: 86,
  citedResearchPapersCount: 25,
  lastUpdated: new Date().toISOString(),
  benchmarkStats: {
    averageTransitionMonths: 4.2,
    averageSalaryUpliftPercent: 46.5,
    vietnamAIEfficiencyIndex: 78.4
  }
};
