/**
 * Fuzzy-matches a query against a target string using ordered subsequence
 * matching (each query character must appear in `target`, in order, but not
 * necessarily contiguously). Consecutive matches score higher.
 *
 * Returns a score (higher is a better match), or `undefined` if the query
 * doesn't match at all.
 */
export function FuzzyMatchScore(
  query: string,
  target: string,
): number | undefined {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return 0;
  }

  const lowerTarget = target.toLowerCase();

  let score = 0;
  let lastIndex = -1;
  for (const char of trimmedQuery) {
    const index = lowerTarget.indexOf(char, lastIndex + 1);
    if (index === -1) {
      return undefined;
    }

    score += index === lastIndex + 1 ? 2 : 1;
    lastIndex = index;
  }

  return score;
}
