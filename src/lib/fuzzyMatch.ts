/**
 * Fuzzy matching utility
 * Uses Levenshtein distance to compute similarity between two strings.
 * Fixed threshold of ~80% (Balanced mode) — no user-facing complexity.
 */

const FILLER_WORDS = new Set(["i", "a", "the", "um", "uh", "like", "so", "just", "please", "now"]);

/** Compute Levenshtein edit distance between two strings. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/** Normalize text: lowercase, trim, remove filler words. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((w) => !FILLER_WORDS.has(w))
    .join(" ");
}

/**
 * Compute similarity score between two strings [0, 1].
 * 1.0 = exact match, 0.0 = completely different.
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Check if the transcript contains the trigger phrase with fuzzy tolerance.
 *
 * Strategy:
 *  1. Normalize both strings.
 *  2. Check if any sliding window of the transcript (same word-count as phrase) fuzzy-matches.
 *  3. Also check a whole-transcript similarity in case speech is choppy.
 *
 * Threshold: 0.80 (Balanced — recommended default, no user slider needed).
 */
export function fuzzyMatchesTrigger(
  transcript: string,
  triggerPhrase: string,
  threshold = 0.80
): boolean {
  const normTranscript = normalize(transcript);
  const normTarget = normalize(triggerPhrase);

  if (!normTarget) return false;

  // Direct / near-exact check first (fast path)
  if (normTranscript.includes(normTarget)) return true;

  // Sliding window over transcript words, window = phrase word count
  const transcriptWords = normTranscript.split(" ");
  const targetWords = normTarget.split(" ");
  const windowSize = targetWords.length;

  for (let i = 0; i <= transcriptWords.length - windowSize; i++) {
    const window = transcriptWords.slice(i, i + windowSize).join(" ");
    if (similarity(window, normTarget) >= threshold) {
      return true;
    }
  }

  // Fallback: whole transcript vs phrase (handles shorter utterances)
  if (similarity(normTranscript, normTarget) >= threshold) return true;

  return false;
}
