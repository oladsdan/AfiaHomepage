import type { LucideIcon } from "lucide-react";

export interface TrendData {
  direction: "up" | "down";
  percent: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  trend: TrendData;
  sparkline: number[];
  sparkColor: string;
}

export interface NavLink {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  accent: string;
  href?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  timeAgo: string;
}

export interface AnalyzerPerk {
  id: string;
  label: string;
}

export interface AnalysisHistoryItem {
  id: string;
  title: string;
  note: string;
  thumbnail: string;
  duration: string;
  status: "completed" | "processing" | "failed";
  /** ISO date string, e.g. "2024-05-20" */
  date: string;
  /** Display time, e.g. "10:30 AM" */
  time: string;
}
