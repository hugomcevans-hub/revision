// Lightweight fuzzy matching for short-answer and fill-blank questions.

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "to", "in", "on", "at", "for", "with", "by", "from", "as", "that",
  "this", "these", "those", "and", "or", "but", "if", "so", "than", "then",
  "it", "its", "into", "via", "vs", "also", "such", "which", "who", "what",
  "where", "when", "why", "how", "any", "all", "some", "more", "most", "less",
  "can", "do", "does", "did", "has", "have", "had", "will", "would", "should",
  "may", "might", "must", "i", "you", "he", "she", "they", "we", "us",
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")     // strip accents
    .replace(/[^a-z0-9\s-]/g, " ")       // punctuation → space
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[\s-]+/)
    .map((t) => t.replace(/^(es|s)$/, "")) // crude singularisation
    .map(stem)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function stem(w: string): string {
  // crude suffix stripping
  if (w.length <= 3) return w;
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("sses")) return w.slice(0, -2);
  if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("s")) return w.slice(0, -1);
  if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
  if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
  return w;
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** Returns 0..1 similarity using normalized Levenshtein. */
export function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na && !nb) return 1;
  if (!na || !nb) return 0;
  const d = levenshtein(na, nb);
  return 1 - d / Math.max(na.length, nb.length);
}

/** True if the given input is close enough to ANY accepted answer (synonyms). */
export function matchesAny(input: string, accepted: string[], threshold = 0.78): boolean {
  for (const acc of accepted) {
    if (similarity(input, acc) >= threshold) return true;
    // also try token-level: if the input contains the accepted string's main tokens
    const accT = tokenize(acc);
    const inT = new Set(tokenize(input));
    if (accT.length > 0) {
      const hits = accT.filter((t) => inT.has(t)).length;
      if (hits / accT.length >= 0.75) return true;
    }
  }
  return false;
}

export type ShortAnswerResult =
  | { kind: "correct"; matched: string[]; reason: string }
  | { kind: "partial"; matched: string[]; reason: string }
  | { kind: "wrong"; matched: string[]; reason: string };

/**
 * Score a short answer against a list of acceptable key concepts.
 * - Each acceptable answer is matched fuzzily (similarity OR token coverage).
 * - >=80% of keys matched → correct
 * - >= minMatches (or 50%) → partial
 * - else → wrong
 */
export function scoreShortAnswer(
  input: string,
  acceptable: string[],
  minMatches?: number,
): ShortAnswerResult {
  if (!input.trim()) {
    return { kind: "wrong", matched: [], reason: "No answer given." };
  }

  const matched: string[] = [];
  for (const key of acceptable) {
    if (matchesAny(input, [key], 0.72)) matched.push(key);
  }

  const total = acceptable.length;
  const need = minMatches ?? Math.max(1, Math.ceil(total * 0.5));
  const fullCredit = Math.max(need, Math.ceil(total * 0.8));

  if (matched.length >= fullCredit) {
    return { kind: "correct", matched, reason: `Hit ${matched.length}/${total} key points.` };
  }
  if (matched.length >= need) {
    return { kind: "partial", matched, reason: `Got ${matched.length}/${total} key points — partial credit.` };
  }
  return { kind: "wrong", matched, reason: matched.length > 0 ? `Only matched ${matched.length}/${total}.` : "Doesn't match any key point." };
}
