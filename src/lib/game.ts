"use client";

// ─── XP / Level curve ────────────────────────────────────────────────────
// Fast leveling: L1→L2 = 50 XP, each level adds 25 XP to the requirement.
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // total XP needed to *reach* this level
  let total = 0;
  for (let n = 1; n < level; n++) total += 50 + (n - 1) * 25;
  return total;
}

export function levelFromXp(xp: number): { level: number; intoLevel: number; needed: number } {
  let level = 1;
  let consumed = 0;
  while (true) {
    const needed = 50 + (level - 1) * 25;
    if (consumed + needed > xp) {
      return { level, intoLevel: xp - consumed, needed };
    }
    consumed += needed;
    level += 1;
    if (level > 999) return { level, intoLevel: 0, needed: 1 };
  }
}

// ─── Combo multipliers ───────────────────────────────────────────────────
export function comboMultiplier(streak: number): number {
  if (streak >= 10) return 5;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export function comboLabel(streak: number): string | null {
  if (streak >= 10) return "ON FIRE";
  if (streak >= 5) return "HOT STREAK";
  if (streak >= 3) return "COMBO";
  return null;
}

// ─── Game state (localStorage) ───────────────────────────────────────────
export interface GameState {
  xp: number;
  streak: number;             // daily streak (days)
  lastStudyDate: string;      // YYYY-MM-DD
  todayXp: number;            // resets each day
  dailyGoal: number;          // default 50 XP
  mastery: Record<string, number>; // per-subject 0–100
  achievements: string[];     // unlocked codes
  totalCorrect: number;
  totalAnswered: number;
  bestCombo: number;
}

const KEY = "rv_game";
const DEFAULT: GameState = {
  xp: 0,
  streak: 0,
  lastStudyDate: "",
  todayXp: 0,
  dailyGoal: 50,
  mastery: {},
  achievements: [],
  totalCorrect: 0,
  totalAnswered: 0,
  bestCombo: 0,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const ad = new Date(a + "T00:00:00Z").getTime();
  const bd = new Date(b + "T00:00:00Z").getTime();
  return Math.round((bd - ad) / 86_400_000);
}

export function loadGame(): GameState {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveGame(g: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(g));
}

// Apply daily-rollover before any update
function rollover(g: GameState): GameState {
  const today = todayStr();
  if (g.lastStudyDate === today) return g;

  const diff = dayDiff(g.lastStudyDate, today);
  let streak = g.streak;
  if (!g.lastStudyDate) {
    // first ever study — don't bump yet
  } else if (diff === 1) {
    // streak continues — but only when XP earned today (handled in awardXp)
  } else if (diff > 1) {
    streak = 0;
  }
  return { ...g, streak, todayXp: 0, lastStudyDate: today };
}

// ─── Mutators ────────────────────────────────────────────────────────────

export interface XpResult {
  state: GameState;
  prevLevel: number;
  newLevel: number;
  leveledUp: boolean;
  awarded: number;
}

export function awardXp(amount: number, subject?: string): XpResult {
  let g = rollover(loadGame());
  const prev = levelFromXp(g.xp);
  g = {
    ...g,
    xp: g.xp + amount,
    todayXp: g.todayXp + amount,
  };

  // Bump daily streak the first time today they earn XP
  if (g.streak === 0 || dayDiff(g.lastStudyDate, todayStr()) >= 0) {
    // Only count streak when *crossing into* this day with XP
    // We already rolled over lastStudyDate above. To detect "first xp today" we use todayXp before bump:
    if (g.todayXp === amount) {
      // first XP today
      // streak should be at least 1
      if (g.streak < 1) g.streak = 1;
      // If we have a saved streak and this is a contiguous day, the rollover() already kept it
    }
  }

  if (subject) {
    const cur = g.mastery[subject] ?? 0;
    g.mastery = { ...g.mastery, [subject]: Math.min(100, cur + (amount / 25)) };
  }

  const next = levelFromXp(g.xp);
  saveGame(g);
  return {
    state: g,
    prevLevel: prev.level,
    newLevel: next.level,
    leveledUp: next.level > prev.level,
    awarded: amount,
  };
}

export function recordAnswer(correct: boolean): GameState {
  let g = rollover(loadGame());
  g = {
    ...g,
    totalAnswered: g.totalAnswered + 1,
    totalCorrect: g.totalCorrect + (correct ? 1 : 0),
  };
  saveGame(g);
  return g;
}

export function recordBestCombo(combo: number): GameState {
  const g = rollover(loadGame());
  if (combo > g.bestCombo) {
    const ng = { ...g, bestCombo: combo };
    saveGame(ng);
    return ng;
  }
  return g;
}

// Bump streak — call this when user actually studies (any XP earned)
export function bumpStreakIfNeeded(): GameState {
  let g = loadGame();
  const today = todayStr();
  if (g.lastStudyDate === today && g.streak > 0) {
    saveGame(g);
    return g;
  }
  const diff = dayDiff(g.lastStudyDate, today);
  let streak = g.streak;
  if (!g.lastStudyDate) streak = 1;
  else if (diff === 1) streak += 1;
  else if (diff > 1) streak = 1;
  else streak = Math.max(streak, 1);
  g = { ...g, streak, lastStudyDate: today };
  saveGame(g);
  return g;
}
