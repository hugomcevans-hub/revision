import { Dna, FlaskConical, Atom, Landmark, BookOpenText, LucideIcon } from "lucide-react";

export interface SubjectTheme {
  name: string;
  color: string;       // solid accent
  colorSoft: string;   // translucent surface
  gradient: string;    // linear-gradient string
  icon: LucideIcon;
  emoji: string;       // used only as ASCII fallback if needed (never rendered as icon)
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  Biology: {
    name: "Biology",
    color: "var(--biology)",
    colorSoft: "var(--biology-soft)",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #38bdf8 100%)",
    icon: Dna,
    emoji: "🧬",
  },
  Chemistry: {
    name: "Chemistry",
    color: "var(--chemistry)",
    colorSoft: "var(--chemistry-soft)",
    gradient: "linear-gradient(135deg, #fb923c 0%, #ff6b6b 100%)",
    icon: FlaskConical,
    emoji: "⚗️",
  },
  Physics: {
    name: "Physics",
    color: "var(--physics)",
    colorSoft: "var(--physics-soft)",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #14b8a6 100%)",
    icon: Atom,
    emoji: "⚛️",
  },
  History: {
    name: "History",
    color: "var(--history)",
    colorSoft: "var(--history-soft)",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #fb923c 100%)",
    icon: Landmark,
    emoji: "📜",
  },
};

const FALLBACK: SubjectTheme = {
  name: "General",
  color: "var(--brand)",
  colorSoft: "rgba(20, 184, 166, 0.14)",
  gradient: "linear-gradient(135deg, #14b8a6 0%, #ff6b6b 100%)",
  icon: BookOpenText,
  emoji: "📚",
};

export function getSubjectTheme(subject: string): SubjectTheme {
  return SUBJECT_THEMES[subject] ?? FALLBACK;
}
