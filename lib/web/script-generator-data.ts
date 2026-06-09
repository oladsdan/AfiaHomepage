import { BookOpen, GraduationCap, Rocket, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ScriptTypeOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const scriptTypes: ScriptTypeOption[] = [
  {
    id: "storytelling",
    title: "Storytelling",
    description: "Engage your audience with a great story",
    icon: BookOpen,
    color: "#2563eb",
    bg: "#dbeafe",
  },
  {
    id: "educational",
    title: "Educational",
    description: "Teach and inform your audience",
    icon: GraduationCap,
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    id: "viral-hook",
    title: "Viral Hook",
    description: "Create attention-grabbing hooks",
    icon: Rocket,
    color: "#d97706",
    bg: "#fef3c7",
  },
  {
    id: "conversion",
    title: "Conversion",
    description: "Drive action and increase conversion",
    icon: DollarSign,
    color: "#059669",
    bg: "#d1fae5",
  },
];

export interface ScriptLengthOption {
  id: string;
  label: string;
}

export const scriptLengths: ScriptLengthOption[] = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

export interface ToneOption {
  id: string;
  label: string;
}

export const toneOptions: ToneOption[] = [
  { id: "confident", label: "Confident" },
  { id: "inspirational", label: "Inspirational" },
  { id: "conversational", label: "Conversational" },
  { id: "direct", label: "Direct" },
  { id: "high-energy", label: "High-energy" },
  { id: "calm-educational", label: "Calm & Educational" },
];
