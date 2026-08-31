import type { CareerSuggestion, CommunityPost, EmployerJobListing, UserIntakeProfile } from '../types';
import type { ComprehensiveCareerAnalysisResult } from '../types/careerAnalysis';

// Local persistence layer (hackathon submission): replaces the removed
// Firebase/Firestore integration so the app is fully self-contained and
// never calls external services from the browser.

const ASSESSMENT_PREFIX = 'laban_assessment_';
const ROADMAP_PREFIX = 'laban_roadmap_';

export function saveAssessmentLocally(
  userId: string,
  intakeProfile: UserIntakeProfile,
  suggestions: CareerSuggestion[],
  comprehensiveAnalysis?: ComprehensiveCareerAnalysisResult | null
): boolean {
  try {
    localStorage.setItem(
      ASSESSMENT_PREFIX + userId,
      JSON.stringify({
        intakeProfile,
        suggestions,
        comprehensiveAnalysis: comprehensiveAnalysis || null,
        updatedAt: new Date().toISOString()
      })
    );
    return true;
  } catch {
    return false;
  }
}

export function getAssessmentLocally(userId: string): {
  intakeProfile?: UserIntakeProfile;
  suggestions?: CareerSuggestion[];
  comprehensiveAnalysis?: ComprehensiveCareerAnalysisResult | null;
} | null {
  try {
    const raw = localStorage.getItem(ASSESSMENT_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export interface RoadmapState {
  completedMilestones: Record<string, boolean>;
  quizSubmitted: Record<string, boolean>;
  selectedAnswers: Record<string, number>;
  emailReminderEnabled: boolean;
}

export function saveRoadmapLocally(userId: string, state: RoadmapState): boolean {
  try {
    localStorage.setItem(ROADMAP_PREFIX + userId, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getRoadmapLocally(userId: string): RoadmapState | null {
  try {
    const raw = localStorage.getItem(ROADMAP_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function buildCommunityPost(input: {
  authorAlias: string;
  isAnonymous: boolean;
  userCurrentRole: string;
  tag: unknown;
  title: string;
  content: string;
}): CommunityPost {
  return {
    id: `post-${Date.now()}`,
    title: input.title,
    content: input.content,
    authorAlias: input.authorAlias,
    isAnonymous: input.isAnonymous,
    userCurrentRole: input.userCurrentRole,
    tag: input.tag as CommunityPost['tag'],
    likesCount: 0,
    replies: [],
    createdAt: new Date().toISOString()
  } as CommunityPost;
}

export function buildEmployerListing(data: Record<string, unknown>): EmployerJobListing {
  return {
    ...data,
    id: `listing-${Date.now()}`,
    postedDate: new Date().toISOString().split('T')[0]
  } as EmployerJobListing;
}
