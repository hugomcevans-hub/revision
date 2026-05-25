"use client";
import { Flashcard, QuizQuestion, StudySession, SubjectProgress } from "@/types";
import { NOTES } from "@/data/notes";
import { DEFAULT_FLASHCARDS } from "@/data/flashcards";
import { DEFAULT_QUIZ } from "@/data/quiz";
import { TRUE_FALSE_QUESTIONS } from "@/data/truefalse";
import { FILL_BLANK_QUESTIONS } from "@/data/fillblank";
import { SHORT_ANSWER_QUESTIONS } from "@/data/shortanswer";

const ALL_QUESTIONS: QuizQuestion[] = [
  ...DEFAULT_QUIZ,
  ...TRUE_FALSE_QUESTIONS,
  ...FILL_BLANK_QUESTIONS,
  ...SHORT_ANSWER_QUESTIONS,
];

const SESSIONS_KEY = "rv_sessions";

function save(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const store = {
  getNotes: () => NOTES,
  getCards: (): Flashcard[] => DEFAULT_FLASHCARDS,
  getQuiz: (): QuizQuestion[] => ALL_QUESTIONS,
  getMCQOnly: (): QuizQuestion[] => DEFAULT_QUIZ,

  getSessions: () => load<StudySession[]>(SESSIONS_KEY, []),
  addSession: (s: StudySession) => {
    const sessions = load<StudySession[]>(SESSIONS_KEY, []);
    save(SESSIONS_KEY, [s, ...sessions].slice(0, 200));
  },

  getSubjectProgress: (): SubjectProgress[] => {
    const sessions = load<StudySession[]>(SESSIONS_KEY, []);
    const subjectMap = new Map<string, SubjectProgress>();

    for (const card of DEFAULT_FLASHCARDS) {
      if (!subjectMap.has(card.subject)) {
        subjectMap.set(card.subject, {
          subject: card.subject,
          totalCards: 0,
          dueCards: 0,
          masteredCards: 0,
          quizzesTaken: 0,
          avgScore: 0,
        });
      }
      subjectMap.get(card.subject)!.totalCards++;
    }

    for (const s of sessions) {
      if (s.mode === "quiz" && s.score !== undefined) {
        const p = subjectMap.get(s.subject);
        if (p) {
          p.quizzesTaken++;
          p.avgScore = (p.avgScore * (p.quizzesTaken - 1) + s.score) / p.quizzesTaken;
          if (!p.lastStudied || s.date > p.lastStudied) p.lastStudied = s.date;
        }
      }
    }

    return [...subjectMap.values()].sort((a, b) => a.subject.localeCompare(b.subject));
  },
};
