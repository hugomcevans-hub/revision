"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Timer, Trophy, Target, Zap, ChevronRight, ChevronLeft, Flag,
  CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import { store } from "@/lib/store";
import { QuizQuestion, QuestionType } from "@/types";
import { randomId, shuffleMcqOptions } from "@/lib/utils";
import { getSubjectTheme } from "@/lib/subjects";
import { awardXp, recordAnswer, bumpStreakIfNeeded } from "@/lib/game";
import { useRewards } from "@/components/Reward";
import { notifyGameUpdate } from "@/components/StatsStrip";
import { sound } from "@/lib/sound";
import QuestionCard, { AnswerResult, AnswerVerdict } from "@/components/QuestionCard";
import TopicPicker from "@/components/TopicPicker";
import { recordVerdict } from "@/lib/weakSpots";

const SUBJECTS_ALL = "All";
type Phase = "setup" | "running" | "results";

interface TestAnswer {
  questionId: string;
  verdict: AnswerVerdict;
  feedback: string;
}

function TestInner() {
  const params = useSearchParams();
  const initialSubject = params.get("subject") || SUBJECTS_ALL;

  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState(initialSubject);
  const [length, setLength] = useState<10 | 20>(10);
  const [durationMin, setDurationMin] = useState<5 | 10 | 15>(10);
  const [topicFilter, setTopicFilter] = useState<Set<string>>(new Set());

  const [phase, setPhase] = useState<Phase>("setup");
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, TestAnswer>>({});
  const [timeLeftSec, setTimeLeftSec] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const { controller: rewards, Overlay: RewardOverlay } = useRewards();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const qs = store.getQuiz();
    setAllQuestions(qs);
    setSubjects([...new Set(qs.map((q) => q.subject))].sort());
  }, []);

  useEffect(() => () => { if (tickRef.current) clearInterval(tickRef.current); }, []);

  // Reset topic filter when subject changes
  useEffect(() => { setTopicFilter(new Set()); }, [subject]);

  function build(): QuizQuestion[] {
    const pool = allQuestions.filter((q) =>
      (subject === SUBJECTS_ALL || q.subject === subject) &&
      (topicFilter.size === 0 || topicFilter.has(q.noteId))
    );
    // Stratified shuffle: aim for ~25% of each type when possible
    const groups: Record<QuestionType, QuizQuestion[]> = {
      "mcq": [], "true-false": [], "fill-blank": [], "short-answer": [],
    };
    for (const q of pool) groups[q.type].push(q);
    for (const t of Object.keys(groups) as QuestionType[]) {
      groups[t] = groups[t].sort(() => Math.random() - 0.5);
    }

    const target = length;
    const perType = Math.floor(target / 4);
    const picked: QuizQuestion[] = [];
    for (const t of Object.keys(groups) as QuestionType[]) {
      picked.push(...groups[t].slice(0, perType));
    }
    // Fill remaining randomly from any leftovers
    const taken = new Set(picked.map((q) => q.id));
    const remainder = pool.filter((q) => !taken.has(q.id)).sort(() => Math.random() - 0.5);
    while (picked.length < target && remainder.length > 0) {
      picked.push(remainder.shift()!);
    }
    return picked.sort(() => Math.random() - 0.5).slice(0, target).map(shuffleMcqOptions);
  }

  function startTest() {
    const qs = build();
    if (qs.length === 0) return;
    setQueue(qs);
    setIndex(0);
    setAnswers({});
    setTimeLeftSec(durationMin * 60);
    setStartedAt(Date.now());
    setPhase("running");

    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setTimeLeftSec((t) => {
        if (t <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          finishTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleAnswer(result: AnswerResult, origin?: { x: number; y: number }) {
    const q = queue[index];
    if (!q) return;
    recordAnswer(result.verdict === "correct");
    recordVerdict(q.noteId, result.verdict);
    setAnswers((prev) => ({ ...prev, [q.id]: { questionId: q.id, verdict: result.verdict, feedback: result.feedback } }));

    // Subtle reward — smaller XP than quiz; full payoff comes at end-of-test
    if (result.verdict === "correct") sound.correct();
    else if (result.verdict === "partial") sound.correct();
    else sound.wrong();

    if (origin) {
      const xp = result.verdict === "correct" ? 5 : result.verdict === "partial" ? 2 : 0;
      if (xp > 0) {
        const r = awardXp(xp, q.subject);
        bumpStreakIfNeeded();
        rewards.award({ amount: xp, origin });
        if (r.leveledUp) {
          rewards.levelUp(r.newLevel);
          sound.levelUp();
        }
        notifyGameUpdate();
      }
    }
  }

  function next() {
    if (index + 1 >= queue.length) {
      finishTest();
      return;
    }
    setIndex((i) => i + 1);
  }

  function prev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function finishTest() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    setPhase("results");
    const total = queue.length;
    if (total === 0) return;
    let earnedScore = 0;
    for (const q of queue) {
      const a = answers[q.id];
      if (!a) continue;
      if (a.verdict === "correct") earnedScore += 1;
      else if (a.verdict === "partial") earnedScore += 0.5;
    }
    const pct = Math.round((earnedScore / total) * 100);
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    store.addSession({
      id: randomId(),
      date: new Date().toISOString(),
      subject,
      mode: "quiz",
      score: pct,
      duration: durationSec,
    });

    // Big payoff
    if (pct >= 75) {
      rewards.celebrate();
      sound.levelUp();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 40, 20, 40, 60]);
    }
    // Bonus XP based on score
    const bonus = Math.round(pct / 2); // 0–50 XP bonus
    if (bonus > 0) {
      const r = awardXp(bonus, subject);
      bumpStreakIfNeeded();
      rewards.award({ amount: bonus, comboLabel: "TEST BONUS" });
      if (r.leveledUp) rewards.levelUp(r.newLevel);
      notifyGameUpdate();
    }
  }

  const current = queue[index] ?? null;
  const total = queue.length;
  const answeredCount = Object.keys(answers).length;
  const subjectTheme = subject !== SUBJECTS_ALL ? getSubjectTheme(subject) : null;
  const available = allQuestions.filter((q) =>
    (subject === SUBJECTS_ALL || q.subject === subject) &&
    (topicFilter.size === 0 || topicFilter.has(q.noteId))
  ).length;

  function fmtTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // ───── SETUP ─────
  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <header className="anim-fade-up mb-8">
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "var(--muted)" }}>
            Timed test
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Timer size={26} style={{ color: "var(--chemistry)" }} />
            Exam mode
          </h1>
          <p className="mt-3" style={{ color: "var(--text-soft)" }}>
            Mixed question types, against the clock. Find out where you stand.
          </p>
        </header>

        <div className="anim-fade-up delay-1 p-6 sm:p-7 space-y-6"
          style={{ borderRadius: "24px", background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Subject */}
          <div>
            <label className="text-xs uppercase tracking-[0.16em] font-semibold mb-3 block" style={{ color: "var(--muted)" }}>
              Subject
            </label>
            <div className="flex gap-2 flex-wrap">
              {[SUBJECTS_ALL, ...subjects].map((s) => {
                const active = subject === s;
                const t = s !== SUBJECTS_ALL ? getSubjectTheme(s) : null;
                return (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95"
                    style={
                      active
                        ? {
                            background: t ? t.gradient : "linear-gradient(135deg, #fb923c, #ff6b6b)",
                            color: "white",
                            boxShadow: `0 6px 20px ${t ? t.colorSoft : "rgba(251,146,60,0.4)"}`,
                          }
                        : {
                            background: "var(--surface-strong)",
                            color: "var(--muted-soft)",
                            border: "1px solid var(--border)",
                          }
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="text-xs uppercase tracking-[0.16em] font-semibold mb-3 block" style={{ color: "var(--muted)" }}>
              Topics
            </label>
            <TopicPicker
              subject={subject === SUBJECTS_ALL ? undefined : subject}
              selected={topicFilter}
              onChange={setTopicFilter}
            />
          </div>

          {/* Length */}
          <div>
            <label className="text-xs uppercase tracking-[0.16em] font-semibold mb-3 block" style={{ color: "var(--muted)" }}>
              Questions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setLength(n as 10 | 20)}
                  className="py-3 rounded-xl text-base font-bold transition-all active:scale-95"
                  style={length === n
                    ? {
                        background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
                        color: "white",
                        boxShadow: "0 6px 20px rgba(20,184,166,0.4)",
                      }
                    : {
                        background: "var(--surface-strong)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                      }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs uppercase tracking-[0.16em] font-semibold mb-3 block" style={{ color: "var(--muted)" }}>
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((m) => (
                <button
                  key={m}
                  onClick={() => setDurationMin(m as 5 | 10 | 15)}
                  className="py-3 rounded-xl text-base font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                  style={durationMin === m
                    ? {
                        background: "linear-gradient(135deg, #fb923c, #ff6b6b)",
                        color: "white",
                        boxShadow: "0 6px 20px rgba(251,146,60,0.4)",
                      }
                    : {
                        background: "var(--surface-strong)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                      }
                  }
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: subjectTheme?.colorSoft ?? "var(--surface-strong)", color: subjectTheme?.color ?? "var(--brand-2)" }}
            >
              <Target size={18} />
            </div>
            <div>
              <p className="font-semibold">{length} questions · {durationMin} min</p>
              <p className="text-xs" style={{ color: "var(--muted-soft)" }}>
                pool of {available} · ~{Math.round((durationMin * 60) / length)}s per question
              </p>
            </div>
          </div>

          <button
            onClick={startTest}
            disabled={available < length}
            className="w-full py-3.5 rounded-2xl font-bold text-white disabled:opacity-50 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #fb923c 0%, #ff6b6b 100%)",
              boxShadow: "0 10px 30px rgba(251, 146, 60, 0.4)",
            }}
          >
            Start test
          </button>
          {available < length && (
            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              Not enough questions for this combination. Try a different subject or shorter length.
            </p>
          )}
        </div>
        <RewardOverlay />
      </div>
    );
  }

  // ───── RUNNING ─────
  if (phase === "running" && current) {
    const timePct = Math.max(0, Math.round((timeLeftSec / (durationMin * 60)) * 100));
    const timeWarn = timeLeftSec <= 30;
    const isAnswered = answers[current.id] !== undefined;
    const ans = answers[current.id];

    return (
      <div className="max-w-xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full space-y-5">
        {/* Top: timer + question count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--muted-soft)" }}>
            <span style={{ color: "var(--text)" }}>{index + 1}</span>
            <span className="opacity-50"> / {total}</span>
            <span className="ml-3 opacity-60">· {answeredCount} answered</span>
          </span>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold tabular-nums"
            style={{
              background: timeWarn
                ? "linear-gradient(135deg, #ff6b6b, #fb923c)"
                : "var(--surface-strong)",
              color: timeWarn ? "white" : "var(--text)",
              border: timeWarn ? "none" : "1px solid var(--border-strong)",
              boxShadow: timeWarn ? "0 0 20px rgba(255,107,107,0.5)" : "none",
            }}
          >
            <Timer size={14} className={timeWarn ? "anim-flicker" : ""} />
            {fmtTime(timeLeftSec)}
          </div>
        </div>

        {/* Time bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timePct}%`,
              background: timeWarn
                ? "linear-gradient(90deg, #ff6b6b, #fb923c)"
                : "linear-gradient(90deg, #14b8a6, #ff6b6b)",
            }}
          />
        </div>

        {/* Question */}
        <QuestionCard
          key={current.id}
          question={current}
          onAnswer={(r, origin) => handleAnswer(r, origin)}
          locked={isAnswered && ans
            ? { verdict: ans.verdict, feedback: ans.feedback }
            : null}
        />

        {isAnswered && (
          <div
            className="px-3 py-2.5 rounded-xl text-sm flex items-start gap-2"
            style={{
              background: ans.verdict === "correct" ? "rgba(74, 222, 128, 0.10)"
                : ans.verdict === "partial" ? "rgba(251, 191, 36, 0.10)"
                : "rgba(255, 107, 107, 0.10)",
              color: ans.verdict === "correct" ? "var(--success)"
                : ans.verdict === "partial" ? "var(--warning)"
                : "var(--danger)",
            }}
          >
            {ans.verdict === "correct" && <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
            {ans.verdict === "partial" && <AlertCircle size={16} className="mt-0.5 shrink-0" />}
            {ans.verdict === "wrong" && <XCircle size={16} className="mt-0.5 shrink-0" />}
            <span>{ans.feedback}</span>
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-30 transition-all active:scale-95"
            style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <ChevronLeft size={15} /> Prev
          </button>
          {index + 1 < total ? (
            <button
              onClick={next}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
                boxShadow: "0 6px 20px rgba(20,184,166,0.35)",
              }}
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={finishTest}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #fb923c, #ff6b6b)",
                boxShadow: "0 6px 20px rgba(251,146,60,0.4)",
              }}
            >
              <Flag size={15} /> Finish
            </button>
          )}
        </div>

        {/* Question index dots */}
        <div className="flex gap-1.5 justify-center flex-wrap pt-2">
          {queue.map((q, i) => {
            const a = answers[q.id];
            const isCurrent = i === index;
            const color =
              isCurrent ? "var(--brand-2)" :
              !a ? "var(--border-strong)" :
              a.verdict === "correct" ? "var(--success)" :
              a.verdict === "partial" ? "var(--warning)" :
              "var(--danger)";
            return (
              <button
                key={q.id}
                onClick={() => setIndex(i)}
                aria-label={`Jump to question ${i + 1}`}
                className="w-6 h-6 rounded-md text-[10px] font-bold tabular-nums transition-all active:scale-95"
                style={{
                  background: isCurrent ? color : "var(--surface)",
                  color: isCurrent ? "white" : color,
                  border: `1.5px solid ${color}`,
                  boxShadow: isCurrent ? `0 0 12px ${color}` : "none",
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <RewardOverlay />
      </div>
    );
  }

  // ───── RESULTS ─────
  if (phase === "results") {
    let earnedScore = 0;
    const byType: Record<QuestionType, { right: number; total: number }> = {
      "mcq": { right: 0, total: 0 },
      "true-false": { right: 0, total: 0 },
      "fill-blank": { right: 0, total: 0 },
      "short-answer": { right: 0, total: 0 },
    };
    for (const q of queue) {
      byType[q.type].total++;
      const a = answers[q.id];
      if (a?.verdict === "correct") { earnedScore += 1; byType[q.type].right += 1; }
      else if (a?.verdict === "partial") { earnedScore += 0.5; byType[q.type].right += 0.5; }
    }
    const pct = total > 0 ? Math.round((earnedScore / total) * 100) : 0;
    const durSec = Math.round((Date.now() - startedAt) / 1000);
    const grade =
      pct >= 90 ? { label: "Outstanding", gradient: "linear-gradient(135deg, #fbbf24, #fb923c)" } :
      pct >= 75 ? { label: "Great work", gradient: "linear-gradient(135deg, #14b8a6, #38bdf8)" } :
      pct >= 60 ? { label: "Solid effort", gradient: "linear-gradient(135deg, #38bdf8, #14b8a6)" } :
      pct >= 40 ? { label: "Keep going", gradient: "linear-gradient(135deg, #fb923c, #ff6b6b)" } :
                  { label: "Try again", gradient: "linear-gradient(135deg, #ff6b6b, #fb923c)" };
    const C = 2 * Math.PI * 70;
    const offset = C - (pct / 100) * C;

    return (
      <div className="max-w-md mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <div className="anim-fade-up p-8 text-center"
          style={{ borderRadius: "28px", background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="relative w-44 h-44 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                strokeWidth="10" strokeLinecap="round"
                stroke="url(#testGrad)"
                strokeDasharray={C} strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
              <defs>
                <linearGradient id="testGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#ff6b6b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold tabular-nums tracking-tight">{pct}<span className="text-xl opacity-60">%</span></span>
              <span className="text-xs uppercase tracking-[0.18em] mt-1" style={{ color: "var(--muted-soft)" }}>
                Score
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 text-white"
            style={{ background: grade.gradient, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
          >
            <Trophy size={15} /> {grade.label}
          </div>

          <p className="text-lg mt-1">
            <span className="font-bold tabular-nums">{earnedScore.toFixed(earnedScore % 1 === 0 ? 0 : 1)}</span>
            <span style={{ color: "var(--muted-soft)" }}> of {total}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-soft)" }}>
            Time: {fmtTime(durSec)} of {durationMin}:00
          </p>

          {/* Breakdown by type */}
          <div className="mt-6 space-y-1.5 text-left">
            {(Object.keys(byType) as QuestionType[]).map((t) => {
              const { right, total } = byType[t];
              if (total === 0) return null;
              const pcts = Math.round((right / total) * 100);
              const label = t === "mcq" ? "Multiple choice"
                : t === "true-false" ? "True/False"
                : t === "fill-blank" ? "Fill blank"
                : "Short answer";
              return (
                <div key={t} className="flex items-center gap-3 text-sm">
                  <span className="flex-1" style={{ color: "var(--text-soft)" }}>{label}</span>
                  <span className="tabular-nums w-16 text-right" style={{ color: "var(--muted-soft)" }}>
                    {right.toFixed(right % 1 === 0 ? 0 : 1)} / {total}
                  </span>
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-strong)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pcts}%`,
                        background: pcts >= 75 ? "var(--success)" : pcts >= 50 ? "var(--warning)" : "var(--danger)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-7">
            <button
              onClick={() => setPhase("setup")}
              className="flex-1 py-3 rounded-2xl font-semibold transition-all active:scale-95"
              style={{ background: "var(--surface-strong)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
            >
              New test
            </button>
            <button
              onClick={() => { setPhase("setup"); setTimeout(() => startTest(), 0); }}
              className="flex-1 py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #fb923c, #ff6b6b)", boxShadow: "0 10px 30px rgba(251,146,60,0.4)" }}
            >
              <Zap size={14} className="inline mr-1" /> Retake
            </button>
          </div>
        </div>
        <RewardOverlay />
      </div>
    );
  }

  return null;
}

export default function TestPage() {
  return (
    <Suspense fallback={null}>
      <TestInner />
    </Suspense>
  );
}
