import { performance } from 'perf_hooks';

/**
 * Helper function to time a function call and return the
 * amount of time it takes
 */
export function TimeIt(fn: () => void) {
  const t1 = performance.now();
  fn();
  return performance.now() - t1;
}

/**
 * Helper function to time a function call and return the
 * amount of time it takes
 */
export async function TimeItAsync(fn: () => Promise<void>) {
  const t1 = performance.now();
  await fn();
  return performance.now() - t1;
}
