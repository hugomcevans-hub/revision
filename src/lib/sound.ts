"use client";

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // iOS / Chrome require resume after user gesture; resume cheap if already running
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

interface ToneOptions {
  freq: number;
  duration: number;       // seconds
  type?: OscillatorType;
  attack?: number;        // seconds
  release?: number;       // seconds
  volume?: number;        // 0-1
  delay?: number;         // seconds from now
  freqEnd?: number;       // sweep target
}

function tone(opts: ToneOptions) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime + (opts.delay ?? 0);
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), now + opts.duration);
  }
  const peak = opts.volume ?? 0.18;
  const attack = opts.attack ?? 0.005;
  const release = opts.release ?? 0.08;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration + release);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + opts.duration + release + 0.05);
}

export const sound = {
  setMuted(m: boolean) { muted = m; },
  isMuted() { return muted; },

  // Cheerful triad
  correct() {
    tone({ freq: 587.33, duration: 0.08, type: "triangle", volume: 0.14 }); // D5
    tone({ freq: 880,    duration: 0.10, type: "triangle", volume: 0.14, delay: 0.06 }); // A5
  },

  // Soft thud
  wrong() {
    tone({ freq: 220, freqEnd: 110, duration: 0.18, type: "sine", volume: 0.16 });
  },

  // Sparkly chime
  combo() {
    tone({ freq: 660, duration: 0.10, type: "triangle", volume: 0.16 });
    tone({ freq: 990, duration: 0.10, type: "triangle", volume: 0.14, delay: 0.07 });
    tone({ freq: 1320, duration: 0.12, type: "triangle", volume: 0.12, delay: 0.14 });
  },

  // Rising fanfare
  levelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => {
      tone({ freq: f, duration: 0.14, type: "triangle", volume: 0.18, delay: i * 0.09 });
    });
    // Sparkle tail
    tone({ freq: 1568, duration: 0.20, type: "sine", volume: 0.12, delay: 0.36 });
  },

  // Soft tap
  flip() {
    tone({ freq: 720, freqEnd: 540, duration: 0.05, type: "sine", volume: 0.08 });
  },
};
