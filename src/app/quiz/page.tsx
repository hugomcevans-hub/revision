"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HelpCircle, RotateCcw, Trophy, Target, Zap, Filter } from "lucide-react";
import { store } from "@/lib/store";
import { QuizQuestion, QuestionType } from "@/types";
import { randomId, shuffleMcqOptions } from "@/lib/utils";
import { getSubjectTheme } from "@/lib/subjects";
import { awardXp, recordAnswer, recordBestCombo, bumpStreakIfNeeded, comboMultiplier, comboLabel } from "@/lib/game";
import { useRewards } from "@/components/Reward";
import { notifyGameUpdate } from "@/components/StatsStrip";
import { sound } from "@/lib/sound";
import QuestionCard, { AnswerResult, AnswerVerdict } from "@/components/QuestionCard";
import TopicPicker from "@/components/TopicPicker";
import { recordVerdict } from "@/lib/weakSpots";

const SUBJECTS_ALL = "All";
type Phase = "setup" | "question" | "answered" | "results";

const TYPE_LABELS: Record<QuestionType, string> = {
  "mcq": "Multiple choice",
  "true-false": "True/False",
  "fill-blank": "Fill blank",
  "short-answer": "Short answer",
};

function QuizInner() {
  const params = useSearchParams();
  const initialSubject = params.get("subject") || SUBJECTS_ALL;

  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState(initialSubject);
  const [typeFilter, setTypeFilter] = useState<Set<QuestionType>>(
    new Set<QuestionType>(["mcq", "true-false", "fill-blank", "short-answer"]),
  );
  const [topicFilter, setTopicFilter] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState<QuizQuestion | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [score, setScore] = useState(0);            // weighted: correct=1, partial=0.5
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionStart, setSessionStart] = useState(Date.now());
  const [sessionXp, setSessionXp] = useState(0);
  const [lastVerdict, setLastVerdict] = useState<AnswerVerdict | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const { controller: rewards, Overlay: RewardOverlay } = useRewards();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAdvanceTimer() {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null; }
  }

  useEffect(() => {
    const qs = store.getQuiz();
    setAllQuestions(qs);
    setSubjects([...new Set(qs.map((q) => q.subject))].sort());
  }, []);

  // Auto-start if arriving via subject deep link
  useEffect(() => {
    if (phase !== "setup") return;
    if (initialSubject === SUBJECTS_ALL) return;
    if (allQuestions.length === 0) return;
    startQuiz(initialSubject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions]);

  // Cleanup
  useEffect(() => () => clearAdvanceTimer(), []);

  // Celebrate on great result
  useEffect(() => {
    if (phase === "results" && answered > 0) {
      const finalPct = Math.round((score / answered) * 100);
      if (finalPct >= 75) {
        rewards.celebrate();
        sound.levelUp();
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 40]);
      }
    }
  }, [phase, answered, score, rewards]);

  function availableQuestions(sub = subject, types = typeFilter, topics = topicFilter): QuizQuestion[] {
    return allQuestions.filter((q) =>
      (sub === SUBJECTS_ALL || q.subject === sub) &&
      types.has(q.type) &&
      (topics.size === 0 || topics.has(q.noteId))
    );
  }

  // Reset topic filter when subject changes
  useEffect(() => {
    setTopicFilter(new Set());
  }, [subject]);

  function startQuiz(sub = subject) {
    const filtered = availableQuestions(sub)
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
      .map(shuffleMcqOptions);
    setQueue(filtered);
    setCurrent(filtered[0] ?? null);
    setScore(0);
    setAnswered(0);
    setStreak(0);
    setBestStreak(0);
    setSessionXp(0);
    setSessionStart(Date.now());
    setLastVerdict(null);
    setFeedbackText("");
    setPhase(filtered.length > 0 ? "question" : "setup");
  }

  function handleAnswer(result: AnswerResult, origin?: { x: number; y: number }) {
    if (!current || phase !== "question") return;
    const verdict = result.verdict;
    const correct = verdict === "correct";
    const partial = verdict === "partial";
    recordAnswer(correct);
    recordVerdict(current.noteId, verdict);

    setLastVerdict(verdict);
    setFeedbackText(result.feedback);

    if (correct || partial) {
      const nextStreak = correct ? streak + 1 : streak; // partial doesn't break or grow combo
      const mult = correct ? comboMultiplier(nextStreak) : 1;
      const base = correct ? 10 : 5;
      const xp = base * mult;
      const label = correct ? comboLabel(nextStreak) : null;

      const r = awardXp(xp, current.subject);
      bumpStreakIfNeeded();
      if (correct) {
        recordBestCombo(Math.max(bestStreak, nextStreak));
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
      }
      setSessionXp((s) => s + xp);
      setScore((s) => s + (correct ? 1 : 0.5));
      rewards.award({ amount: xp, combo: nextStreak, multiplier: mult, comboLabel: label, origin });

      if (correct && (nextStreak === 3 || nextStreak === 5 || nextStreak === 10)) {
        rewards.celebrate();
        sound.combo();
      } else if (correct) {
        sound.correct();
      } else {
        sound.correct(); // partial — gentle positive
      }
      if (r.leveledUp) {
        rewards.levelUp(r.newLevel);
        sound.levelUp();
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 40, 30]);
      } else if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(correct ? 8 : 4);
      }
    } else {
      setStreak(0);
      sound.wrong();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([14, 24, 14]);
    }
    notifyGameUpdate();
    setAnswered((a) => a + 1);
    setPhase("answered");

    clearAdvanceTimer();
    const delay = correct ? 3000 : partial ? 4000 : 5000;
    advanceTimer.current = setTimeout(() => next(), delay);
  }

  function next() {
    clearAdvanceTimer();
    const newQueue = queue.slice(1);
    if (newQueue.length === 0) {
      store.addSession({
        id: randomId(),
        date: new Date().toISOString(),
        subject,
        mode: "quiz",
        score: Math.round((score / answered) * 100),
        duration: Math.round((Date.now() - sessionStart) / 1000),
      });
      setPhase("results");
      return;
    }
    setQueue(newQueue);
    setCurrent(newQueue[0]);
    setLastVerdict(null);
    setFeedbackText("");
    setPhase("question");
  }

  function toggleType(t: QuestionType) {
    const next = new Set(typeFilter);
    if (next.has(t)) {
      if (next.size > 1) next.delete(t);
    } else {
      next.add(t);
    }
    setTypeFilter(next);
  }

  const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;
  const subjectTheme = subject !== SUBJECTS_ALL ? getSubjectTheme(subject) : null;
  const themeForCurrent = current ? getSubjectTheme(current.subject) : null;
  const available = availableQuestions().length;

  // ───── SETUP ─────
  if (phase === "setup") {
    return (
      <div className="max-w-xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <header className="anim-fade-up mb-8">
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "var(--muted)" }}>
            Quiz mode
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <HelpCircle size={26} style={{ color: "var(--physics)" }} />
            Test yourself
          </h1>
          <p className="mt-3" style={{ color: "var(--text-soft)" }}>
            Mixed question types from your notes. Up to 20 per round.
          </p>
        </header>

        <div className="anim-fade-up delay-1 p-6 sm:p-7 space-y-6"
          style={{ borderRadius: "24px", background: "var(--surface)", border: "1px solid var(--border)" }}
        >
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
                            background: t ? t.gradient : "linear-gradient(135deg, #14b8a6, #38bdf8)",
                            color: "white",
                            boxShadow: `0 6px 20px ${t ? t.colorSoft : "rgba(20, 184, 166, 0.4)"}`,
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

          <div>
            <label className="text-xs uppercase tracking-[0.16em] font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
              <Filter size={12} /> Question types
            </label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => {
                const active = typeFilter.has(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                    style={
                      active
                        ? {
                            background: "linear-gradient(135deg, #14b8a6, #ff6b6b)",
                            color: "white",
                            boxShadow: "0 4px 14px rgba(20, 184, 166, 0.3)",
                          }
                        : {
                            background: "var(--surface-strong)",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                          }
                    }
                  >
                    {TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </div>

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

          <div className="flex items-center gap-3 text-sm">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: subjectTheme?.colorSoft ?? "var(--surface-strong)", color: subjectTheme?.color ?? "var(--brand-2)" }}
            >
              <Target size={18} />
            </div>
            <div>
              <p className="font-semibold">{Math.min(20, available)} questions</p>
              <p className="text-xs" style={{ color: "var(--muted-soft)" }}>
                from a pool of {available}
              </p>
            </div>
          </div>

          <button
            onClick={() => startQuiz()}
            disabled={available === 0}
            className="w-full py-3.5 rounded-2xl font-bold text-white disabled:opacity-50 transition-all active:scale-95"
            style={{
              background: subjectTheme?.gradient ?? "linear-gradient(135deg, #14b8a6 0%, #38bdf8 100%)",
              boxShadow: `0 10px 30px ${subjectTheme?.colorSoft ?? "rgba(20, 184, 166, 0.4)"}`,
            }}
          >
            Start quiz
          </button>
        </div>
        <RewardOverlay />
      </div>
    );
  }

  // ───── RESULTS ─────
  if (phase === "results") {
    const grade =
      pct >= 90 ? { label: "Outstanding", icon: Trophy, gradient: "linear-gradient(135deg, #fbbf24, #fb923c)" } :
      pct >= 75 ? { label: "Great work", icon: Trophy, gradient: "linear-gradient(135deg, #14b8a6, #38bdf8)" } :
      pct >= 60 ? { label: "Solid effort", icon: Target, gradient: "linear-gradient(135deg, #38bdf8, #14b8a6)" } :
      pct >= 40 ? { label: "Keep going", icon: Target, gradient: "linear-gradient(135deg, #fb923c, #ff6b6b)" } :
                  { label: "Try again", icon: Zap, gradient: "linear-gradient(135deg, #ff6b6b, #fb923c)" };
    const GradeIcon = grade.icon;
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="max-w-md mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <div className="anim-fade-up p-8 text-center" style={{ borderRadius: "28px", background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="relative w-44 h-44 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                strokeWidth="10" strokeLinecap="round"
                stroke="url(#resultsGradient)"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
              <defs>
                <linearGradient id="resultsGradient" x1="0" y1="0" x2="1" y2="1">
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

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-2 text-white"
            style={{ background: grade.gradient, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
          >
            <GradeIcon size={15} /> {grade.label}
          </div>

          <p className="text-lg mt-2">
            <span className="font-bold tabular-nums">{score.toFixed(score % 1 === 0 ? 0 : 1)}</span>
            <span style={{ color: "var(--muted-soft)" }}> of {answered}</span>
          </p>
          {sessionXp > 0 && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-extrabold tabular-nums text-white"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #ff6b6b)",
                boxShadow: "0 6px 20px rgba(20, 184, 166, 0.4)",
              }}
            >
              <Zap size={14} fill="#fff7d6" /> +{sessionXp} XP
            </div>
          )}
          {bestStreak >= 3 && (
            <p className="text-sm mt-2 flex items-center justify-center gap-1.5" style={{ color: "var(--warning)" }}>
              <Zap size={14} /> Best streak: <span className="font-semibold tabular-nums">{bestStreak}</span>
            </p>
          )}

          <div className="flex gap-2 mt-7">
            <button
              onClick={() => setPhase("setup")}
              className="flex-1 py-3 rounded-2xl font-semibold transition-all active:scale-95"
              style={{ background: "var(--surface-strong)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
            >
              Change subject
            </button>
            <button
              onClick={() => startQuiz()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #14b8a6, #38bdf8)", boxShadow: "0 10px 30px rgba(20, 184, 166, 0.4)" }}
            >
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        </div>
        <RewardOverlay />
      </div>
    );
  }

  // ───── ACTIVE QUESTION ─────
  return (
    <div className="max-w-xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--muted-soft)" }}>
            <span style={{ color: "var(--text)" }}>{answered + 1}</span>
            <span className="opacity-50"> / {answered + queue.length}</span>
          </span>
          {streak >= 2 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold anim-fade-in"
              style={{
                background: "linear-gradient(135deg, #fb923c, #ff6b6b)",
                color: "white",
                boxShadow: "0 4px 16px rgba(255, 107, 107, 0.4)",
              }}
            >
              <Zap size={12} fill="currentColor" /> {streak} streak
            </span>
          )}
        </div>
        <div className="text-sm tabular-nums" style={{ color: "var(--muted-soft)" }}>
          <span style={{ color: "var(--success)" }}>{score.toFixed(score % 1 === 0 ? 0 : 1)}</span>
          <span className="opacity-50"> correct</span>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.round((answered / (answered + queue.length)) * 100)}%`,
            background: themeForCurrent?.gradient ?? "linear-gradient(90deg, #14b8a6, #38bdf8)",
            boxShadow: `0 0 16px ${themeForCurrent?.colorSoft ?? "rgba(20,184,166,0.4)"}`,
          }}
        />
      </div>

      {current && (
        <QuestionCard
          key={current.id}
          question={current}
          onAnswer={(r, origin) => handleAnswer(r, origin)}
          locked={phase === "answered" && lastVerdict
            ? { verdict: lastVerdict, feedback: feedbackText }
            : null}
        />
      )}

      {phase === "answered" && (
        <div className="anim-fade-up space-y-3">
          {feedbackText && (
            <p className="text-sm leading-relaxed text-center" style={{ color: "var(--muted-soft)" }}>
              {feedbackText}
            </p>
          )}
          <button
            onClick={next}
            className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: "var(--surface-strong)",
              color: "var(--muted-soft)",
              border: "1px solid var(--border)",
            }}
          >
            Skip wait →
          </button>
        </div>
      )}

      <RewardOverlay />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizInner />
    </Suspense>
  );
}
