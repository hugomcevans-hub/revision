"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, BookOpenText, HelpCircle, LayoutDashboard, Timer, GraduationCap } from "lucide-react";
import StatsStrip from "./StatsStrip";

const links = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/flashcards", label: "Cards", icon: Brain },
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/test", label: "Test", icon: Timer },
  { href: "/notes", label: "Notes", icon: BookOpenText },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar — desktop: stats left, nav right; mobile: stats only */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(12, 12, 16, 0.72)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
          <StatsStrip />

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                  style={{
                    color: active ? "var(--text)" : "var(--muted)",
                    background: active ? "var(--surface-strong)" : "transparent",
                  }}
                >
                  <Icon size={14} strokeWidth={active ? 2.4 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile floating bottom tab bar */}
      <nav
        className="md:hidden fixed left-1/2 z-50"
        style={{
          bottom: "max(env(safe-area-inset-bottom), 16px)",
          transform: "translateX(-50%)",
          background: "rgba(20, 20, 26, 0.78)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: "1px solid var(--border-strong)",
          borderRadius: "999px",
          padding: "5px",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.45)",
          display: "flex",
          gap: "2px",
        }}
        aria-label="Primary navigation"
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all"
              style={{
                color: active ? "white" : "var(--muted-soft)",
                background: active
                  ? "linear-gradient(135deg, #14b8a6, #ff6b6b)"
                  : "transparent",
                minWidth: "44px",
                minHeight: "40px",
                justifyContent: "center",
                boxShadow: active ? "0 4px 16px rgba(20, 184, 166, 0.45)" : "none",
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.3 : 1.9} />
              {active && <span className="text-[13px] font-semibold">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
