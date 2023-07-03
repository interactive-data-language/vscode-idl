/**
 * Helper routine to test text against a regex. Optional parameter to reset
 * which fixes issues with global matches not matching later
 */
export function TestGlobal(text: string, exp: RegExp, reset = true): boolean {
  // forget any previous matches
  if (reset) {
    exp.lastIndex = 0;
  }

  // test and return
  return exp.test(text);
}
