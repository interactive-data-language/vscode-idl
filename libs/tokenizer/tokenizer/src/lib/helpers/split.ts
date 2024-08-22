import deepCopy from 'fast-copy';

/**
 * Splits code based on the new line characters
 */
export function Split(code: string | string[]): string[] {
  return Array.isArray(code) ? deepCopy(code) : code.split(/\r?\n/gm);
}
