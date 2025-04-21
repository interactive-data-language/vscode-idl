/**
 * Round a number to the nearest increment
 */
export function RoundToNearest(num: number, to: number) {
  return num === 0 ? 0 : Math.round(Math.max(num / to, 1)) * to;
}
