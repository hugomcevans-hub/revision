"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  GraduationCap, BookOpen, ChevronRight, ChevronLeft, RotateCcw,
  CheckCircle2, AlertCircle, XCircle, ArrowRight, Sparkles, ListChecks,
} from "lucide-react";
import { store } from "@/lib/store";
import { Note, QuizQuestion } from "@/types";
import { getSubjectTheme } from "@/lib/subjects";
import { listTopics, getNoteById, getNoteIdToSubject } from "@/lib/topics";
import { recordVerdict, getWeakSpots } from "@/lib/weakSpots";
import { awardXp, bumpStreakIfNeeded } from "@/lib/game";
import { useRewards } from "@/components/Reward";
import { notifyGameUpdate } from "@/components/StatsStrip";
import { sound } from "@/lib/sound";
import { shuffleMcqOptions } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import QuestionCard, { AnswerResult, AnswerVerdict } from "@/components/QuestionCard";

const SUBJECTS_ALL = "All";
type Phase = "pick" | "read" | "practice" | "review" | "done";

function LearnInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initialNoteId = params.get("noteId") || "";

  const [subject, setSubject] = useState<string>(SUBJECTS_ALL);
  const [noteId, setNoteId] = useState<string>(initialNoteId);
  const [phase, setPhase] = useState<Phase>(initialNoteId ? "read" : "pick");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [verdicts, setVerdicts] = useState<Record<string, AnswerVerdict>>({});
  const [feedbackText, setFeedbackText] = useState<string>("");
  const { controller: rewards, Overlay: RewardOverlay } = useRewards();

  const note: Note | undefined = useMemo(() => (noteId ? getNoteById(noteId) : undefined), [noteId]);
  const theme = note ? getSubjectTheme(note.subject) : null;
  const topics = useMemo(() => listTopics(subject === SUBJECTS_ALL ? undefined : subject), [subject]);
  const subjects = useMemo(() => {
    const set = new Set(store.getNotes().map((n) => n.subject));
    return [...set].sort();
  }, []);

  // Build a small mixed-type question set for this note
  useEffect(() => {
    if (!noteId) return;
    const pool = store.getQuiz().filter((q) => q.noteId === noteId);
    // Prefer one of each type if possible, then fill to 5
    const byType: Record<string, QuizQuestion[]> = {};
    for (const q of pool) (byType[q.type] = byType[q.type] || []).push(q);
    const picked: QuizQuestion[] = [];
    for (const t of Object.keys(byType)) {
      const arr = byType[t].sort(() => Math.random() - 0.5);
      if (arr.length) picked.push(arr.shift()!);
    }
    const remainder = pool.filter((q) => !picked.includes(q)).sort(() => Math.random() - 0.5);
    while (picked.length < 5 && remainder.length) picked.push(remainder.shift()!);
    setQuestions(picked.map(shuffleMcqOptions));
    setIndex(0);
    setVerdicts({});
    setFeedbackText("");
  }, [noteId]);

  // Weak spots — derived
  const noteIdToSubject = useMemo(() => getNoteIdToSubject(), []);
  const weakSpots = useMemo(() =>
    getWeakSpots(noteIdToSubject, { subject: subject === SUBJECTS_ALL ? undefined : subject, limit: 5 }),
    [noteIdToSubject, subject],
  );

  function handleAnswer(result: AnswerResult, origin?: { x: number; y: number }) {
    const q = questions[index];
    if (!q) return;
    recordVerdict(q.noteId, result.verdict);
    setVerdicts((prev) => ({ ...prev, [q.id]: result.verdict }));
    setFeedbackText(result.feedback);

    if (result.verdict === "correct") {
      const xp = 8;
      const r = awardXp(xp, q.subject);
      bumpStreakIfNeeded();
      rewards.award({ amount: xp, origin });
      if (r.leveledUp) {
        rewards.levelUp(r.newLevel);
        sound.levelUp();
      } else {
        sound.correct();
      }
    } else if (result.verdict === "partial") {
      const xp = 4;
      awardXp(xp, q.subject);
      bumpStreakIfNeeded();
      rewards.award({ amount: xp, origin });
      sound.correct();
    } else {
      sound.wrong();
    }
    notifyGameUpdate();
  }

  function advance() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setFeedbackText("");
    } else {
      const anyMisses = Object.values(verdicts).some((v) => v !== "correct");
      setPhase(anyMisses ? "review" : "done");
    }
  }

  function restart() {
    setIndex(0);
    setVerdicts({});
    setFeedbackText("");
    setPhase("read");
  }

  // ───── PICK ─────
  if (phase === "pick") {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <header className="anim-fade-up mb-7">
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "var(--muted)" }}>
            Learn mode
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap size={26} style={{ color: "var(--biology)" }} />
            Close knowledge gaps
          </h1>
          <p className="mt-3" style={{ color: "var(--text-soft)" }}>
            Pick a topic to study. Read the note, then practise on it.
          </p>
        </header>

        {/* Weak spots quick row */}
        {weakSpots.length > 0 && (
          <section className="anim-fade-up delay-1 mb-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3 px-1 flex items-center gap-1.5"
              style={{ color: "var(--warning)" }}
            >
              <AlertCircle size={11} /> Needs work
            </h2>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {weakSpots.map((s, i) => {
                const n = getNoteById(s.noteId);
                if (!n) return null;
                const t = getSubjectTheme(n.subject);
                return (
                  <button
                    key={s.noteId}
                    onClick={() => { setNoteId(s.noteId); setPhase("read"); }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: t.colorSoft, color: t.color }}
                    >
                      <t.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] truncate">{n.title}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {n.subject} · {s.wrong} wrong / {s.attempts} attempts
                      </p>
                    </div>
                    <ChevronRight size={15} style={{ color: "var(--muted)", opacity: 0.5 }} />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Subject filter */}
        <div className="anim-fade-up delay-2 mb-4 flex gap-2 flex-wrap">
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
                        background: "var(--surface)",
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

        {/* Topics list */}
        <section className="anim-fade-up delay-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3 px-1 flex items-center gap-1.5"
            style={{ color: "var(--muted)" }}
          >
            <ListChecks size={11} /> All topics
          </h2>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {topics.map((topic, i) => {
              const t = getSubjectTheme(topic.subject);
              return (
                <button
                  key={topic.noteId}
                  onClick={() => { setNoteId(topic.noteId); setPhase("read"); }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                >
                  <span className="w-1 h-5 rounded-full shrink-0" style={{ background: t.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[14px] truncate">{topic.title}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{topic.subject}</p>
                  </div>
                  <ChevronRight size={15} style={{ color: "var(--muted)", opacity: 0.5 }} />
                </button>
              );
            })}
            {topics.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: "var(--muted-soft)" }}>
                No topics for this subject yet.
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // ───── READ ─────
  if (phase === "read" && note && theme) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <button
          onClick={() => { setNoteId(""); setPhase("pick"); router.replace("/learn"); }}
          className="text-xs mb-4 flex items-center gap-1 transition-colors hover:opacity-80"
          style={{ color: "var(--muted-soft)" }}
        >
          <ChevronLeft size={13} /> All topics
        </button>

        <header className="anim-fade-up mb-6">
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2 flex items-center gap-1.5"
            style={{ color: theme.color }}
          >
            <BookOpen size={11} /> {note.subject} · Read
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{note.title}</h1>
        </header>

        <article
          className="anim-fade-up delay-1 rounded-2xl p-5 sm:p-6 max-h-[60vh] overflow-y-auto"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-soft)" }}
        >
          <Markdown source={note.content} />
        </article>

        <div className="anim-fade-up delay-2 mt-6 flex items-center gap-3">
          <p className="flex-1 text-sm" style={{ color: "var(--muted-soft)" }}>
            Ready to check what stuck?
          </p>
          <button
            onClick={() => setPhase("practice")}
            disabled={questions.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white disabled:opacity-50 transition-all active:scale-95"
            style={{
              background: theme.gradient,
              boxShadow: `0 6px 20px ${theme.colorSoft}`,
            }}
          >
            Quick check <ArrowRight size={14} />
          </button>
        </div>
        {questions.length === 0 && (
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            No questions for this topic yet — read and move on.
          </p>
        )}
        <RewardOverlay />
      </div>
    );
  }

  // ───── PRACTICE ─────
  if (phase === "practice" && note && theme) {
    const q = questions[index];
    const v = q ? verdicts[q.id] : undefined;

    return (
      <div className="max-w-xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full space-y-5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <span style={{ color: theme.color }}>Quick check</span>
            <span>·</span>
            <span className="tabular-nums">
              <span style={{ color: "var(--text)" }}>{index + 1}</span>
              <span> / {questions.length}</span>
            </span>
          </div>
          <button
            onClick={() => setPhase("read")}
            className="text-xs flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: "var(--muted-soft)" }}
          >
            <BookOpen size={12} /> Back to note
          </button>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(((index + (v ? 1 : 0)) / questions.length) * 100)}%`,
              background: theme.gradient,
            }}
          />
        </div>

        {q && (
          <QuestionCard
            key={q.id}
            question={q}
            onAnswer={(r, o) => handleAnswer(r, o)}
            locked={v ? { verdict: v, feedback: feedbackText } : null}
          />
        )}

        {v && (
          <div className="anim-fade-up space-y-3">
            {feedbackText && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-soft)" }}>
                {feedbackText}
              </p>
            )}
            <button
              onClick={advance}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
              style={{ background: theme.gradient, boxShadow: `0 6px 20px ${theme.colorSoft}` }}
            >
              {index + 1 < questions.length ? "Next →" : "See review"}
            </button>
          </div>
        )}

        <RewardOverlay />
      </div>
    );
  }

  // ───── REVIEW (any wrong) ─────
  if (phase === "review" && note && theme) {
    const misses = questions.filter((q) => verdicts[q.id] && verdicts[q.id] !== "correct");
    return (
      <div className="max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full space-y-5">
        <header className="anim-fade-up">
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2 flex items-center gap-1.5"
            style={{ color: "var(--warning)" }}
          >
            <AlertCircle size={11} /> Review · {note.subject}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Let&apos;s revisit these</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>
            You got <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>{misses.length}</span> question{misses.length === 1 ? "" : "s"} wrong or partial. Read again, then try once more.
          </p>
        </header>

        <article
          className="anim-fade-up delay-1 rounded-2xl p-5 max-h-[40vh] overflow-y-auto"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-soft)" }}
        >
          <Markdown source={note.content} />
        </article>

        <div className="anim-fade-up delay-2 space-y-2">
          {misses.map((q) => {
            const v = verdicts[q.id];
            return (
              <div
                key={q.id}
                className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
                style={{
                  background: v === "partial" ? "rgba(251, 191, 36, 0.06)" : "rgba(255, 107, 107, 0.06)",
                  border: `1px solid ${v === "partial" ? "rgba(251, 191, 36, 0.2)" : "rgba(255, 107, 107, 0.2)"}`,
                }}
              >
                {v === "partial" ? (
                  <AlertCircle size={14} style={{ color: "var(--warning)" }} className="mt-0.5 shrink-0" />
                ) : (
                  <XCircle size={14} style={{ color: "var(--danger)" }} className="mt-0.5 shrink-0" />
                )}
                <span style={{ color: "var(--text-soft)" }}>
                  {q.type === "true-false" ? q.statement
                    : q.type === "fill-blank" ? q.sentence
                    : q.question}
                </span>
              </div>
            );
          })}
        </div>

        <div className="anim-fade-up delay-3 flex gap-3 pt-2">
          <button
            onClick={restart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all active:scale-95"
            style={{ background: "var(--surface-strong)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
          >
            <RotateCcw size={14} /> Retry quick check
          </button>
          <button
            onClick={() => setPhase("done")}
            className="flex-1 py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
            style={{ background: theme.gradient, boxShadow: `0 6px 20px ${theme.colorSoft}` }}
          >
            I&apos;m done
          </button>
        </div>

        <RewardOverlay />
      </div>
    );
  }

  // ───── DONE ─────
  if (phase === "done" && note && theme) {
    const correct = Object.values(verdicts).filter((v) => v === "correct").length;
    return (
      <div className="max-w-md mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
        <div
          className="anim-fade-up p-8 text-center flex flex-col items-center gap-4"
          style={{ borderRadius: "28px", background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center halo"
            style={{ background: theme.gradient, ["--halo-color" as string]: theme.colorSoft }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Topic complete</h2>
            <p className="mt-1.5 text-sm" style={{ color: "var(--muted-soft)" }}>
              {correct} of {questions.length} correct on <strong>{note.title}</strong>.
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => { setNoteId(""); setPhase("pick"); router.replace("/learn"); }}
              className="flex-1 py-3 rounded-2xl font-semibold transition-all active:scale-95"
              style={{ background: "var(--surface-strong)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
            >
              More topics
            </button>
            <button
              onClick={restart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{ background: theme.gradient, boxShadow: `0 6px 20px ${theme.colorSoft}` }}
            >
              <CheckCircle2 size={16} /> Again
            </button>
          </div>
        </div>
        <RewardOverlay />
      </div>
    );
  }

  return null;
}

export default function LearnPage() {
  return (
    <Suspense fallback={null}>
      <LearnInner />
    </Suspense>
  );
}
