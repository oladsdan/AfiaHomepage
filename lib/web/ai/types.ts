/**
 * Shared types for the AI tools layer (02-ai-tools.md).
 * Server envelope: { success: true, data } | { success: false, message, code?, ...extra }.
 */

// ---------------------------------------------------------------------------
// Gates
// ---------------------------------------------------------------------------

/** Free-tier usage details returned with limit 403s. */
export interface UsageInfo {
  feature?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  trialExpired?: boolean;
  trialDaysRemaining?: number;
}

/** Payload handed to the global limit panel (server message shown VERBATIM). */
export interface LimitInfo {
  message: string;
  /** Pro user out of credits. */
  creditLimited?: boolean;
  /** Present for free users (daily limit / trial expired). */
  usageInfo?: UsageInfo;
}

export interface ConsentState {
  success: boolean;
  consented: boolean;
  consentedAt: string | null;
  currentVersion?: string;
}

// ---------------------------------------------------------------------------
// Usage / credits (GET /api/subscription/usage)
// ---------------------------------------------------------------------------

export interface CreditTopup {
  productId?: string;
  credits?: number;
  purchasedAt?: string;
  [key: string]: unknown;
}

export interface CreditsInfo {
  balance: number;
  monthlyBudget?: number;
  nextResetAt?: string;
  perFeatureCost?: Record<string, number>;
  topupTiers?: Array<{ productId: string; credits: number }>;
  recentTopups?: CreditTopup[];
}

export interface SubscriptionUsage {
  success?: boolean;
  /** Present for Pro users. */
  credits?: CreditsInfo;
  /** Free-tier trial/usage fields (shape may vary; render defensively). */
  isProSubscriber?: boolean;
  trialDaysRemaining?: number;
  trialExpired?: boolean;
  usage?: Record<string, { used?: number; limit?: number; remaining?: number }>;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Video analysis (Prompt 7)
// ---------------------------------------------------------------------------

export interface GcsSignedUrl {
  resumableUrl: string;
  storagePath: string;
  bucket: string;
  filename: string;
}

export interface GcsCompleteResult {
  uploadId: string;
  thumbnailUrl?: string;
  status: string; // "READY"
}

export interface AnalysisDraftResult {
  analysisId: string;
  status: string; // "PENDING"
}

export type AnalysisStatus = "PENDING" | "COMPLETED" | "FAILED" | string;

export interface RecommendationActionStep {
  step: string;
  timestamp?: string | number | null;
}

export interface AnalysisRecommendation {
  category?: string;
  severity?: string;
  title?: string;
  description?: string;
  observations?: string[];
  actionSteps?: RecommendationActionStep[];
  timestamp?: string | number | null;
}

export interface VideoAnalysis {
  id: string;
  status?: AnalysisStatus;
  overallScore?: number;
  scoreLabel?: string;
  scoreReasoning?: string;
  detectedNiche?: string;
  hookScore?: number;
  storytellingScore?: number;
  visualScore?: number;
  audioScore?: number;
  ctaScore?: number;
  captionsScore?: number;
  trendScore?: number;
  suggestedCaptions?: string[];
  suggestedHashtags?: string[];
  categoryStrengths?: Record<string, unknown>;
  recommendations?: AnalysisRecommendation[];
  parentAnalysisId?: string | null;
  revisionNumber?: number;
  thumbnailUrl?: string;
  frameUrls?: string[];
  /** Revision analyses carry improvement/comparison data vs. the parent. */
  improvement?: Record<string, unknown>;
  comparison?: Record<string, unknown>;
  videoTitle?: string;
  title?: string;
  fileName?: string;
  createdAt?: string;
  [key: string]: unknown;
}

/** Item from GET /api/videos/history (shape tolerated loosely). */
export interface AnalysisHistoryEntry {
  id: string;
  title?: string;
  videoTitle?: string;
  fileName?: string;
  status?: AnalysisStatus;
  overallScore?: number;
  scoreLabel?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  analyzedAt?: string;
  revisionNumber?: number;
  parentAnalysisId?: string | null;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Captions (Prompt 8)
// ---------------------------------------------------------------------------

export interface CaptionGenerateInput {
  description: string;
  platforms: string[];
  style: string;
  audience: string;
}

export interface CaptionOption {
  id: string;
  text: string;
}

export interface SavedCaption {
  id: string;
  text?: string;
  caption?: string;
  platforms?: string[];
  style?: string;
  audience?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Scripts (Prompt 9)
// ---------------------------------------------------------------------------

export interface ScriptGenerateInput {
  description: string;
  scriptTypes: string[];
  length: string;
  platforms: string[];
  tones: string[];
}

export interface GeneratedScript {
  id: string;
  title?: string;
  type?: string;
  /** Markdown body. */
  content: string;
  hookLine?: string;
  estimatedDuration?: string | number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Content ideas + hooks (Prompt 10)
// ---------------------------------------------------------------------------

export interface IdeaGenerateInput {
  description: string;
  platforms: string[];
  videoType: string;
  audience: string;
}

export interface ContentIdea {
  id?: string;
  title: string;
  description?: string;
  hooks?: string[];
  videoStructure?: string[];
  whyThisWorks?: string[];
  [key: string]: unknown;
}

export interface HooksGenerateInput {
  ideaTitle: string;
  ideaDescription: string;
  videoType: string;
  platforms: string[];
}

// ---------------------------------------------------------------------------
// AI Coach (Prompt 11)
// ---------------------------------------------------------------------------

export interface CoachReply {
  conversationId: string;
  reply: string;
  title?: string;
}

export interface CoachConversation {
  id: string;
  title?: string;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CoachMessage {
  id?: string;
  role: "user" | "assistant" | string;
  content?: string;
  message?: string;
  text?: string;
  createdAt?: string;
  [key: string]: unknown;
}
