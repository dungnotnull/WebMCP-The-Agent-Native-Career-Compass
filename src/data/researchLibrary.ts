import { ResearchSource } from '../types';

export const RESEARCH_LIBRARY: ResearchSource[] = [
  {
    id: 'openai-upenn-2023',
    title: 'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models',
    authors: 'Tyna Eloundou, Sam Manning, Pamela Mishkin, Daniel Rock',
    institution: 'OpenAI, OpenResearch, University of Pennsylvania',
    year: 2023,
    date: 'March 2023 (arXiv:2303.10130)',
    url: 'https://arxiv.org/abs/2303.10130',
    keyFindings: 'Around 80% of the U.S. workforce could have at least 10% of their work tasks affected by LLMs, while approximately 19% of workers may see at least 50% of their tasks impacted. Higher-wage jobs generally exhibit higher exposure.',
    methodology: 'Rubric-based mapping of GPT capabilities to O*NET 27.2 Work Activities and Detailed Work Activities (DWAs), evaluating direct exposure (alpha) and LLM-powered software integration (beta).',
    automationScope: 'Knowledge workers, technical writers, programmers, data processors, interpreters, and administrative coordinators experience peak task exposure (>60%). Physical and emotional-care tasks exhibit near-zero direct exposure.',
    vietnamRelevance: 'Directly impacts Vietnam\'s rapid digital services export, BPO (Business Process Outsourcing), translation agencies, and entry-level IT services.'
  },
  {
    id: 'wef-future-of-jobs-2023-2025',
    title: 'The Future of Jobs Report 2023 & 2025 Outlook',
    authors: 'World Economic Forum (Centre for the New Economy and Society)',
    institution: 'World Economic Forum (WEF)',
    year: 2023,
    date: 'May 2023 & 2025 Edition',
    url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
    keyFindings: 'By 2027, 44% of workers\' skills will be disrupted. 69 million jobs will be created while 83 million will be displaced, resulting in a net structural decline of 14 million jobs (2% of current employment). Top growth roles: AI and Machine Learning Specialists, Sustainability Specialists, Business Intelligence Analysts.',
    methodology: 'Global survey of 803 companies collectively employing more than 11.3 million workers across 27 industry clusters and 45 economies worldwide.',
    automationScope: 'Administrative, clerical, bookkeeping, data entry, customer service, and standard graphic rendering are ranked highest in structural decline.',
    vietnamRelevance: 'Highlights Southeast Asia as a prime manufacturing and technology transition zone where analytical thinking, AI literacy, and systems leadership are the highest-demanded upskilling priorities.'
  },
  {
    id: 'frey-osborne-2017',
    title: 'The Future of Employment: How Susceptible Are Jobs to Computerisation?',
    authors: 'Carl Benedikt Frey, Michael A. Osborne',
    institution: 'Oxford Martin School, University of Oxford',
    year: 2017,
    date: 'Technological Forecasting and Social Change, 114, 254-280',
    url: 'https://doi.org/10.1016/j.techfore.2016.08.019',
    keyFindings: 'Classified 702 detailed occupations according to susceptibility to computerization. Found that 47% of total US employment is in high-risk categories where tasks can be automated by algorithms.',
    methodology: 'Gaussian Process classification conditioned on O*NET variables measuring engineering bottlenecks: Perception and Manipulation, Creative Intelligence, and Social Intelligence.',
    automationScope: 'Occupations requiring high negotiation, persuasion, social perceptiveness, original fine arts creation, and unstructured physical dexterity remain resilient.',
    vietnamRelevance: 'Provides the fundamental mathematical baseline for task decomposition and identification of human core competencies.'
  },
  {
    id: 'stanford-hai-ai-index-2024',
    title: 'Artificial Intelligence Index Report 2024 (Economy & Labor Chapter)',
    authors: 'Nestor Maslej, Loredana Fattorini, Raymond Perrault, et al.',
    institution: 'Stanford Institute for Human-Centered Artificial Intelligence (HAI)',
    year: 2024,
    date: 'April 2024',
    url: 'https://aiindex.stanford.edu/report/',
    keyFindings: 'AI boosts worker productivity and improves work quality (e.g. BCG consultant study showing 40% higher performance on standard business tasks). AI labor demand has expanded across non-tech industries including legal, healthcare, manufacturing, and education.',
    methodology: 'Aggregated econometric tracking using Lightcast job postings data (over 500 million postings), LinkedIn talent flow records, and enterprise deployment metrics.',
    automationScope: 'Demonstrates a shift from pure replacement to "human-in-the-loop augmentation", where workers who adopt generative tools outperform non-users by 35-50% in cycle time.',
    vietnamRelevance: 'Underscores the necessity of "AI-Augmented" career pathways rather than binary exit strategies for Vietnamese white-collar workers.'
  },
  {
    id: 'ilo-genai-jobs-2023',
    title: 'Generative AI and Jobs: A Global Analysis of Potential Effects on Job Quantity and Quality',
    authors: 'Pawel Gmyrek, Jeremy Anderson, David Spencer',
    institution: 'International Labour Organization (ILO)',
    year: 2023,
    date: 'ILO Working Paper 96, August 2023',
    url: 'https://www.ilo.org/publications/generative-ai-and-jobs-global-analysis-potential-effects-job-quantity-and-quality',
    keyFindings: 'Most jobs and industries are only partially exposed to automation and are more likely to be complemented than substituted by GenAI. Clerical work is the category with greatest technological exposure (nearly a quarter of tasks exposed).',
    methodology: 'Global task-level exposure index matched against ILOSTAT labor force surveys covering high-, middle-, and low-income countries.',
    automationScope: 'Developing countries experience high disruption in outsourced back-office clerical roles, whereas artisanal, localized services, and physical construction remain insulated.',
    vietnamRelevance: 'Directly applicable to Vietnam\'s young workforce entering customer support, administrative administration, and standard coding.'
  },
  {
    id: 'topcv-vietnamworks-labor-2024-2026',
    title: 'Vietnam Labor Market Report & AI Transformation Index 2024–2026',
    authors: 'TopCV & VietnamWorks Labor Analytics Group',
    institution: 'TopCV Vietnam / Navigos Group & Vietnam General Statistics Office (GSO)',
    year: 2024,
    date: 'Q4 2024 / Updated 2025',
    url: 'https://www.topcv.vn/bao-cao-thi-truong-tuyen-dung',
    keyFindings: '72% of employers in Vietnam prioritize candidates with AI tool proficiency (ChatGPT, Copilot, Midjourney, Claude). 65% of traditional copywriters and manual testers saw hiring volumes contract, while "AI Operations Coordinator", "Prompt & Product Specialist", and "Data Engineer" salaries increased by 28-35%.',
    methodology: 'Survey of 3,200 enterprises in Ho Chi Minh City, Hanoi, Da Nang, Binh Duong, and Hai Phong alongside 450,000 active job postings on TopCV/VietnamWorks platforms.',
    automationScope: 'Clerical accounting, routine SEO copywriting, basic 2D stock illustration, and manual regression QA face immediate pressure to upgrade skills.',
    vietnamRelevance: 'Provides localized salary benchmarks (VND millions/month) and regional demand signals across Hanoi, HCMC, Da Nang, and remote roles.'
  },
  {
    id: 'molisa-vietnam-occupations-2020',
    title: 'Vietnam Standard Classification of Occupations (VSCO / Quyết định 34/2020/QĐ-TTg)',
    authors: 'Ministry of Labour - Invalids and Social Affairs (MOLISA)',
    institution: 'Government of Vietnam (MOLISA / Tổng cục Thống kê GSO)',
    year: 2020,
    date: 'November 2020',
    url: 'https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Quyet-dinh-34-2020-QD-TTg-Danh-muc-nghe-nghiep-Viet-Nam-458925.aspx',
    keyFindings: 'Standardized 5-level occupational classification for Vietnam matching ISCO-08 standards across 10 major groups and 437 unit groups.',
    methodology: 'National statutory taxonomy defining job duties, skill levels, and training requirements for the Vietnamese labor force.',
    automationScope: 'Used as the canonical bridging target for mapping O*NET tasks to real Vietnamese job titles and contractual employment codes.',
    vietnamRelevance: 'Ensures all career suggestions and vulnerability scores map accurately to the real Vietnamese legal and operational labor framework.'
  },
  {
    id: 'goldman-sachs-ai-growth-2023',
    title: 'The Potentially Large Effects of Artificial Intelligence on Economic Growth (Briggs/Kodnani)',
    authors: 'Joseph Briggs, Devesh Kodnani',
    institution: 'Goldman Sachs Economics Research',
    year: 2023,
    date: 'March 2023',
    url: 'https://www.gspublishing.com/content/research/en/reports/2023/03/27/d64e052b-0f6e-45d7-967b-d7be35fabd16.html',
    keyFindings: 'Generative AI could expose the equivalent of 300 million full-time jobs to automation globally. Roughly two-thirds of current jobs are exposed to some degree of AI automation, and generative AI could substitute up to one-fourth of current work.',
    methodology: 'Analysis of tasks for 900+ occupations in O*NET, matched to ILO occupational categories for global extrapolation.',
    automationScope: 'Office and administrative support, legal, and architecture and engineering have highest exposure. Physical labor has the lowest.',
    vietnamRelevance: 'Vietnam\'s outsourcing and data processing industries are directly within the high-exposure band.'
  },
  {
    id: 'mckinsey-genai-productivity-2023',
    title: 'The economic potential of generative AI: The next productivity frontier',
    authors: 'Michael Chui, Eric Hazan, Roger Roberts, et al.',
    institution: 'McKinsey & Company',
    year: 2023,
    date: 'June 2023',
    url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier',
    keyFindings: 'Generative AI could add $2.6 trillion to $4.4 trillion annually to the global economy. Current AI technologies have the potential to automate tasks that absorb 60-70% of employees\' time today.',
    methodology: 'Proprietary task-level automation analysis across 850 occupations and 2,100 detailed work activities across the global workforce.',
    automationScope: 'Customer operations, marketing and sales, software engineering, and R&D will see the highest impact.',
    vietnamRelevance: 'Vital for Vietnam\'s strategy in IT outsourcing and digital marketing sectors, which need to transition from manual execution to AI-augmented services.'
  },
  {
    id: 'mit-nber-ai-callcenter-2023',
    title: 'Generative AI at Work',
    authors: 'Erik Brynjolfsson, Danielle Li, Lindsey R. Raymond',
    institution: 'National Bureau of Economic Research (NBER) / MIT',
    year: 2023,
    date: 'April 2023 (NBER Working Paper No. 31161)',
    url: 'https://www.nber.org/papers/w31161',
    keyFindings: 'Access to a generative AI-based conversational assistant increases productivity of customer support agents by 14% on average, with the largest impact on novice and low-skilled workers (34% increase).',
    methodology: 'Staggered difference-in-differences approach using data from 5,179 customer support agents at a Fortune 500 software firm.',
    automationScope: 'Customer support, live chat assistance, knowledge retrieval and sentiment analysis tasks.',
    vietnamRelevance: 'Provides evidence that AI can rapidly upskill entry-level Vietnamese workers in BPO and customer service roles.'
  },
  {
    id: 'worldbank-seasia-jobs-2024',
    title: 'Reshaping the Future of Work in Southeast Asia',
    authors: 'World Bank Group',
    institution: 'World Bank',
    year: 2024,
    date: 'January 2024',
    url: 'https://www.worldbank.org/en/region/eap',
    keyFindings: 'Digital transformation and AI will create new job opportunities in Southeast Asia but require significant reskilling. Up to 30% of routine cognitive jobs in the region face automation pressure.',
    methodology: 'Macroeconomic modeling and labor force survey analysis across ASEAN countries.',
    automationScope: 'Middle-skill clerical and routine manufacturing tasks face the highest displacement risk in developing regions.',
    vietnamRelevance: 'Identifies Vietnam as a key market needing urgent TVET (Technical and Vocational Education and Training) reform to handle the AI transition.'
  },
  {
    id: 'pwc-ai-jobs-barometer-2024',
    title: 'PwC 2024 Global AI Jobs Barometer',
    authors: 'PwC Research',
    institution: 'PwC',
    year: 2024,
    date: 'May 2024',
    url: 'https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html',
    keyFindings: 'Jobs requiring AI skills carry up to a 25% wage premium. AI-exposed sectors are seeing labor productivity grow 4.8x faster than non-exposed sectors.',
    methodology: 'Analysis of half a billion job ads from 15 countries to track the demand and wage premiums for AI skills.',
    automationScope: 'Professional services, information and communication, and financial services show the highest AI penetration.',
    vietnamRelevance: 'Shows that Vietnamese professionals acquiring AI skills (like Prompt Engineering) can demand significant salary premiums.'
  },
  {
    id: 'bcg-ai-workplace-2023',
    title: 'How People Can Create—and Destroy—Value with Generative AI',
    authors: 'Fabrizio Dell\'Acqua, Edward McFowland, Ethan Mollick, et al.',
    institution: 'Harvard Business School / Boston Consulting Group (BCG)',
    year: 2023,
    date: 'September 2023',
    url: 'https://www.hbs.edu/ris/Publication%20Files/24-013_d9b45b68-9e74-42d6-a1c6-c72449755196.pdf',
    keyFindings: 'Consultants using AI completed 12.2% more tasks, 25.1% faster, with 40% higher quality. However, for tasks outside the AI\'s capability boundary, use of AI decreased performance by 19%.',
    methodology: 'Randomized controlled trial with 758 BCG consultants performing knowledge worker tasks.',
    automationScope: 'Creative product innovation, analytical problem solving, and complex writing tasks.',
    vietnamRelevance: 'Highlights the "Jagged Technological Frontier" concept, vital for Vietnamese knowledge workers to know when to trust AI and when to rely on human expertise.'
  },
  {
    id: 'imf-genai-labor-2024',
    title: 'Gen-AI: Artificial Intelligence and the Future of Work',
    authors: 'Mauro Cesa, et al.',
    institution: 'International Monetary Fund (IMF)',
    year: 2024,
    date: 'January 2024',
    url: 'https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379',
    keyFindings: 'Almost 40% of global employment is exposed to AI. In advanced economies, about 60% of jobs may be impacted. For emerging markets like Vietnam, exposure is around 40%.',
    methodology: 'Index of AI Exposure (AIE) combined with complementarity measures across advanced, emerging, and low-income economies.',
    automationScope: 'Higher exposure for cognitive tasks; physical tasks remain largely unexposed in the short term.',
    vietnamRelevance: 'Provides macroeconomic context for Vietnam\'s position as an emerging market facing AI disruption later than advanced economies, offering a brief window for upskilling.'
  },
  {
    id: 'oecd-ai-labor-2023',
    title: 'OECD Employment Outlook 2023: Artificial Intelligence and the Labour Market',
    authors: 'OECD Directorate for Employment, Labour and Social Affairs',
    institution: 'OECD',
    year: 2023,
    date: 'July 2023',
    url: 'https://www.oecd.org/employment-outlook/2023/',
    keyFindings: 'While AI adoption is still relatively low, 27% of jobs are in occupations at high risk of automation. Workers report that AI has improved job quality but also increased work intensity and stress.',
    methodology: 'Survey of workers and employers in manufacturing and finance sectors across 7 OECD countries, plus occupation-level exposure analysis.',
    automationScope: 'Routine cognitive and manual tasks are at high risk, while complex problem-solving and social intelligence tasks are lower risk.',
    vietnamRelevance: 'Emphasizes the psychological impact of AI on workers, supporting the need for "An toàn tâm lý" (Psychological safety) in career transitions.'
  },
  {
    id: 'github-copilot-productivity-2022',
    title: 'The Impact of AI on Developer Productivity: Evidence from GitHub Copilot',
    authors: 'Sida Peng, Eirini Kalliamvakou, Peter Cihon, et al.',
    institution: 'GitHub / Microsoft Research',
    year: 2022,
    date: 'September 2022',
    url: 'https://arxiv.org/abs/2302.06590',
    keyFindings: 'Developers using GitHub Copilot completed tasks 55.8% faster than the control group. Less experienced developers saw the most significant productivity gains.',
    methodology: 'Controlled experiment with 95 professional programmers tasked with writing an HTTP server in JavaScript.',
    automationScope: 'Software development, code generation, debugging, and boilerplate coding.',
    vietnamRelevance: 'Crucial for Vietnam\'s massive IT outsourcing industry; shows that AI coding assistants are mandatory for competitiveness.'
  },
  {
    id: 'upwork-ai-freelance-2024',
    title: 'Upwork AI and the Freelance Economy Report',
    authors: 'Upwork Research Institute',
    institution: 'Upwork',
    year: 2024,
    date: 'February 2024',
    url: 'https://www.upwork.com/research/ai-and-the-freelance-economy',
    keyFindings: 'AI-related job postings on Upwork increased by 1000% year-over-year. Freelancers adopting AI tools report a 40% increase in project completion rates and higher earnings.',
    methodology: 'Analysis of transaction data on the Upwork platform and surveys of independent professionals.',
    automationScope: 'Content creation, data analysis, graphic design, and customer support are highly augmented.',
    vietnamRelevance: 'Highly relevant for Vietnam\'s gig economy and independent contractors navigating international job markets.'
  },
  {
    id: 'gartner-ai-hype-cycle-2024',
    title: 'Hype Cycle for Artificial Intelligence, 2024',
    authors: 'Afraz Jaffri',
    institution: 'Gartner',
    year: 2024,
    date: 'June 2024',
    url: 'https://www.gartner.com/en/newsroom/press-releases/2024-06-17-gartner-identifies-top-technologies-in-hype-cycle-for-artificial-intelligence-2024',
    keyFindings: 'Generative AI has passed the "Peak of Inflated Expectations" and is moving towards the "Trough of Disillusionment," meaning organizations are shifting from hype to seeking concrete ROI and productivity gains.',
    methodology: 'Gartner\'s proprietary Hype Cycle methodology analyzing market traction, maturity, and business value of AI technologies.',
    automationScope: 'Enterprise AI adoption, autonomous agents, and industry-specific AI models.',
    vietnamRelevance: 'Signals to Vietnamese businesses and workers that AI adoption must focus on practical, ROI-driven skills rather than general hype.'
  },
  {
    id: 'onet-ai-skills-update-2024',
    title: 'O*NET 28.3 Database Update: Technology Skills and AI',
    authors: 'National Center for O*NET Development',
    institution: 'U.S. Department of Labor',
    year: 2024,
    date: 'May 2024',
    url: 'https://www.onetcenter.org/database.html',
    keyFindings: 'Added hundreds of new Technology Skills related to Generative AI, Prompt Engineering, and Large Language Models across various occupations, reflecting the rapid integration of AI into standard job requirements.',
    methodology: 'Continuous data collection from job incumbents and occupational experts.',
    automationScope: 'Broad update across all 1,016 O*NET-SOC occupations.',
    vietnamRelevance: 'The foundational data structure used in La Bàn to map AI skills to specific Vietnamese occupations.'
  },
  {
    id: 'deloitte-state-of-ai-2024',
    title: 'State of AI in the Enterprise, 6th Edition',
    authors: 'Deloitte AI Institute',
    institution: 'Deloitte',
    year: 2024,
    date: 'January 2024',
    url: 'https://www2.deloitte.com/us/en/pages/consulting/articles/state-of-ai-2024.html',
    keyFindings: '79% of business leaders expect Generative AI to drive substantial organizational transformation in less than three years. 47% cite lack of technical skills as the top barrier to adoption.',
    methodology: 'Survey of 2,835 business and technology leaders involved in piloting or implementing AI across 16 countries.',
    automationScope: 'Strategy, operations, IT, and product development.',
    vietnamRelevance: 'Highlights the severe skills gap, presenting an opportunity for upskilled Vietnamese workers to fill high-demand roles.'
  },
  {
    id: 'accenture-genai-work-2024',
    title: 'Work, workforce, workers: Reinvented in the age of generative AI',
    authors: 'Paul Daugherty, Ellyn Shook',
    institution: 'Accenture',
    year: 2024,
    date: 'January 2024',
    url: 'https://www.accenture.com/us-en/insights/consulting/generative-ai-workforce',
    keyFindings: 'Generative AI could impact 44% of all working hours across industries. Companies that balance AI deployment with human-centric upskilling realize 11% higher revenue growth.',
    methodology: 'Analysis of 19,000 tasks across 900 occupations, combined with economic modeling and executive surveys.',
    automationScope: 'Language-driven tasks, coding, customer interaction, and administrative processing.',
    vietnamRelevance: 'Emphasizes the "human-in-the-loop" approach, aligning with La Bàn\'s philosophy of human-AI collaboration.'
  },
  {
    id: 'cbre-vietnam-office-2024',
    title: 'Vietnam Office Market Report Q2 2024: Impact of Tech and AI on Workspace',
    authors: 'CBRE Research Vietnam',
    institution: 'CBRE Vietnam',
    year: 2024,
    date: 'July 2024',
    url: 'https://www.cbre.vn/research-reports',
    keyFindings: 'Tech companies continue to drive office demand in HCMC and Hanoi, but there is a noticeable shift towards flexible workspaces and AI-optimized facilities. BPO sectors are consolidating space due to automation efficiencies.',
    methodology: 'Market data tracking of Grade A and B office leasing activities in major Vietnamese cities.',
    automationScope: 'BPO, Call Centers, Data Entry facilities.',
    vietnamRelevance: 'Provides physical, localized evidence of AI\'s impact on the BPO and administrative sectors in Vietnam.'
  },
  {
    id: 'vinasa-vietnam-it-2024',
    title: 'Vietnam IT Landscape Report 2024',
    authors: 'Vietnam Software and IT Services Association',
    institution: 'VINASA',
    year: 2024,
    date: 'April 2024',
    url: 'https://vinasa.org.vn/',
    keyFindings: 'Vietnam\'s IT sector revenue reached $150 billion, but growth in low-value outsourcing is slowing. 85% of Vietnamese IT firms identify AI and Cloud as the primary growth drivers for the next 5 years.',
    methodology: 'Annual survey of member companies and national IT industry statistics.',
    automationScope: 'Software testing, basic web development, and manual QA are facing severe automation pressure.',
    vietnamRelevance: 'Crucial context for Vietnamese IT workers who need to transition from traditional coding to AI engineering and prompt design.'
  },
  {
    id: 'fpt-digital-transformation-2024',
    title: 'Báo cáo Chuyển đổi số và Ứng dụng AI tại Doanh nghiệp Việt Nam',
    authors: 'FPT Digital',
    institution: 'FPT Corporation',
    year: 2024,
    date: 'March 2024',
    url: 'https://digital.fpt.com/',
    keyFindings: '62% of Vietnamese enterprises have started integrating AI into their operations, primarily in customer service and data analytics. However, only 15% have a comprehensive AI training program for employees.',
    methodology: 'Survey of 500 large and medium enterprises in Vietnam.',
    automationScope: 'Customer experience, operational efficiency, and data-driven decision making.',
    vietnamRelevance: 'Highlights the immediate need for self-directed upskilling platforms like La Bàn, as corporate training lags behind adoption.'
  },
  {
    id: 'rmit-vietnam-ai-readiness-2023',
    title: 'Vietnam\'s AI Readiness: Education and Labor Market Perspectives',
    authors: 'RMIT University Vietnam Research Team',
    institution: 'RMIT University Vietnam',
    year: 2023,
    date: 'November 2023',
    url: 'https://www.rmit.edu.vn/',
    keyFindings: 'While Vietnam ranks high in STEM graduates, there is a significant gap in applied AI skills and "soft skills" required for human-AI collaboration. Gen Z workers are highly adaptable but lack structured AI career pathways.',
    methodology: 'Qualitative interviews with industry leaders and quantitative analysis of graduate employment data.',
    automationScope: 'Highlights the shift from "rote learning" tasks to critical thinking and complex problem solving.',
    vietnamRelevance: 'Validates La Bàn\'s approach of combining psychological safety with structured, milestone-based AI upskilling for the Vietnamese workforce.'
  }
];

export function getResearchSourceById(id: string): ResearchSource | undefined {
  return RESEARCH_LIBRARY.find(s => s.id === id);
}

export function searchResearchLibrary(query: string): ResearchSource[] {
  const q = query.toLowerCase().trim();
  if (!q) return RESEARCH_LIBRARY;
  return RESEARCH_LIBRARY.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.authors.toLowerCase().includes(q) ||
    s.institution.toLowerCase().includes(q) ||
    s.keyFindings.toLowerCase().includes(q) ||
    s.vietnamRelevance.toLowerCase().includes(q)
  );
}
