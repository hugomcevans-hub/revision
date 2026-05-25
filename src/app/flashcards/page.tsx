"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Sparkles } from "lucide-react";
import { store } from "@/lib/store";
import { Flashcard } from "@/types";
import { getSubjectTheme } from "@/lib/subjects";
import Markdown from "@/components/Markdown";
import { awardXp, bumpStreakIfNeeded } from "@/lib/game";
import { useRewards } from "@/components/Reward";
import { notifyGameUpdate } from "@/components/StatsStrip";
import { sound } from "@/lib/sound";
import TopicPicker from "@/components/TopicPicker";

const SUBJECTS_ALL = "All";

function FlashcardsInner() {
  const params = useSearchParams();
  const initialSubject = params.get("subject") || SUBJECTS_ALL;

  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState(initialSubject);
  const [done, setDone] = useState(false);
  const [rewardedIds, setRewardedIds] = useState<Set<string>>(new Set());
  const [topicFilter, setTopicFilter] = useState<Set<string>>(new Set());
  const { controller: rewards, Overlay: RewardOverlay } = useRewards();

  useEffect(() => {
    const cards = store.getCards();
    setAllCards(cards);
    setSubjects([...new Set(cards.map((c) => c.subject))].sort());
  }, []);

  const buildQueue = useCallback((sub: string, shuffled = false) => {
    let filtered = allCards.filter((c) =>
      (sub === SUBJECTS_ALL || c.subject === sub) &&
      (topicFilter.size === 0 || topicFilter.has(c.noteId))
    );
    if (shuffled) filtered = [...filtered].sort(() => Math.random() - 0.5);
    setQueue(filtered);
    setIndex(0);
    setFlipped(false);
    setDone(filtered.length === 0);
  }, [allCards, topicFilter]);

  useEffect(() => {
    if (allCards.length > 0) buildQueue(subject);
  }, [subject, allCards, buildQueue]);

  // Reset topic filter when subject changes
  useEffect(() => { setTopicFilter(new Set()); }, [subject]);

  const current = queue[index] ?? null;
  const total = queue.length;
  const theme = current ? getSubjectTheme(current.subject) : null;

  const goNext = useCallback(() => {
    if (index + 1 >= total) setDone(true);
    else { setIndex((i) => i + 1); setFlipped(false); }
  }, [index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) { setIndex((i) => i - 1); setFlipped(false); }
  }, [index]);

  const reveal = useCallback((origin?: { x: number; y: number }) => {
    const cur = queue[index] ?? null;
    if (!cur || flipped) { setFlipped((f) => !f); return; }
    setFlipped(true);
    sound.flip();
    if (!rewardedIds.has(cur.id)) {
      const xp = 3;
      const result = awardXp(xp, cur.subject);
      bumpStreakIfNeeded();
      setRewardedIds((s) => { const n = new Set(s); n.add(cur.id); return n; });
      rewards.award({ amount: xp, origin });
      if (result.leveledUp) {
        rewards.levelUp(result.newLevel);
        sound.levelUp();
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 40, 30]);
      }
      notifyGameUpdate();
    }
  }, [queue, index, flipped, rewardedIds, rewards]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); reveal(); }
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, goNext, goPrev, reveal]);

  // Confetti on session complete
  useEffect(() => {
    if (done && total > 0) {
      rewards.celebrate();
      sound.combo();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 40]);
    }
  }, [done, total, rewards]);

  function restart(shuffled = false) {
    buildQueue(subject, shuffled);
    setDone(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full flex flex-col gap-6">
      {/* Header */}
      <header className="anim-fade-up flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "var(--muted)" }}>
            Flashcards
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Brain size={26} style={{ color: "var(--brand-2)" }} />
            Practice
          </h1>
        </div>
        {!done && total > 0 && (
          <div className="tabular-nums text-sm font-semibold" style={{ color: "var(--muted-soft)" }}>
            <span style={{ color: "var(--text)" }}>{index + 1}</span>
            <span className="opacity-50"> / {total}</span>
          </div>
        )}
      </header>

      {/* Subject pills */}
      <div className="anim-fade-up delay-1 flex gap-2 flex-wrap">
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
                      background: t ? t.gradient : "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                      color: "white",
                      boxShadow: `0 6px 20px ${t ? t.colorSoft : "rgba(139,92,246,0.4)"}`,
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

      {/* Topic picker — collapsible */}
      <div className="anim-fade-up delay-2">
        <TopicPicker
          subject={subject === SUBJECTS_ALL ? undefined : subject}
          selected={topicFilter}
          onChange={setTopicFilter}
        />
      </div>

      {/* Progress */}
      {!done && current && (
        <div className="anim-fade-up delay-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(((index + 1) / total) * 100)}%`,
              background: theme?.gradient ?? "linear-gradient(90deg, #8b5cf6, #a78bfa)",
              boxShadow: `0 0 16px ${theme?.colorSoft ?? "rgba(139,92,246,0.4)"}`,
            }}
          />
        </div>
      )}

      {/* Card */}
      {done ? (
        <div
          className="anim-fade-up glass-strong p-10 text-center flex flex-col items-center gap-5"
          style={{ borderRadius: "28px" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center halo"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              ["--halo-color" as string]: "var(--brand-glow)",
            }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All done!</h2>
            <p className="mt-1.5" style={{ color: "var(--muted-soft)" }}>
              You went through all {total} cards.
            </p>
          </div>
          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={() => restart(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
              }}
            >
              <RotateCcw size={16} /> Restart
            </button>
            <button
              onClick={() => restart(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all active:scale-95"
              style={{
                background: "var(--surface-strong)",
                color: "var(--text)",
                border: "1px solid var(--border-strong)",
              }}
            >
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </div>
      ) : current && theme ? (
        <>
          <div
            className="flip-container anim-fade-up delay-3"
            style={{ minHeight: "340px" }}
          >
            <div
              className={`flip-inner ${flipped ? "flipped" : ""}`}
              style={{ minHeight: "340px" }}
              onClick={(e) => {
                const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                reveal({ x: r.left + r.width / 2, y: r.top + 30 });
              }}
              role="button"
              aria-pressed={flipped}
              aria-label={flipped ? "Showing answer, tap to see question" : "Showing question, tap to reveal answer"}
              tabIndex={0}
            >
              {/* Front (question) */}
              <div
                className="flip-face p-7 sm:p-9 flex flex-col cursor-pointer select-none transition-transform active:scale-[0.99]"
                style={{
                  borderRadius: "28px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] font-medium mb-6">
                  <span className="flex items-center gap-1.5" style={{ color: theme.color }}>
                    <theme.icon size={13} /> {current.subject}
                  </span>
                  <span style={{ color: "var(--muted)" }}>Question</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-xl sm:text-2xl font-semibold leading-snug" style={{ color: "var(--text)" }}>
                    <Markdown source={current.front} />
                  </div>
                </div>
                <p className="text-center text-xs mt-6 flex items-center justify-center gap-1.5" style={{ color: "var(--muted)" }}>
                  Tap card · or press <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>Space</kbd>
                </p>
              </div>

              {/* Back (answer) */}
              <div
                className="flip-face flip-back p-7 sm:p-9 flex flex-col cursor-pointer select-none transition-transform active:scale-[0.99]"
                style={{
                  borderRadius: "28px",
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-strong)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] font-medium mb-6">
                  <span className="flex items-center gap-1.5" style={{ color: theme.color }}>
                    <theme.icon size={13} /> {current.subject}
                  </span>
                  <span style={{ color: theme.color }}>Answer</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                  <div className="text-base sm:text-lg leading-relaxed text-center" style={{ color: "var(--text-soft)" }}>
                    <Markdown source={current.back} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="anim-fade-up delay-4 flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={index === 0}
              aria-label="Previous card"
              className="w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {!flipped ? (
              <button
                onClick={(e) => {
                  const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  reveal({ x: r.left + r.width / 2, y: r.top + 8 });
                }}
                className="flex-1 h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 text-white"
                style={{
                  background: theme.gradient,
                  boxShadow: `0 10px 30px ${theme.colorSoft}`,
                }}
              >
                Reveal answer <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex-1 h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 text-white"
                style={{
                  background: theme.gradient,
                  boxShadow: `0 10px 30px ${theme.colorSoft}`,
                }}
              >
                {index + 1 === total ? "Finish" : "Next card"} <ChevronRight size={16} />
              </button>
            )}

            <button
              onClick={goNext}
              aria-label="Next card"
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Shuffle */}
          <button
            onClick={() => restart(true)}
            className="mx-auto text-xs font-medium flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--muted-soft)" }}
          >
            <Shuffle size={12} /> Shuffle and restart
          </button>
        </>
      ) : null}
      <RewardOverlay />
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={null}>
      <FlashcardsInner />
    </Suspense>
  );
}
