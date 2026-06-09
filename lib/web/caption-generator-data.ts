import { BarChart3, FileEdit, Lightbulb, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiInstagram,
  SiTiktok,
  SiX,
  SiFacebook,
  SiLinkedin,
} from "react-icons/si";

export interface PlatformOption {
  id: string;
  label: string;
  icon: IconType;
  color: string;
}

export const platforms: PlatformOption[] = [
  { id: "instagram", label: "Instagram", icon: SiInstagram, color: "#E1306C" },
  { id: "tiktok", label: "TikTok", icon: SiTiktok, color: "#010101" },
  { id: "x", label: "X (Twitter)", icon: SiX, color: "#000000" },
  { id: "facebook", label: "Facebook", icon: SiFacebook, color: "#1877F2" },
  { id: "linkedin", label: "LinkedIn", icon: SiLinkedin, color: "#0A66C2" },
];

export interface StyleOption {
  id: string;
  label: string;
  emoji: string;
}

export const captionStyles: StyleOption[] = [
  { id: "viral", label: "Viral", emoji: "🔥" },
  { id: "conversational", label: "Conversational", emoji: "💬" },
  { id: "educational", label: "Educational", emoji: "📚" },
  { id: "funny", label: "Funny", emoji: "😄" },
  { id: "emotional", label: "Emotional", emoji: "❤️" },
  { id: "premium", label: "Premium", emoji: "💎" },
];

export interface AudienceOption {
  id: string;
  label: string;
  avatar: string;
}

export const audiences: AudienceOption[] = [
  { id: "teens", label: "Teens", avatar: "/dash/aud-teens.png" },
  { id: "young-adults", label: "Young adults", avatar: "/dash/aud-young-adults.png" },
  { id: "adults", label: "Adults", avatar: "/dash/aud-adults.png" },
  { id: "broad", label: "Broad audience", avatar: "/dash/aud-broad.png" },
];

export interface HelpItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const helpItems: HelpItem[] = [
  {
    id: "performance",
    title: "Improve performance",
    description: "Get tips to boost views and engagement",
    icon: BarChart3,
    color: "#2563eb",
    bg: "#dbeafe",
  },
  {
    id: "ideas",
    title: "Content ideas",
    description: "Discover trending ideas and creative hooks",
    icon: Lightbulb,
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    id: "optimization",
    title: "Video optimization",
    description: "Get advice on titles, captions and more",
    icon: FileEdit,
    color: "#d97706",
    bg: "#fef3c7",
  },
  {
    id: "insights",
    title: "Audience insights",
    description: "Understand your audience and grow faster",
    icon: Users,
    color: "#db2777",
    bg: "#fce7f3",
  },
];

export interface Conversation {
  id: string;
  text: string;
  time: string;
}

export const recentConversations: Conversation[] = [
  { id: "c1", text: "How can I increase retention", time: "10:30 AM" },
  { id: "c2", text: "Give me 5 viral video ideas", time: "Yesterday" },
  { id: "c3", text: "Best time to post on TikTok?", time: "2 days ago" },
  { id: "c4", text: "Why is my engagement low?", time: "3 days ago" },
];
