"use client";
import { useEffect, useState } from "react";
import { Flame, Volume2, VolumeX } from "lucide-react";
import { loadGame, levelFromXp, GameState } from "@/lib/game";
import { sound } from "@/lib/sound";

const MUTE_KEY = "rv_muted";

function useGameState(): GameState {
  const [state, setState] = useState<GameState>(() => loadGame());
  useEffect(() => {
    setState(loadGame());
    const refresh = () => setState(loadGame());
    window.addEventListener("storage", refresh);
    window.addEventListener("game:update", refresh);
    const interval = setInterval(refresh, 1500);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("game:update", refresh);
      clearInterval(interval);
    };
  }, []);
  return state;
}

export function notifyGameUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("game:update"));
  }
}

export default function StatsStrip() {
  const g = useGameState();
  const { level, intoLevel, needed } = levelFromXp(g.xp);
  const pct = Math.min(100, Math.round((intoLevel / needed) * 100));
  const hasStreak = g.streak > 0;
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = localStorage.getItem(MUTE_KEY) === "1";
    setMuted(m);
    sound.setMuted(m);
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
    if (typeof window !== "undefined") localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  }

  return (
    <div className="flex items-center gap-2.5">
      {/* Level pill */}
      <div
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full"
        style={{ background: "var(--surface-strong)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #14b8a6, #ff6b6b)",
            boxShadow: "0 2px 10px rgba(20, 184, 166, 0.5)",
          }}
        >
          <span className="text-[11px] font-bold text-white tabular-nums leading-none">{level}</span>
        </div>
        {/* mini XP bar */}
        <div
          className="w-16 h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #14b8a6, #ff6b6b)",
              boxShadow: pct > 0 ? "0 0 8px rgba(20, 184, 166, 0.6)" : "none",
            }}
          />
        </div>
      </div>

      {hasStreak && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full anim-streak-glow"
          style={{
            background: "rgba(251, 146, 60, 0.14)",
            border: "1px solid rgba(255, 107, 107, 0.35)",
          }}
        >
          <Flame
            size={14}
            className="anim-flicker"
            fill="#fb923c"
            color="#fb923c"
            strokeWidth={2}
          />
          <span
            className="text-sm font-extrabold tabular-nums leading-none"
            style={{ color: "#fdba74" }}
          >
            {g.streak}
          </span>
        </div>
      )}

      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: muted ? "var(--muted)" : "var(--text-soft)",
        }}
      >
        {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
      </button>
    </div>
  );
}
