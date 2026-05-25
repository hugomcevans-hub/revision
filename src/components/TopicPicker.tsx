"use client";
import { useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { listTopics } from "@/lib/topics";
import { getSubjectTheme } from "@/lib/subjects";

interface Props {
  /** Optional subject filter — if set, only show topics in that subject. "All" shows everything. */
  subject?: string;
  /** Set of selected noteIds. Empty set = "all topics in subject". */
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  /** Initial open state */
  initiallyOpen?: boolean;
}

export default function TopicPicker({ subject, selected, onChange, initiallyOpen = false }: Props) {
  const [open, setOpen] = useState(initiallyOpen);
  const topics = useMemo(() => listTopics(subject), [subject]);
  const groups = useMemo(() => {
    const g: Record<string, typeof topics> = {};
    for (const t of topics) (g[t.subject] = g[t.subject] || []).push(t);
    return g;
  }, [topics]);

  function toggle(noteId: string) {
    const next = new Set(selected);
    if (next.has(noteId)) next.delete(noteId);
    else next.add(noteId);
    onChange(next);
  }

  function selectAll() {
    onChange(new Set(topics.map((t) => t.noteId)));
  }
  function clearAll() {
    onChange(new Set());
  }

  const isAllSelected = selected.size === 0 || selected.size === topics.length;
  const summary =
    selected.size === 0 || selected.size === topics.length
      ? "All topics"
      : `${selected.size} topic${selected.size === 1 ? "" : "s"}`;

  return (
    <div>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.99]"
        style={{
          background: "var(--surface-strong)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: "var(--muted)" }}>Topics:</span>
          <span style={{ color: isAllSelected ? "var(--muted-soft)" : "var(--text)" }}>
            {summary}
          </span>
        </span>
        <ChevronDown
          size={15}
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 200ms",
          }}
        />
      </button>

      {open && (
        <div
          className="anim-fade-up mt-2 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Quick actions */}
          <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
              style={{ color: "var(--brand-2)", background: "var(--brand-glow)" }}
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
              style={{ color: "var(--muted)" }}
            >
              <X size={11} /> Clear
            </button>
            <span className="ml-auto text-xs tabular-nums" style={{ color: "var(--muted)" }}>
              {selected.size || topics.length} / {topics.length}
            </span>
          </div>

          {/* Grouped chips */}
          <div className="max-h-72 overflow-y-auto px-3 py-3 space-y-3">
            {Object.entries(groups).map(([sub, ts]) => {
              const t = getSubjectTheme(sub);
              return (
                <div key={sub}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ color: t.color }}>
                    {sub}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ts.map((topic) => {
                      const checked = selected.has(topic.noteId);
                      return (
                        <button
                          key={topic.noteId}
                          type="button"
                          onClick={() => toggle(topic.noteId)}
                          className="text-[12px] font-medium px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1"
                          style={
                            checked
                              ? {
                                  background: t.colorSoft,
                                  color: t.color,
                                  border: `1px solid ${t.color}`,
                                }
                              : {
                                  background: "var(--surface-strong)",
                                  color: "var(--muted-soft)",
                                  border: "1px solid var(--border)",
                                }
                          }
                        >
                          {checked && <Check size={10} strokeWidth={3} />}
                          {topic.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {topics.length === 0 && (
              <p className="text-sm text-center py-2" style={{ color: "var(--muted-soft)" }}>
                No topics for this subject yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
