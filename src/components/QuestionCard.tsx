"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { CheckCircle2, XCircle, AlertCircle, CornerDownLeft } from "lucide-react";
import { QuizQuestion } from "@/types";
import { getSubjectTheme } from "@/lib/subjects";
import { matchesAny, scoreShortAnswer, ShortAnswerResult } from "@/lib/fuzzy";
import { cn } from "@/lib/utils";

export type AnswerVerdict = "correct" | "partial" | "wrong";

export interface AnswerResult {
  verdict: AnswerVerdict;
  feedback: string;
  raw?: unknown;
}

interface Props {
  question: QuizQuestion;
  onAnswer: (result: AnswerResult, ev?: { x: number; y: number }) => void;
  /** If non-null, externally locked into answered state. */
  locked?: { verdict: AnswerVerdict; feedback: string } | null;
}

export default function QuestionCard({ question, onAnswer, locked }: Props) {
  const theme = getSubjectTheme(question.subject);

  // Subject header
  const header = (
    <div
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold mb-4"
      style={{ color: theme.color }}
    >
      <theme.icon size={12} /> {question.subject}
      <span
        className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider"
        style={{ background: theme.colorSoft, color: theme.color }}
      >
        {labelFor(question.type)}
      </span>
    </div>
  );

  if (question.type === "mcq") {
    return <MCQBody q={question} onAnswer={onAnswer} locked={locked} header={header} />;
  }
  if (question.type === "true-false") {
    return <TrueFalseBody q={question} onAnswer={onAnswer} locked={locked} header={header} />;
  }
  if (question.type === "fill-blank") {
    return <FillBlankBody q={question} onAnswer={onAnswer} locked={locked} header={header} />;
  }
  return <ShortAnswerBody q={question} onAnswer={onAnswer} locked={locked} header={header} />;
}

function labelFor(t: QuizQuestion["type"]): string {
  switch (t) {
    case "mcq": return "Multiple choice";
    case "true-false": return "True or false";
    case "fill-blank": return "Fill the blank";
    case "short-answer": return "Short answer";
  }
}

