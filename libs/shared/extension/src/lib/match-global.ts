/**
 * Helper routine to match regular expression and makes sure
 * we catch zero-width matches
 */
export function MatchGlobal(text: string, exp: RegExp, reset = false) {
  // forget any previous matches
  if (reset) {
    exp.lastIndex = 0;
  }

  // look for new matches
  const match = exp.exec(text);
  if (match !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === exp.lastIndex) {
      exp.lastIndex++;
    }
  }
  return match;
}
