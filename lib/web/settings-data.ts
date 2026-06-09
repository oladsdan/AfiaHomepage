import {
  PlayCircle,
  CalendarCheck,
  TrendingUp,
  Clock,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { SiTiktok, SiInstagram } from "react-icons/si";

export interface ProfileStat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const profileStats: ProfileStat[] = [
  { id: "reviewed", label: "Videos Reviewed", value: "1", icon: PlayCircle, color: "#2563eb" },
  { id: "ready", label: "Ready to Post", value: "1", icon: CalendarCheck, color: "#059669" },
  { id: "improved", label: "Improved Videos", value: "0", icon: TrendingUp, color: "#7c3aed" },
];

export interface ConnectedAccount {
  id: string;
  label: string;
  icon: IconType;
  color: string;
}

export const connectedAccounts: ConnectedAccount[] = [
  { id: "tiktok", label: "TikTok", icon: SiTiktok, color: "#010101" },
  { id: "instagram", label: "Instagram", icon: SiInstagram, color: "#E1306C" },
];

export interface SettingsRow {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export const analysisHistoryRow: SettingsRow = {
  id: "analysis-history",
  title: "Analysis history",
  subtitle: "View your past video analysis and AI feedback",
  icon: Clock,
  color: "#2563eb",
};

export const feedbackToneRow: SettingsRow = {
  id: "feedback-tone",
  title: "Feedback tone",
  subtitle: "Supportive",
  icon: MessageSquare,
  color: "#7c3aed",
};

export const supportRow: SettingsRow = {
  id: "help-center",
  title: "Help & support center",
  subtitle: "Get help, watch tutorials and find answers",
  icon: LifeBuoy,
  color: "#0FA37F",
};
