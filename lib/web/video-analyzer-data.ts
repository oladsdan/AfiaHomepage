import { BarChart3, Magnet, Activity, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AnalyzerBenefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const analyzerBenefits: AnalyzerBenefit[] = [
  {
    id: "engagement",
    title: "Engagement insights",
    description: "Understand what keeps your audience engaged",
    icon: BarChart3,
    color: "#0FA37F",
  },
  {
    id: "hook",
    title: "Hook analysis",
    description: "See how strong your hook is and improve it",
    icon: Magnet,
    color: "#7c3aed",
  },
  {
    id: "retention",
    title: "Retention tracking",
    description: "Identify drop-off points and key moments",
    icon: Activity,
    color: "#f59e0b",
  },
  {
    id: "suggestions",
    title: "Smart suggestions",
    description: "Get AI-powered tips to boost performance",
    icon: MessageSquare,
    color: "#ec4899",
  },
];
