"use client";

/**
 * Tracks per-note (i.e. per-topic) performance so we can:
 *   - show "weak spots" on the dashboard
 *   - power Learn mode's "needs work" view
 *
 * Stored entirely in localStorage. Each entry tracks attempts and how many were
 * wrong/partial — a "weakness score" combining recency and miss rate.
 */

export interface NoteStat {
  noteId: string;
  attempts: number;
  wrong: number;
  partial: number;
  lastAttempt: string;       // ISO date
  lastWrong?: string;        // ISO date
  recentVerdicts: ("correct" | "partial" | "wrong")[]; // last 8, newest first
}

const KEY = "rv_weakspots";

function load(): Record<string, NoteStat> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, NoteStat>) : {};
  } catch {
    return {};
  }
}

function save(s: Record<string, NoteStat>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordVerdict(noteId: string, verdict: "correct" | "partial" | "wrong") {
  if (!noteId) return;
  const all = load();
  const now = new Date().toISOString();
  const cur: NoteStat = all[noteId] ?? {
    noteId,
    attempts: 0,
    wrong: 0,
    partial: 0,
    lastAttempt: now,
    recentVerdicts: [],
  };
  cur.attempts += 1;
  if (verdict === "wrong") { cur.wrong += 1; cur.lastWrong = now; }
  if (verdict === "partial") cur.partial += 1;
  cur.lastAttempt = now;
  cur.recentVerdicts = [verdict, ...cur.recentVerdicts].slice(0, 8);
  all[noteId] = cur;
  save(all);
}

export function getAllStats(): Record<string, NoteStat> {
  return load();
}

/** Higher = weaker. Range roughly 0–1.5. */
export function weaknessScore(s: NoteStat): number {
  if (s.attempts === 0) return 0;
  const missRate = (s.wrong + 0.5 * s.partial) / s.attempts;
  // Recency boost — recent wrong answers weigh more
  const recentWrong = s.recentVerdicts.slice(0, 4).filter((v) => v === "wrong").length;
  const recencyBoost = recentWrong * 0.12;
  return missRate + recencyBoost;
}

/** Returns the top `limit` noteIds the user has performed worst on, optionally filtered by subject membership. */
export function getWeakSpots(
  noteIdToSubject: Record<string, string>,
  opts: { subject?: string; limit?: number; minAttempts?: number } = {},
): NoteStat[] {
  const { subject, limit = 10, minAttempts = 1 } = opts;
  const all = load();
  return Object.values(all)
    .filter((s) => s.attempts >= minAttempts && (s.wrong > 0 || s.partial > 0))
    .filter((s) => !subject || noteIdToSubject[s.noteId] === subject)
    .sort((a, b) => weaknessScore(b) - weaknessScore(a))
    .slice(0, limit);
}

export function clearWeakSpot(noteId: string) {
  const all = load();
  delete all[noteId];
  save(all);
}

export function resetAll() {
  save({});
}
