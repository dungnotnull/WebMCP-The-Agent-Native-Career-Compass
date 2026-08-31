// JSON Schemas for the 12 WebMCP tools. Descriptions target agents: they
// say what the tool returns and when to call it. Names follow the WebMCP
// spec constraint (ASCII, 1-128 chars).

export const TOOL_NAMES = [
  'lookup_occupation',
  'search_research',
  'get_transition_stories',
  'get_laban_page_context',
  'analyze_career_transition',
  'compare_occupations',
  'get_occupation_news',
  'get_my_plans',
  'save_career_plan',
  'add_milestone',
  'update_milestone_progress',
  'share_plan_to_community'
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export const TOOL_SCHEMAS: Record<ToolName, Record<string, unknown>> = {
  lookup_occupation: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Occupation name or keyword in English or Vietnamese, e.g. "accountant", "ke toan", "warehouse keeper", "giao vien".'
      }
    },
    required: ['query']
  },
  search_research: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Research question keywords, e.g. "generative AI exposure office work", "reskilling Vietnam manufacturing".'
      }
    },
    required: ['query']
  },
  get_transition_stories: {
    type: 'object',
    properties: {},
    required: []
  },
  get_laban_page_context: {
    type: 'object',
    properties: {},
    required: []
  },
  analyze_career_transition: {
    type: 'object',
    properties: {
      current_role: { type: 'string', description: 'The person\'s current job title, e.g. "junior accountant in Hanoi".' },
      experience_years: { type: 'number', description: 'Years of experience in the current role.' },
      education: { type: 'string', description: 'Highest education level, e.g. "bachelor degree in accounting".' },
      location: { type: 'string', description: 'Province or city in Vietnam, e.g. "Hai Phong".' },
      industry: { type: 'string', description: 'Current industry, e.g. "logistics".' },
      current_skills: { type: 'array', items: { type: 'string' }, description: 'Key skills the person already has.' },
      interests: { type: 'array', items: { type: 'string' }, description: 'Interests that could guide the transition.' }
    },
    required: ['current_role']
  },
  compare_occupations: {
    type: 'object',
    properties: {
      occupations: {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 3,
        description: '2-3 occupation names to compare side by side.'
      }
    },
    required: ['occupations']
  },
  get_occupation_news: {
    type: 'object',
    properties: {
      role: { type: 'string', description: 'Role to find Vietnam labor-market news for.' }
    },
    required: ['role']
  },
  get_my_plans: {
    type: 'object',
    properties: {},
    required: []
  },
  save_career_plan: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Short plan title, e.g. "90-day path from warehouse keeper to logistics data analyst".' },
      from_role: { type: 'string', description: 'The person\'s current role.' },
      target_occupation: { type: 'string', description: 'The occupation this plan transitions toward.' },
      rationale: { type: 'string', description: '2-3 sentences on why this path fits, grounded in evidence you gathered.' },
      citations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' }
          },
          required: ['title', 'url']
        },
        description: 'Evidence sources backing the plan. Only cite sources returned by lookup_occupation or search_research.'
      },
      milestones: {
        type: 'array',
        maxItems: 12,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Concrete action, e.g. "Complete Excel skills assessment".' },
            detail: { type: 'string', description: 'One-sentence elaboration.' },
            week: { type: 'string', description: 'When in the plan, e.g. "Week 1-2".' },
            resource_url: { type: 'string', description: 'Optional learning resource link.' }
          },
          required: ['title']
        },
        description: 'Ordered milestones. Aim for 4-8 concrete items spanning about 90 days.'
      }
    },
    required: ['title', 'milestones']
  },
  add_milestone: {
    type: 'object',
    properties: {
      plan_id: { type: 'string', description: 'ID of the plan to extend (from save_career_plan or get_my_plans).' },
      title: { type: 'string' },
      detail: { type: 'string' },
      week: { type: 'string' }
    },
    required: ['plan_id', 'title']
  },
  update_milestone_progress: {
    type: 'object',
    properties: {
      plan_id: { type: 'string' },
      milestone_id: { type: 'string' },
      status: { type: 'string', enum: ['pending', 'in_progress', 'done'], description: 'New status for the milestone.' }
    },
    required: ['plan_id', 'milestone_id', 'status']
  },
  share_plan_to_community: {
    type: 'object',
    properties: {
      plan_id: { type: 'string', description: 'ID of the plan to share.' }
    },
    required: ['plan_id']
  }
};
