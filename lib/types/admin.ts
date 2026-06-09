export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isProSubscriber: boolean;
  videoAnalysisCount: number;
  captionGenerationCount: number;
  scriptGenerationCount: number;
  ideaGenerationCount: number;
  coachMessageCount: number;
  usageResetAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialProfile {
  platform: "TIKTOK" | "INSTAGRAM";
  username: string | null;
  followers: number | null;
  engagement: number | null;
  engagementRate: number | null;
  lastSyncAt: string | null;
}

export interface AdminUserDetail extends AdminUser {
  onboarding: {
    socialAccounts: unknown;
    audience: unknown;
    goals: unknown;
    contentTopics: unknown;
    experienceLevel: unknown;
    completedAt: string | null;
  } | null;
  creator: {
    id: string;
    username: string | null;
    bio: string | null;
    location: string | null;
    category: string | null;
    languages: string[];
    tiktokUsername: string | null;
    instagramUsername: string | null;
    facebookUsername: string | null;
    feedbackTone: string | null;
    socialAuthStatus: string;
    socialProfiles: SocialProfile[];
  } | null;
  totalAnalyses: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface StatsResponse {
  totalUsers: number;
  proSubscribers: number;
  freeUsers: number;
  totalCreators: number;
  activeUsers?: number;
  activeUsersLast30d?: number;
  ai?: {
    creditsConsumed?: number;
    costUsd?: number;
    creditPriceUsd?: number;
    tokensConsumed?: {
      input?: number;
      output?: number;
      total?: number;
    };
  };
  usage: {
    videoAnalyses: number;
    captionGenerations: number;
    scriptGenerations: number;
    ideaGenerations: number;
    coachMessages: number;
  };
  signupsLast30Days: Array<{ date: string; count: number }>;
}

export type VideoPlatform = "TIKTOK" | "INSTAGRAM" | "YOUTUBE";
export type VideoCategory = "HOOKS" | "STORYTELLING" | "TRANSITIONS" | "CTAS" | "TRENDS";

export interface InspirationVideo {
  id: string;
  platform: VideoPlatform;
  sourceUrl: string;
  thumbnailUrl: string;
  creatorHandle: string;
  label: string;
  category: VideoCategory;
  tags: string[];
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecentUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isProSubscriber: boolean;
  createdAt: string;
}

export interface RecentUsersResponse {
  users: RecentUser[];
}

export interface BlockUserPayload {
  isBlocked: boolean;
  reason?: string;
}

export interface BlockUserResponse {
  id: string;
  isBlocked: boolean;
}

export interface AdjustCreditsPayload {
  amount: number;
  reason?: string;
}

export interface AdjustCreditsResponse {
  id: string;
  videoAnalysisCount?: number;
  captionGenerationCount?: number;
  scriptGenerationCount?: number;
  ideaGenerationCount?: number;
  coachMessageCount?: number;
}

export interface RecentPayment {
  id: string;
  userId: string;
  userEmail?: string | null;
  amount: number;
  currency: string;
  status: string;
  provider?: string | null;
  createdAt: string;
}

export interface RecentPaymentsResponse {
  payments: RecentPayment[];
  pagination?: Pagination;
}

export interface SubscriptionOverview {
  total: number;
  active: number;
  canceled: number;
  trial: number;
  revenuecatTotals: {
    activeSubscriptions?: number | null;
    activeTrials?: number | null;
    activeUsers?: number | null;
    mrr?: number | null;
    revenue?: number | null;
  } | null;
}

export interface RevenueRange {
  from: string;
  to: string;
  start: string;
  end: string;
}

export interface RevenueDeltas {
  amountSoldPct: number | null;
  purchasesPct: number | null;
  grossProfitPct: number | null;
  aiCreditsPct: number | null;
  actualCostPct: number | null;
}

export interface RevenuePrior {
  range: { start: string; end: string };
  amountSoldUsd: number;
  purchasesCount: number;
  grossProfitUsd: number;
  aiCreditsConsumed: number;
  actualCostUsd: number;
}

export interface RevenueSummary {
  range: RevenueRange;
  amountSoldUsd: number;
  purchasesCount: number;
  aiCreditsConsumed: number;
  actualCostUsd: number;
  grossProfitUsd: number;
  deltas: RevenueDeltas;
  prior: RevenuePrior;
  revenuecatTotals: {
    mrr?: number | null;
    revenue?: number | null;
    activeSubscriptions?: number | null;
    activeUsers?: number | null;
  } | null;
  notes?: Record<string, string>;
}

export interface RevenueTimeseriesPoint {
  date: string;
  amount: number;
}

export interface RevenueTimeseriesResponse {
  range: RevenueRange;
  granularity: "day" | "week" | "month";
  points: RevenueTimeseriesPoint[];
  days?: RevenueTimeseriesPoint[];
}

export interface RevenueBreakdownItem {
  label: string;
  amount: number;
  share: number;
}

export interface RevenueBreakdownResponse {
  items: RevenueBreakdownItem[];
  currency: string;
}

export interface RevenueDailyBreakdownRow {
  date: string;
  revenueUsd: number;
  amountSoldUsd: number;
  purchases: number;
  aiCreditsConsumed: number;
  creditsConsumed: number;
  actualCostUsd: number;
  grossProfitUsd: number;
  marginPct: number | null;
}

export interface RevenueDailyBreakdownTotals {
  revenueUsd: number;
  amountSoldUsd: number;
  aiCreditsConsumed: number;
  actualCostUsd: number;
  grossProfitUsd: number;
  marginPct: number | null;
}

export interface RevenueDailyBreakdownResponse {
  range: { from: string; to: string };
  granularity: "day" | "week" | "month";
  rows: RevenueDailyBreakdownRow[];
  totals: RevenueDailyBreakdownTotals;
  featureBreakdown?: unknown;
  totalCredits?: number;
  totalCostUsd?: number;
  creditPriceUsd?: number;
  monthlyBudgetCredits?: number;
}

export interface InspirationVideoPayload {
  platform: VideoPlatform;
  sourceUrl: string;
  thumbnailUrl: string;
  creatorHandle: string;
  label: string;
  category: VideoCategory;
  tags?: string[];
  displayOrder?: number;
  isPublished?: boolean;
}
