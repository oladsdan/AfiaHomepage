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
