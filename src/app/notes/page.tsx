"use client";
import { useEffect, useState, useMemo } from "react";
import { Search, ChevronDown, X, BookOpenText, Hash } from "lucide-react";
import { store } from "@/lib/store";
import { Note } from "@/types";
import { getSubjectTheme } from "@/lib/subjects";
import Markdown from "@/components/Markdown";

const SUBJECTS_ALL = "All";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState(SUBJECTS_ALL);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const n = store.getNotes();
    setNotes(n);
    setSubjects([...new Set(n.map((x) => x.subject))].sort());
  }, []);

  const filtered = useMemo(() => notes.filter((n) => {
    const matchSub = subject === SUBJECTS_ALL || n.subject === subject;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q));
    return matchSub && matchQ;
  }), [notes, subject, query]);

  const grouped = useMemo(() => filtered.reduce<Record<string, Note[]>>((acc, n) => {
    (acc[n.subject] = acc[n.subject] || []).push(n);
    return acc;
  }, {}), [filtered]);

  return (
    <div className="max-w-4xl mx-auto px-5 pt-6 sm:pt-10 pb-12 w-full">
      <header className="anim-fade-up mb-7">
        <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "var(--muted)" }}>
          Notes
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <BookOpenText size={26} style={{ color: "var(--biology)" }} />
          Your vault
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>
          {notes.length} notes across {subjects.length} subjects.
        </p>
      </header>

      {/* Search + filter */}
      <div className="anim-fade-up delay-1 mb-6 space-y-3">
        <div
          className="flex items-center gap-2.5 px-4 h-12 rounded-2xl"
          style={{ background: "var(--surface-strong)", border: "1px solid var(--border-strong)" }}
        >
          <Search size={16} style={{ color: "var(--muted)" }} />
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--muted)]"
            placeholder="Search notes, content, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--surface)", color: "var(--muted-soft)" }}
            >
              <X size={12} />
            </button>
          )}
        </div>

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
                        background: t ? t.gradient : "linear-gradient(135deg, #10b981, #06b6d4)",
                        color: "white",
                        boxShadow: `0 6px 20px ${t ? t.colorSoft : "rgba(16,185,129,0.4)"}`,
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
      </div>

      {/* Notes list */}
      {filtered.length === 0 ? (
        <div className="glass p-10 text-center" style={{ borderRadius: "22px" }}>
          <p style={{ color: "var(--muted-soft)" }}>No notes match your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([sub, subNotes]) => {
            const t = getSubjectTheme(sub);
            const Icon = t.icon;
            return (
              <section key={sub}>
                <div className="flex items-center gap-2 mb-3.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: t.colorSoft, color: t.color }}
                  >
                    <Icon size={14} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color: t.color }}>
                    {sub}
                  </h2>
                  <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
                    · {subNotes.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {subNotes.map((note, idx) => {
                    const isOpen = expanded === note.id;
                    return (
                      <article
                        key={note.id}
                        className={`anim-fade-up delay-${Math.min(idx, 4) + 1} glass overflow-hidden transition-all`}
                        style={{
                          borderRadius: "18px",
                          borderColor: isOpen ? t.colorSoft : "var(--border)",
                          background: isOpen ? "var(--surface-strong)" : "var(--surface)",
                        }}
                      >
                        <button
                          className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4"
                          onClick={() => setExpanded(isOpen ? null : note.id)}
                          aria-expanded={isOpen}
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-snug">{note.title}</h3>
                            <div className="mt-1.5 flex items-center gap-2.5 text-xs flex-wrap" style={{ color: "var(--muted)" }}>
                              <span className="tabular-nums">{note.wordCount} words</span>
                              {note.headings.length > 0 && (
                                <>
                                  <span className="opacity-50">·</span>
                                  <span className="tabular-nums">{note.headings.length} sections</span>
                                </>
                              )}
                              {note.tags.length > 0 && (
                                <>
                                  <span className="opacity-50">·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Hash size={10} />
                                    {note.tags.slice(0, 2).join(", ")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform"
                            style={{
                              background: isOpen ? t.colorSoft : "var(--surface-elevated)",
                              color: isOpen ? t.color : "var(--muted-soft)",
                              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                            }}
                          >
                            <ChevronDown size={14} />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="anim-fade-in px-4 sm:px-5 pb-5 border-t" style={{ borderColor: t.colorSoft }}>
                            {note.headings.length > 0 && (
                              <div className="mt-4 mb-5">
                                <p
                                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                                  style={{ color: "var(--muted)" }}
                                >
                                  Sections
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {note.headings.map((h, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                                      style={{
                                        background: t.colorSoft,
                                        color: t.color,
                                      }}
                                    >
                                      {h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div
                              className="text-[15px] max-h-[28rem] overflow-y-auto pr-2"
                              style={{ color: "var(--text-soft)" }}
                            >
                              <Markdown source={note.content} />
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
