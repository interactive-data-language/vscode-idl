/**
 * Helper function to time a function call and return the
 * amount of time it takes
 */
export function TimeIt(fn: () => void) {
  const t1 = Date.now();
  fn();
  return Date.now() - t1;
}

/**
 * Helper function to time a function call and return the
 * amount of time it takes
 */
export async function TimeItAsync(fn: () => Promise<void>) {
  const t1 = Date.now();
  await fn();
  return Date.now() - t1;
}
