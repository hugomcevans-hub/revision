"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, HelpCircle, BookOpenText, ChevronRight, Flame, Zap, Timer, GraduationCap, AlertCircle } from "lucide-react";
import { store } from "@/lib/store";
import { getSubjectTheme } from "@/lib/subjects";
import { SubjectProgress } from "@/types";
import { loadGame, levelFromXp, GameState } from "@/lib/game";
import { getWeakSpots, NoteStat } from "@/lib/weakSpots";
import { getNoteById, getNoteIdToSubject } from "@/lib/topics";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Late-night study";
}

function MasteryRing({ pct, color, size = 44 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 4;
  const C = 2 * Math.PI * r;
  const offset = C - (Math.min(100, Math.max(0, pct)) / 100) * C;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--text-soft)" }}>
          {Math.round(pct)}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<SubjectProgress[]>([]);
  const [game, setGame] = useState<GameState | null>(null);
  const [weakSpots, setWeakSpots] = useState<NoteStat[]>([]);

  useEffect(() => {
    setSubjects(store.getSubjectProgress());
    const idToSubject = getNoteIdToSubject();
    const refresh = () => {
      setGame(loadGame());
      setWeakSpots(getWeakSpots(idToSubject, { limit: 3 }));
    };
    refresh();
    const t = setInterval(refresh, 1500);
    window.addEventListener("game:update", refresh);
    return () => {
      clearInterval(t);
      window.removeEventListener("game:update", refresh);
    };
  }, []);

  const lvl = game ? levelFromXp(game.xp) : { level: 1 };
  const todayXp = game?.todayXp ?? 0;
  const dailyGoal = game?.dailyGoal ?? 50;
  const goalPct = Math.min(100, Math.round((todayXp / dailyGoal) * 100));
  const goalHit = goalPct >= 100;
  const streak = game?.streak ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-5 pt-10 sm:pt-14 pb-4 w-full">
      {/* Hero */}
      <section className="anim-fade-up mb-8">
        <p className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
          {greeting()}.
        </p>
        <h1 className="mt-1 text-[28px] sm:text-[34px] font-bold leading-tight tracking-tight">
          Ready to revise?
        </h1>

        {/* daily progress — quiet, single line */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${goalPct}%`,
                background: goalPct >= 100
                  ? "linear-gradient(90deg, #14b8a6, #38bdf8)"
                  : "linear-gradient(90deg, #14b8a6, #ff6b6b)",
                boxShadow: goalPct > 0 ? "0 0 12px rgba(20, 184, 166, 0.4)" : "none",
              }}
            />
          </div>
          <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--text-soft)" }}>{todayXp}</span>
            <span className="opacity-50"> / {dailyGoal} XP</span>
          </span>
        </div>

        {/* secondary stats — small chips, only show if meaningful */}
        {(streak > 0 || lvl.level > 1) && (
          <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--muted-soft)" }}>
            {streak > 0 && (
              <span
                className="flex items-center gap-1.5 px-2 py-1 rounded-full anim-streak-glow"
                style={{
                  background: "rgba(251, 146, 60, 0.12)",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  color: "#fdba74",
                }}
              >
                <Flame size={12} className="anim-flicker" fill="#fb923c" color="#fb923c" />
                <span className="tabular-nums font-semibold">{streak}-day streak</span>
              </span>
            )}
            {lvl.level > 1 && (
              <span className="flex items-center gap-1.5">
                <Zap size={12} fill="#14b8a6" color="#14b8a6" />
                <span className="tabular-nums">Level {lvl.level}</span>
              </span>
            )}
          </div>
        )}
      </section>

      {/* Primary action row */}
      <section className="space-y-3 mb-8">
        <Link
          href="/learn"
          className="anim-fade-up delay-1 group relative overflow-hidden rounded-3xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #38bdf8 100%)",
            boxShadow: "0 10px 30px rgba(20, 184, 166, 0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
            minHeight: 96,
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <GraduationCap size={24} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white">Learn a topic</p>
            <p className="text-xs text-white/80 mt-0.5">Read, then quick check on what stuck</p>
          </div>
          <ChevronRight size={18} className="text-white/70" />
        </Link>

        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/flashcards"
            className="anim-fade-up delay-2 rounded-3xl p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            style={{
              background: "linear-gradient(160deg, #8b5cf6 0%, #38bdf8 100%)",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
              minHeight: 110,
            }}
          >
            <Brain size={20} className="text-white" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-white">Cards</p>
              <p className="text-[11px] text-white/80 mt-0.5">Flip & learn</p>
            </div>
          </Link>
          <Link
            href="/quiz"
            className="anim-fade-up delay-3 rounded-3xl p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            style={{
              background: "linear-gradient(160deg, #ff6b6b 0%, #fb923c 100%)",
              boxShadow: "0 10px 30px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
              minHeight: 110,
            }}
          >
            <HelpCircle size={20} className="text-white" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-white">Quiz</p>
              <p className="text-[11px] text-white/80 mt-0.5">Mixed practice</p>
            </div>
          </Link>
          <Link
            href="/test"
            className="anim-fade-up delay-4 rounded-3xl p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            style={{
              background: "linear-gradient(160deg, #fb923c 0%, #fbbf24 100%)",
              boxShadow: "0 10px 30px rgba(251, 146, 60, 0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
              minHeight: 110,
            }}
          >
            <Timer size={20} className="text-white" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-white">Test</p>
              <p className="text-[11px] text-white/80 mt-0.5">Exam mode</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Weak spots — appear only when there's data */}
      {weakSpots.length > 0 && (
        <section className="anim-fade-up delay-5 mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3 px-1 flex items-center gap-1.5"
            style={{ color: "var(--warning)" }}
          >
            <AlertCircle size={11} /> Revise weak spots
          </h2>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {weakSpots.map((s, i) => {
              const n = getNoteById(s.noteId);
              if (!n) return null;
              const t = getSubjectTheme(n.subject);
              return (
                <Link
                  key={s.noteId}
                  href={`/learn?noteId=${encodeURIComponent(s.noteId)}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: t.colorSoft, color: t.color }}
                  >
                    <t.icon size={15} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[14px] truncate">{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {n.subject} · {s.wrong} wrong of {s.attempts}
                    </p>
                  </div>
                  <ChevronRight size={15} style={{ color: "var(--muted)", opacity: 0.5 }} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Subjects — iOS list style */}
      <section className="anim-fade-up delay-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3 px-1" style={{ color: "var(--muted)" }}>
          Subjects
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {subjects.map((s, i) => {
            const theme = getSubjectTheme(s.subject);
            const Icon = theme.icon;
            const masteryPct = game?.mastery?.[s.subject] ?? 0;
            const colorMap: Record<string, string> = {
              Biology: "#14b8a6",
              Chemistry: "#fb923c",
              Physics: "#38bdf8",
              History: "#ff6b6b",
            };
            const ringColor = colorMap[s.subject] ?? "#14b8a6";
            return (
              <Link
                key={s.subject}
                href={`/flashcards?subject=${encodeURIComponent(s.subject)}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: theme.colorSoft, color: theme.color }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[15px]">{s.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {s.totalCards} cards
                    {s.quizzesTaken > 0 && ` · ${Math.round(s.avgScore)}% avg`}
                  </p>
                </div>
                <MasteryRing pct={masteryPct} color={ringColor} />
                <ChevronRight size={16} style={{ color: "var(--muted)", opacity: 0.5 }} />
              </Link>
            );
          })}
        </div>
        <Link
          href="/notes"
          className="mt-3 flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--surface-strong)", color: "var(--text-soft)" }}
            >
              <BookOpenText size={17} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-medium text-[15px]">All Notes</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                Browse and search your vault
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "var(--muted)", opacity: 0.5 }} />
        </Link>
      </section>

      {goalHit && null}
    </div>
  );
}
