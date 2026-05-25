"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Sparkles, Zap, Trophy } from "lucide-react";

// ─── XP Toast (floats up from origin) ─────────────────────────────────
export interface XpToastData {
  id: number;
  amount: number;
  combo?: number;
  multiplier?: number;
  comboLabel?: string | null;
  x: number; // viewport px
  y: number; // viewport px
  color?: string;
}

export function XpToast({ data }: { data: XpToastData }) {
  const big = (data.multiplier ?? 1) >= 3;
  return (
    <div
      className="fixed pointer-events-none z-[60] anim-xp-rise"
      style={{
        left: `${data.x}px`,
        top: `${data.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className={`flex items-center gap-2 rounded-full font-black tabular-nums ${big ? "px-5 py-2.5 text-xl" : "px-3.5 py-1.5 text-base"}`}
        style={{
          background: "linear-gradient(135deg, #14b8a6 0%, #ff6b6b 100%)",
          color: "white",
          boxShadow: `0 10px 30px rgba(20, 184, 166, 0.6), 0 0 ${big ? 50 : 30}px rgba(255, 107, 107, 0.5)`,
          border: "1.5px solid rgba(255, 255, 255, 0.4)",
          textShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Sparkles size={big ? 18 : 14} fill="#fff7d6" stroke="white" strokeWidth={2.5} />
        +{data.amount}
        {data.multiplier && data.multiplier > 1 && (
          <span
            className={`ml-0.5 ${big ? "px-2 py-0.5 text-sm" : "px-1.5 py-0.5 text-[11px]"} rounded-md font-black`}
            style={{ background: "rgba(0,0,0,0.22)", color: "#fff7d6" }}
          >
            ×{data.multiplier}
          </span>
        )}
      </div>
      {data.comboLabel && (
        <div
          className="mt-2 mx-auto inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.18em] anim-combo-beat"
          style={{
            background: "linear-gradient(135deg, #ff6b6b, #fb923c)",
            color: "white",
            boxShadow: "0 6px 22px rgba(255, 107, 107, 0.7), 0 0 28px rgba(251, 146, 60, 0.5)",
            transform: "translateX(-50%)",
            position: "relative",
            left: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          <Zap size={10} className="inline mr-0.5" fill="currentColor" />
          {data.comboLabel}
        </div>
      )}
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#14b8a6", "#2dd4bf", "#ff6b6b", "#fb923c",
  "#fbbf24", "#38bdf8", "#84cc16", "#fff7d6",
];

interface ConfettiPiece {
  id: number;
  left: number;       // %
  cx: string;
  cy: string;
  cr: string;
  cd: string;
  color: string;
  delay: string;
}

function makeConfetti(count = 80): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -90 + (Math.random() - 0.5) * 140;
    const distance = 160 + Math.random() * 260;
    const cx = Math.cos((angle * Math.PI) / 180) * distance;
    const cy = Math.sin((angle * Math.PI) / 180) * distance + 80; // gravity
    return {
      id: i,
      left: 50,
      cx: `${cx}px`,
      cy: `${cy}px`,
      cr: `${(Math.random() - 0.5) * 720}deg`,
      cd: `${900 + Math.random() * 900}ms`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: `${Math.random() * 120}ms`,
    };
  });
}

export function Confetti({ trigger, count = 150 }: { trigger: number; count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  useEffect(() => {
    if (trigger === 0) return;
    setPieces(makeConfetti(count));
    const t = setTimeout(() => setPieces([]), 2400);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (pieces.length === 0) return null;
  return (
    <div className="fixed inset-0 z-[55] pointer-events-none flex items-center justify-center">
      <div className="relative">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              left: "0px",
              top: "0px",
              background: p.color,
              ["--cx" as string]: p.cx,
              ["--cy" as string]: p.cy,
              ["--cr" as string]: p.cr,
              ["--cd" as string]: p.cd,
              animationDelay: p.delay,
              boxShadow: `0 0 8px ${p.color}80`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Level Up overlay ────────────────────────────────────────────────
export function LevelUpBurst({ level, onDone }: { level: number; onDone: () => void }) {
  useEffect(() => {
    // Trigger screen shake on body
    document.body.classList.add("anim-screen-shake");
    const t = setTimeout(() => {
      document.body.classList.remove("anim-screen-shake");
      onDone();
    }, 2400);
    return () => {
      document.body.classList.remove("anim-screen-shake");
      clearTimeout(t);
    };
  }, [onDone]);

  return (
    <>
      {/* screen flash */}
      <div
        className="fixed inset-0 z-[58] pointer-events-none anim-screen-flash"
        style={{
          background:
            "radial-gradient(circle at center, rgba(20, 184, 166, 0.6) 0%, rgba(255, 107, 107, 0.4) 35%, transparent 70%)",
        }}
      />
      {/* central card */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <div className="relative anim-level-flash">
          {/* expanding rings */}
          <div
            className="absolute inset-0 rounded-full anim-level-ring"
            style={{
              background:
                "radial-gradient(circle, transparent 38%, rgba(20, 184, 166, 0.55) 41%, transparent 47%)",
              width: "320px",
              height: "320px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full anim-level-ring"
            style={{
              background:
                "radial-gradient(circle, transparent 38%, rgba(255, 107, 107, 0.55) 41%, transparent 47%)",
              width: "320px",
              height: "320px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: "150ms",
            }}
          />
          <div
            className="absolute inset-0 rounded-full anim-level-ring"
            style={{
              background:
                "radial-gradient(circle, transparent 38%, rgba(251, 146, 60, 0.5) 41%, transparent 47%)",
              width: "320px",
              height: "320px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: "300ms",
            }}
          />
          <div
            className="relative px-10 py-8 rounded-[28px] text-center"
            style={{
              background:
                "linear-gradient(135deg, #14b8a6 0%, #ff6b6b 50%, #fb923c 100%)",
              boxShadow:
                "0 30px 90px rgba(20, 184, 166, 0.6), inset 0 1px 0 rgba(255,255,255,0.35), 0 0 80px rgba(255, 107, 107, 0.55)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              minWidth: "280px",
            }}
          >
            <Trophy size={48} className="text-white mx-auto mb-2 drop-shadow-lg" fill="#fff7d6" strokeWidth={1.6} />
            <p className="text-xs uppercase tracking-[0.32em] font-black text-white/90">Level Up!</p>
            <p className="text-7xl font-black text-white tabular-nums mt-1 leading-none drop-shadow-lg">
              {level}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Toast manager hook ──────────────────────────────────────────────
export interface RewardController {
  award: (opts: { amount: number; combo?: number; multiplier?: number; comboLabel?: string | null; origin?: { x: number; y: number } }) => void;
  celebrate: () => void;          // confetti burst
  levelUp: (level: number) => void;
}

export function useRewards(): {
  controller: RewardController;
  Overlay: React.FC;
} {
  const [toasts, setToasts] = useState<XpToastData[]>([]);
  const [confettiTick, setConfettiTick] = useState(0);
  const [levelUpFor, setLevelUpFor] = useState<number | null>(null);
  const idRef = useRef(0);

  const award: RewardController["award"] = useCallback((opts) => {
    const id = ++idRef.current;
    const origin = opts.origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setToasts((prev) => [
      ...prev,
      {
        id,
        amount: opts.amount,
        combo: opts.combo,
        multiplier: opts.multiplier,
        comboLabel: opts.comboLabel ?? null,
        x: origin.x,
        y: origin.y,
      },
    ]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 1700);
  }, []);

  const celebrate: RewardController["celebrate"] = useCallback(() => {
    setConfettiTick((t) => t + 1);
  }, []);

  const levelUp: RewardController["levelUp"] = useCallback((level) => {
    setLevelUpFor(level);
    setConfettiTick((t) => t + 1);
  }, []);

  const controller = useMemo(() => ({ award, celebrate, levelUp }), [award, celebrate, levelUp]);

  const Overlay: React.FC = () => (
    <>
      {toasts.map((t) => (
        <XpToast key={t.id} data={t} />
      ))}
      <Confetti trigger={confettiTick} />
      {levelUpFor !== null && (
        <LevelUpBurst level={levelUpFor} onDone={() => setLevelUpFor(null)} />
      )}
    </>
  );

  return { controller, Overlay };
}