// ─── Shared wrapper ─────────────────────────────────────────────────────
function Wrapper({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="anim-fade-up p-6 sm:p-7"
      style={{ borderRadius: "24px", background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {header}
      {children}
    </div>
  );
}

// ─── MCQ ─────────────────────────────────────────────────────────────────
function MCQBody({ q, onAnswer, locked, header }: {
  q: Extract<QuizQuestion, { type: "mcq" }>;
  onAnswer: Props["onAnswer"];
  locked: Props["locked"];
  header: React.ReactNode;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = locked !== null && locked !== undefined;

  function pick(i: number, ev: React.MouseEvent<HTMLButtonElement>) {
    if (isAnswered) return;
    setSelected(i);
    const r = ev.currentTarget.getBoundingClientRect();
    const correct = i === q.correctIndex;
    onAnswer(
      {
        verdict: correct ? "correct" : "wrong",
        feedback: q.explanation,
      },
      { x: r.left + r.width / 2, y: r.top + 8 },
    );
  }

  return (
    <Wrapper header={header}>
      <p className="text-lg sm:text-xl font-semibold leading-snug mb-5" style={{ color: "var(--text)" }}>
        {q.question}
      </p>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isSelected = i === selected;
          const showCorrect = isAnswered && isCorrect;
          const showWrong = isAnswered && isSelected && !isCorrect;

          const bg = showCorrect ? "rgba(74, 222, 128, 0.12)" : showWrong ? "rgba(255, 107, 107, 0.12)" : "var(--surface)";
          const border = showCorrect ? "var(--success)" : showWrong ? "var(--danger)" : "var(--border)";
          const color = showCorrect ? "var(--success)" : showWrong ? "var(--danger)" : "var(--text)";

          return (
            <button
              key={i}
              onClick={(e) => pick(i, e)}
              disabled={isAnswered}
              className={cn(
                "w-full text-left p-3.5 rounded-2xl transition-all flex items-center gap-3 active:scale-[0.99]",
                showCorrect && "anim-correct",
                showWrong && "anim-shake",
              )}
              style={{ background: bg, border: `1.5px solid ${border}`, color }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: showCorrect ? "var(--success)" : showWrong ? "var(--danger)" : "var(--surface-elevated)",
                  color: showCorrect || showWrong ? "white" : "var(--text-soft)",
                  border: showCorrect || showWrong ? "none" : "1px solid var(--border)",
                }}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              <span className="flex-1 font-medium text-sm sm:text-base">{opt}</span>
              {showCorrect && <CheckCircle2 size={18} fill="currentColor" />}
              {showWrong && <XCircle size={18} fill="currentColor" />}
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}

// ─── True/False ──────────────────────────────────────────────────────────
function TrueFalseBody({ q, onAnswer, locked, header }: {
  q: Extract<QuizQuestion, { type: "true-false" }>;
  onAnswer: Props["onAnswer"];
  locked: Props["locked"];
  header: React.ReactNode;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const isAnswered = locked !== null && locked !== undefined;

  function pick(v: boolean, ev: React.MouseEvent<HTMLButtonElement>) {
    if (isAnswered) return;
    setSelected(v);
    const r = ev.currentTarget.getBoundingClientRect();
    const correct = v === q.isTrue;
    onAnswer(
      { verdict: correct ? "correct" : "wrong", feedback: q.explanation },
      { x: r.left + r.width / 2, y: r.top + 8 },
    );
  }

  function btnStyle(v: boolean): React.CSSProperties {
    const isCorrect = isAnswered && v === q.isTrue;
    const isWrong = isAnswered && v === selected && v !== q.isTrue;
    if (isCorrect) return {
      background: "rgba(74, 222, 128, 0.14)",
      border: "1.5px solid var(--success)",
      color: "var(--success)",
    };
    if (isWrong) return {
      background: "rgba(255, 107, 107, 0.14)",
      border: "1.5px solid var(--danger)",
      color: "var(--danger)",
    };
    return {
      background: v ? "rgba(20, 184, 166, 0.08)" : "rgba(255, 107, 107, 0.08)",
      border: `1.5px solid ${v ? "rgba(20, 184, 166, 0.3)" : "rgba(255, 107, 107, 0.3)"}`,
      color: "var(--text)",
    };
  }

  return (
    <Wrapper header={header}>
      <p className="text-lg sm:text-xl font-semibold leading-snug mb-6" style={{ color: "var(--text)" }}>
        {q.statement}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={(e) => pick(true, e)}
          disabled={isAnswered}
          className={cn(
            "py-5 rounded-2xl font-bold text-lg transition-all active:scale-95",
            isAnswered && selected === true && q.isTrue !== true && "anim-shake",
            isAnswered && q.isTrue === true && "anim-correct",
          )}
          style={btnStyle(true)}
        >
          True
        </button>
        <button
          onClick={(e) => pick(false, e)}
          disabled={isAnswered}
          className={cn(
            "py-5 rounded-2xl font-bold text-lg transition-all active:scale-95",
            isAnswered && selected === false && q.isTrue !== false && "anim-shake",
            isAnswered && q.isTrue === false && "anim-correct",
          )}
          style={btnStyle(false)}
        >
          False
        </button>
      </div>
    </Wrapper>
  );
}

// ─── Fill in the blank ───────────────────────────────────────────────────
function FillBlankBody({ q, onAnswer, locked, header }: {
  q: Extract<QuizQuestion, { type: "fill-blank" }>;
  onAnswer: Props["onAnswer"];
  locked: Props["locked"];
  header: React.ReactNode;
}) {
  const parts = useMemo(() => q.sentence.split(/_{3,}/), [q.sentence]);
  const blankCount = Math.max(parts.length - 1, q.answers.length);
  const [values, setValues] = useState<string[]>(() => Array(blankCount).fill(""));
  const firstRef = useRef<HTMLInputElement | null>(null);
  const isAnswered = locked !== null && locked !== undefined;

  useEffect(() => { firstRef.current?.focus(); }, [q.id]);

  function submit(ev?: React.FormEvent<HTMLFormElement>) {
    ev?.preventDefault();
    if (isAnswered) return;
    let allCorrect = true;
    let anyCorrect = false;
    for (let i = 0; i < blankCount; i++) {
      const accepted = q.answers[i] ?? q.answers[0] ?? [];
      const ok = matchesAny(values[i], accepted, 0.85);
      if (ok) anyCorrect = true;
      else allCorrect = false;
    }
    const verdict: AnswerVerdict = allCorrect ? "correct" : anyCorrect ? "partial" : "wrong";
    const feedback = allCorrect
      ? q.explanation
      : `Expected: ${q.answers.map((alts) => alts[0]).join(", ")}. ${q.explanation}`;
    onAnswer({ verdict, feedback });
  }

  function inputStyle(i: number): React.CSSProperties {
    if (!isAnswered) {
      return {
        background: "var(--surface-strong)",
        border: "1.5px solid var(--border-strong)",
        color: "var(--text)",
      };
    }
    const accepted = q.answers[i] ?? q.answers[0] ?? [];
    const ok = matchesAny(values[i], accepted, 0.85);
    return {
      background: ok ? "rgba(74, 222, 128, 0.12)" : "rgba(255, 107, 107, 0.12)",
      border: `1.5px solid ${ok ? "var(--success)" : "var(--danger)"}`,
      color: ok ? "var(--success)" : "var(--danger)",
    };
  }

  return (
    <Wrapper header={header}>
      <form onSubmit={submit}>
        <div className="text-lg sm:text-xl font-medium leading-relaxed mb-5" style={{ color: "var(--text)" }}>
          {parts.map((part, i) => (
            <span key={i} className="contents">
              {part}
              {i < blankCount && (
                <input
                  ref={i === 0 ? firstRef : undefined}
                  type="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={isAnswered}
                  value={values[i] ?? ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = e.target.value;
                    setValues(next);
                  }}
                  className="mx-1 px-3 py-1.5 rounded-lg text-base font-semibold outline-none min-w-[8rem] inline-block align-middle"
                  style={inputStyle(i)}
                />
              )}
            </span>
          ))}
        </div>
        {!isAnswered && (
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 text-white"
            style={{
              background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
              boxShadow: "0 6px 20px rgba(20, 184, 166, 0.35)",
            }}
          >
            Check answer <CornerDownLeft size={14} />
          </button>
        )}
      </form>
    </Wrapper>
  );
}

// ─── Short answer ────────────────────────────────────────────────────────
function ShortAnswerBody({ q, onAnswer, locked, header }: {
  q: Extract<QuizQuestion, { type: "short-answer" }>;
  onAnswer: Props["onAnswer"];
  locked: Props["locked"];
  header: React.ReactNode;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ShortAnswerResult | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const isAnswered = locked !== null && locked !== undefined;

  useEffect(() => { taRef.current?.focus(); setText(""); setResult(null); }, [q.id]);

  function submit(ev?: React.FormEvent<HTMLFormElement>) {
    ev?.preventDefault();
    if (isAnswered) return;
    const r = scoreShortAnswer(text, q.acceptableAnswers, q.minMatches);
    setResult(r);
    const verdict: AnswerVerdict = r.kind;
    const missed = q.acceptableAnswers.filter((a) => !r.matched.includes(a));
    const feedbackBody = r.kind === "correct"
      ? `Got it. ${q.explanation}`
      : r.kind === "partial"
      ? `Close. ${r.reason} Missed: ${missed.slice(0, 3).join(", ")}. ${q.explanation}`
      : `${r.reason} ${q.explanation}`;
    onAnswer({ verdict, feedback: feedbackBody, raw: r });
  }

  const verdictColor =
    !result ? "var(--border)" :
    result.kind === "correct" ? "var(--success)" :
    result.kind === "partial" ? "var(--warning)" :
    "var(--danger)";

  return (
    <Wrapper header={header}>
      <form onSubmit={submit}>
        <p className="text-lg sm:text-xl font-semibold leading-snug mb-4" style={{ color: "var(--text)" }}>
          {q.question}
        </p>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Write in your own words — answers don&apos;t need to match exactly.
        </p>
        <textarea
          ref={taRef}
          rows={4}
          disabled={isAnswered}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 rounded-2xl text-base font-medium outline-none resize-none mb-3"
          style={{
            background: "var(--surface-strong)",
            border: `1.5px solid ${verdictColor}`,
            color: "var(--text)",
          }}
        />
        {!isAnswered ? (
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 text-white disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
              boxShadow: "0 6px 20px rgba(20, 184, 166, 0.35)",
            }}
          >
            Submit answer <CornerDownLeft size={14} />
          </button>
        ) : result && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: result.kind === "correct" ? "rgba(74,222,128,0.1)" :
                          result.kind === "partial" ? "rgba(251, 191, 36, 0.1)" :
                          "rgba(255,107,107,0.1)",
              color: verdictColor,
            }}
          >
            {result.kind === "correct" && <CheckCircle2 size={16} fill="currentColor" />}
            {result.kind === "partial" && <AlertCircle size={16} fill="currentColor" />}
            {result.kind === "wrong" && <XCircle size={16} fill="currentColor" />}
            <span className="font-medium">
              {result.kind === "correct" ? "Correct" :
               result.kind === "partial" ? "Partially correct" : "Not quite"}
              {" — "}
              <span className="font-normal opacity-80">{result.reason}</span>
            </span>
          </div>
        )}
      </form>
    </Wrapper>
  );
}
