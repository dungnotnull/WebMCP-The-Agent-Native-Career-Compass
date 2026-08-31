// WebMCP registration entry point. Feature-detects the WebMCP API
// (Chrome exposes document.modelContext; the W3C draft uses
// navigator.modelContext) and registers all La Ban tools as a progressive
// enhancement — a normal browser simply skips this.

import { TOOL_SCHEMAS } from './schemas';
import type { Handler, HandlerContext } from './context';
import {
  lookupOccupationHandler, searchResearchHandler,
  getTransitionStoriesHandler, getPageContextHandler
} from './handlers/evidence';
import {
  analyzeCareerTransitionHandler, compareOccupationsHandler, getOccupationNewsHandler
} from './handlers/analysis';
import {
  saveCareerPlanHandler, getMyPlansHandler, addMilestoneHandler,
  updateMilestoneProgressHandler, sharePlanToCommunityHandler
} from './handlers/workspace';

export interface WebMcpRegistrationResult {
  registered: boolean;
  count: number;
}

interface ModelContextLike {
  registerTool(tool: Record<string, unknown>, options?: { signal?: AbortSignal }): void;
}

interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  readOnly: boolean;
  handler: Handler;
}

const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'lookup_occupation',
    title: 'Lookup occupation (Vietnam resilience DB)',
    description:
      'Look up an occupation in La Ban\'s curated Vietnam resilience database. Returns resilience scores, task-level automation exposure, O*NET/MOLISA codes and real sources. Call this FIRST for any occupation question.',
    readOnly: true,
    handler: lookupOccupationHandler
  },
  {
    name: 'search_research',
    title: 'Search research library',
    description:
      'Search the curated research library (WEF, ILO, McKinsey, TopCV, academic papers) for verifiable evidence about AI and labor-market trends. Returns up to 3 sources with key findings and Vietnam relevance. Cite these instead of guessing.',
    readOnly: true,
    handler: searchResearchHandler
  },
  {
    name: 'get_transition_stories',
    title: 'Get verified transition stories',
    description:
      'Read verified real-person career transition stories (e.g. graphic designer to AI art director) from La Ban\'s community. Use them to inspire and reassure the person you are advising.',
    readOnly: true,
    handler: getTransitionStoriesHandler
  },
  {
    name: 'get_laban_page_context',
    title: 'Get current page context',
    description:
      'Read what the human currently sees in La Ban: active tab, language, intake profile summary, whether an analysis is loaded, and how many plans are saved. Use this to ground advice in the shared page state.',
    readOnly: true,
    handler: getPageContextHandler
  },
  {
    name: 'analyze_career_transition',
    title: 'Run full career analysis pipeline',
    description:
      'Run La Ban\'s verified multi-agent analysis pipeline (Profiler, Evidence Gatherer, Analyst, Verifier) for a person\'s profile. Slower than evidence lookups but returns a complete, citation-grounded risk assessment with suggestions. Requires the current role.',
    readOnly: true,
    handler: analyzeCareerTransitionHandler
  },
  {
    name: 'compare_occupations',
    title: 'Compare 2-3 occupations',
    description:
      'Compare 2-3 occupations side by side on resilience, automation risk, augmentation potential and Vietnam demand signal, from the curated database.',
    readOnly: true,
    handler: compareOccupationsHandler
  },
  {
    name: 'get_occupation_news',
    title: 'Get role-specific Vietnam labor news',
    description:
      'Fetch recent Vietnam labor-market news relevant to a specific role (grounded live search with curated fallback). Use for current hiring/automation signals.',
    readOnly: true,
    handler: getOccupationNewsHandler
  },
  {
    name: 'get_my_plans',
    title: 'List saved career plans',
    description:
      'List the career plans saved in this La Ban workspace, with milestone progress. Check this before suggesting new plans or milestones.',
    readOnly: true,
    handler: getMyPlansHandler
  },
  {
    name: 'save_career_plan',
    title: 'Draft and save a career plan (human-approved)',
    description:
      'Draft a transition plan (4-8 milestones, ~90 days) and save it to the person\'s La Ban workspace. The human reviews and can edit the draft in a page modal BEFORE it is saved — a rejection means: ask what to change, do not retry blindly.',
    readOnly: false,
    handler: saveCareerPlanHandler
  },
  {
    name: 'add_milestone',
    title: 'Add milestone to a plan (human-confirmed)',
    description:
      'Add one milestone to an existing saved plan after the human confirms it in a page dialog.',
    readOnly: false,
    handler: addMilestoneHandler
  },
  {
    name: 'update_milestone_progress',
    title: 'Update milestone progress (human-confirmed)',
    description:
      'Mark a milestone of a saved plan as pending, in_progress or done after the human confirms. Useful for weekly check-ins.',
    readOnly: false,
    handler: updateMilestoneProgressHandler
  },
  {
    name: 'share_plan_to_community',
    title: 'Share plan to community (human-confirmed)',
    description:
      'Publish a saved plan as an anonymous community post so other workers can learn from it. The human confirms before anything is posted.',
    readOnly: false,
    handler: sharePlanToCommunityHandler
  }
];

export const WEBMCP_TOOL_COUNT = TOOL_DEFINITIONS.length;

export function getModelContext(): ModelContextLike | null {
  const doc = (globalThis as any).document;
  if (doc?.modelContext?.registerTool) return doc.modelContext;
  const nav = (globalThis as any).navigator;
  if (nav?.modelContext?.registerTool) return nav.modelContext;
  return null;
}

export function isWebmcpAvailable(): boolean {
  return getModelContext() !== null;
}

let registrationDone = false;

export function registerWebMcpTools(deps: {
  getPageContext: () => any;
  requestPlanApproval: HandlerContext['requestPlanApproval'];
  requestConfirm: HandlerContext['requestConfirm'];
}): WebMcpRegistrationResult {
  if (registrationDone) {
    return { registered: true, count: WEBMCP_TOOL_COUNT };
  }
  const mc = getModelContext();
  if (!mc) {
    return { registered: false, count: 0 };
  }
  const controller = new AbortController();
  let ok = 0;
  for (const def of TOOL_DEFINITIONS) {
    try {
      mc.registerTool(
        {
          name: def.name,
          title: def.title,
          description: def.description,
          inputSchema: TOOL_SCHEMAS[def.name as keyof typeof TOOL_SCHEMAS],
          annotations: def.readOnly ? { readOnlyHint: true } : undefined,
          execute: (input: any, client: any) =>
            def.handler(input, {
              client,
              getPageContext: deps.getPageContext,
              requestPlanApproval: deps.requestPlanApproval,
              requestConfirm: deps.requestConfirm
            })
        },
        { signal: controller.signal }
      );
      ok += 1;
    } catch (err) {
      // One bad tool must never break the rest of the app.
      console.warn(`[webmcp] failed to register tool ${def.name}:`, err);
    }
  }
  registrationDone = ok > 0;
  return { registered: registrationDone, count: ok };
}
