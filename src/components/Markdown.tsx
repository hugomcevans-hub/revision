import React, { ReactNode } from "react";

/**
 * Minimal, safe Obsidian-flavoured markdown renderer.
 *
 * Supports per-line:
 *   #, ##, ###, ####         → headings
 *   > text                   → blockquote / TL;DR callout
 *   - item / * item / 1. item → bullets / numbered list
 *   | a | b |                → table rows
 *
 * And inline:
 *   **bold**, __bold__
 *   *italic*, _italic_
 *   ==highlight==
 *   `code`
 *   [[wikilink]]             → rendered as styled token
 *   [text](url)              → not used here, but supported
 *
 * Returns a React tree (no dangerouslySetInnerHTML).
 */

// ── Inline ─────────────────────────────────────────────────────────────────
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  // Regex matches in priority order
  const patterns: { re: RegExp; render: (m: RegExpExecArray) => ReactNode }[] = [
    {
      re: /\*\*([^*\n]+?)\*\*/y,
      render: (m) => <strong key={key++} className="font-semibold text-white">{m[1]}</strong>,
    },
    {
      re: /__([^_\n]+?)__/y,
      render: (m) => <strong key={key++} className="font-semibold text-white">{m[1]}</strong>,
    },
    {
      re: /==([^=\n]+?)==/y,
      render: (m) => (
        <mark
          key={key++}
          className="px-1 rounded"
          style={{ background: "rgba(251, 191, 36, 0.18)", color: "#fde68a" }}
        >
          {m[1]}
        </mark>
      ),
    },
    {
      re: /`([^`\n]+?)`/y,
      render: (m) => (
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded text-[0.9em] font-mono"
          style={{ background: "var(--surface-strong)", color: "#c4b5fd", border: "1px solid var(--border)" }}
        >
          {m[1]}
        </code>
      ),
    },
    {
      re: /\*([^*\n]+?)\*/y,
      render: (m) => <em key={key++} className="italic">{m[1]}</em>,
    },
    {
      re: /_([^_\n]+?)_/y,
      render: (m) => <em key={key++} className="italic">{m[1]}</em>,
    },
    {
      re: /\[\[([^\]\n]+?)\]\]/y,
      render: (m) => (
        <span
          key={key++}
          className="px-1 rounded font-medium"
          style={{ color: "var(--brand-2)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px" }}
        >
          {m[1].split("|").pop()}
        </span>
      ),
    },
    {
      re: /\[([^\]\n]+?)\]\(([^)\n]+?)\)/y,
      render: (m) => (
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          className="underline"
          style={{ color: "var(--brand-2)" }}
        >
          {m[1]}
        </a>
      ),
    },
  ];

  while (i < text.length) {
    let matched = false;
    for (const { re, render } of patterns) {
      re.lastIndex = i;
      const m = re.exec(text);
      if (m && m.index === i) {
        nodes.push(render(m));
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // collect plain text until next special char
      let next = text.length;
      const specials = ["**", "__", "==", "`", "*", "_", "[["];
      for (const s of specials) {
        const idx = text.indexOf(s, i);
        if (idx !== -1 && idx < next) next = idx;
      }
      const linkIdx = text.indexOf("[", i);
      if (linkIdx !== -1 && linkIdx < next && text[linkIdx + 1] !== "[") next = linkIdx;

      if (next === i) {
        nodes.push(text[i]);
        i++;
      } else {
        nodes.push(text.slice(i, next));
        i = next;
      }
    }
  }
  return nodes;
}

