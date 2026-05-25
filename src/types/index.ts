export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  rawContent: string;
  filePath: string;
  headings: string[];
  tags: string[];
  wordCount: number;
}

export interface Flashcard {
  id: string;
  noteId: string;
  front: string;
  back: string;
  subject: string;
}

// Quiz question types
export type QuestionType = "mcq" | "true-false" | "fill-blank" | "short-answer";

export interface MCQQuestion {
  type: "mcq";
  id: string;
  noteId: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrueFalseQuestion {
  type: "true-false";
  id: string;
  noteId: string;
  subject: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface FillBlankQuestion {
  type: "fill-blank";
  id: string;
  noteId: string;
  subject: string;
  /** Sentence with one or more "___" placeholders. */
  sentence: string;
  /** Accepted answers per blank, in order. Each blank can accept multiple synonyms. */
  answers: string[][];
  explanation: string;
}

export interface ShortAnswerQuestion {
  type: "short-answer";
  id: string;
  noteId: string;
  subject: string;
  question: string;
  /** Key concepts the answer must touch on (any 1+ counts as partial; majority = full credit). */
  acceptableAnswers: string[];
  /** Minimum number of key concepts that must appear (default: ceil(acceptableAnswers.length * 0.5)). */
  minMatches?: number;
  explanation: string;
}

export type QuizQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion;

export interface SubjectProgress {
  subject: string;
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  quizzesTaken: number;
  avgScore: number;
  lastStudied?: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  mode: "flashcards" | "quiz";
  score?: number;
  duration: number;
}
