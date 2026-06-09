import {
  LayoutDashboard,
  Video,
  BarChart3,
  Sparkles,
  MessageSquareText,
  FileText,
  Lightbulb,
  Clapperboard,
  Settings,
  HelpCircle,
} from "lucide-react";
import type {
  AnalyzerPerk,
  FeatureCard,
  MetricCard,
  NavLink,
  VideoItem,
} from "./dashboard-types";

export const primaryNav: NavLink[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "video-analyzer", label: "Video analyzer", icon: Video, href: "/video-analyzer" },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ai-tools", label: "AI Tools", icon: Sparkles },
  { id: "caption-generator", label: "Caption generator", icon: MessageSquareText, href: "/caption-generator" },
  { id: "script-generator", label: "Script generator", icon: FileText, href: "/script-generator" },
  { id: "content-ideas", label: "Content Ideas & Hooks", icon: Lightbulb, href: "/content-ideas" },
  { id: "recent-videos", label: "Recent videos", icon: Clapperboard },
];

export const secondaryNav: NavLink[] = [
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  { id: "help", label: "Help & support", icon: HelpCircle },
];

export const metrics: MetricCard[] = [
  {
    id: "views",
    label: "Total views",
    value: "1.2M",
    trend: { direction: "up", percent: "18.6%" },
    sparkline: [8, 12, 9, 14, 13, 18, 16, 22],
    sparkColor: "#3b82f6",
  },
  {
    id: "engagement",
    label: "Engagement rate",
    value: "8.4%",
    trend: { direction: "up", percent: "12.7%" },
    sparkline: [6, 7, 9, 8, 11, 10, 13, 15],
    sparkColor: "#10b981",
  },
  {
    id: "followers",
    label: "Followers",
    value: "+2.1K",
    trend: { direction: "up", percent: "15.3%" },
    sparkline: [4, 6, 5, 9, 8, 12, 14, 17],
    sparkColor: "#a855f7",
  },
  {
    id: "score",
    label: "Content score",
    value: "89/100",
    trend: { direction: "up", percent: "9.1%" },
    sparkline: [10, 9, 12, 11, 14, 13, 16, 18],
    sparkColor: "#f59e0b",
  },
];

export const analyzerPerks: AnalyzerPerk[] = [
  { id: "engagement", label: "Engagement feedback" },
  { id: "caption", label: "Caption suggestions" },
  { id: "hook", label: "Hook analysis" },
  { id: "score", label: "Content score" },
  { id: "retention", label: "Retention insights" },
  { id: "tips", label: "Actionable tips" },
];

export const featureCards: FeatureCard[] = [
  {
    id: "afia-ai",
    title: "Afia's AI",
    description: "Get personalized tips and recommendations tailored for you",
    iconSrc: "/dash/icon-afia-ai.png",
    accent: "#7c3aed",
    href: "/ai-chat",
  },
  {
    id: "caption",
    title: "Caption generator",
    description: "Generate engaging, viral captions for your videos in seconds",
    iconSrc: "/dash/icon-caption.png",
    accent: "#0FA37F",
    href: "/caption-generator",
  },
  {
    id: "script",
    title: "Script generator",
    description: "Craft compelling scripts that hook your audience",
    iconSrc: "/dash/icon-script.png",
    accent: "#f59e0b",
    href: "/script-generator",
  },
  {
    id: "ideas",
    title: "Content Ideas & Hooks",
    description: "Discover trending ideas and hooks that get more views",
    iconSrc: "/dash/icon-ideas.png",
    accent: "#ec4899",
    href: "/content-ideas",
  },
];

export const recentVideos: VideoItem[] = [
  {
    id: "v1",
    title: "5 Tips to Grow Faster",
    thumbnail: "/dash/video1.png",
    duration: "00:45",
    views: "12.4K views",
    timeAgo: "2h ago",
  },
  {
    id: "v2",
    title: "My Content Studio Setup",
    thumbnail: "/dash/video2.png",
    duration: "01:12",
    views: "8.7K views",
    timeAgo: "1d ago",
  },
  {
    id: "v3",
    title: "Stop Making This Mistake",
    thumbnail: "/dash/video3.png",
    duration: "00:59",
    views: "32.1K views",
    timeAgo: "2d ago",
  },
  {
    id: "v4",
    title: "A Day in the Mountains",
    thumbnail: "/dash/video4.png",
    duration: "00:30",
    views: "5.3K views",
    timeAgo: "3d ago",
  },
  {
    id: "v5",
    title: "Content Ideas That Work",
    thumbnail: "/dash/video5.png",
    duration: "00:47",
    views: "11.2K views",
    timeAgo: "4d ago",
  },
  {
    id: "v6",
    title: "Morning Routine",
    thumbnail: "/dash/video6.png",
    duration: "00:51",
    views: "7.8K views",
    timeAgo: "5d ago",
  },
];

export const userAvatar = "/dash/avatar.png";