// ── Block ──────────────────────────────────────────────────────────────────
type Block =
  | { type: "h"; level: number; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "hr" }
  | { type: "blank" };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let buf: string[] = [];
  let bufType: "ul" | "ol" | "p" | "table" | null = null;

  function flush() {
    if (!bufType || buf.length === 0) { buf = []; bufType = null; return; }
    if (bufType === "ul") blocks.push({ type: "ul", items: buf });
    else if (bufType === "ol") blocks.push({ type: "ol", items: buf });
    else if (bufType === "table") blocks.push({ type: "table", rows: buf.map(r => r.split("|").slice(1, -1).map(c => c.trim())) });
    else blocks.push({ type: "p", text: buf.join(" ") });
    buf = []; bufType = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    // YAML frontmatter — skip entire block at start
    if (blocks.length === 0 && buf.length === 0 && bufType === null && trimmed === "---") {
      // skip until closing ---
      continue;
    }

    if (trimmed === "") { flush(); blocks.push({ type: "blank" }); continue; }
    if (trimmed === "---") { flush(); blocks.push({ type: "hr" }); continue; }

    const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flush(); blocks.push({ type: "h", level: h[1].length, text: h[2] }); continue; }

    if (trimmed.startsWith(">")) {
      flush();
      blocks.push({ type: "quote", text: trimmed.replace(/^>\s?/, "") });
      continue;
    }

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Skip separator rows like | --- | --- |
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue;
      if (bufType !== "table") { flush(); bufType = "table"; }
      buf.push(trimmed);
      continue;
    }

    const ul = trimmed.match(/^[-*]\s+(.*)$/);
    if (ul) {
      if (bufType !== "ul") { flush(); bufType = "ul"; }
      buf.push(ul[1]);
      continue;
    }

    const ol = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      if (bufType !== "ol") { flush(); bufType = "ol"; }
      buf.push(ol[1]);
      continue;
    }

    // Paragraph
    if (bufType !== "p") { flush(); bufType = "p"; }
    buf.push(trimmed);
  }
  flush();

  // Trim leading frontmatter if it survived (closing ---)
  return blocks;
}

// ── Renderer ───────────────────────────────────────────────────────────────
export default function Markdown({ source, className = "" }: { source: string; className?: string }) {
  // Strip frontmatter cleanly
  let src = source;
  if (src.startsWith("---")) {
    const end = src.indexOf("\n---", 3);
    if (end !== -1) src = src.slice(end + 4);
  }

  const blocks = parseBlocks(src);

  return (
    <div className={`md-prose ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "blank") return null;
        if (b.type === "hr") return <hr key={i} className="my-5" style={{ borderColor: "var(--border)" }} />;
        if (b.type === "h") {
          const sizes = ["text-2xl", "text-xl", "text-lg", "text-base", "text-base", "text-sm"];
          return (
            <h3
              key={i}
              className={`${sizes[b.level - 1]} font-bold text-white mt-5 mb-2 tracking-tight`}
            >
              {renderInline(b.text)}
            </h3>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote
              key={i}
              className="my-4 px-4 py-3 rounded-xl"
              style={{ background: "var(--surface-strong)", borderLeft: "3px solid var(--brand-2)", color: "var(--text-soft)" }}
            >
              {renderInline(b.text)}
            </blockquote>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="my-3 space-y-1.5 list-disc pl-5 marker:text-[var(--muted)]">
              {b.items.map((it, j) => (
                <li key={j} className="leading-relaxed">{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={i} className="my-3 space-y-1.5 list-decimal pl-5 marker:text-[var(--muted)] marker:font-semibold">
              {b.items.map((it, j) => (
                <li key={j} className="leading-relaxed">{renderInline(it)}</li>
              ))}
            </ol>
          );
        }
        if (b.type === "table") {
          const [head, ...rows] = b.rows;
          return (
            <div key={i} className="my-4 overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                {head && (
                  <thead>
                    <tr>
                      {head.map((c, j) => (
                        <th
                          key={j}
                          className="text-left px-3 py-2 font-semibold"
                          style={{ color: "var(--text)", borderBottom: "1px solid var(--border-strong)", background: "var(--surface)" }}
                        >
                          {renderInline(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((c, j) => (
                        <td key={j} className="px-3 py-2 align-top" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-soft)" }}>
                          {renderInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={i} className="my-3 leading-relaxed">
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}
