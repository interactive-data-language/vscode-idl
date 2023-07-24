import { performance } from 'perf_hooks';

/**
 * Determines if value is number
 */
export function IsNumber(val: any) {
  return 'number' === typeof val && !isNaN(val);
}

/**
 * Get random integer
 */
export function RandomInt() {
  return Math.floor(Math.random() * (2147483647 - 0 + 1) + 0);
}

/**
 * Get current timestamp in seconds
 */
export function TimeStampInSeconds() {
  return Math.floor(performance.now() / 1000);
}
