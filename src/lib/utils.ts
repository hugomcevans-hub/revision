import { type ClassValue, clsx } from "clsx";
import { QuizQuestion } from "@/types";

export function shuffleMcqOptions(q: QuizQuestion): QuizQuestion {
  if (q.type !== "mcq") return q;
  const idx = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
  return {
    ...q,
    options: idx.map((i) => q.options[i]),
    correctIndex: idx.indexOf(q.correctIndex),
  };
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function pluralise(n: number, word: string): string {
  return `${n} ${word}${n !== 1 ? "s" : ""}`;
}
