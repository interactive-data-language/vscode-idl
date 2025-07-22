import { LINE_SEPARATOR } from '@idl/types/tokenizer';
import deepCopy from 'fast-copy';

/**
 * Splits code based on the new line characters
 */
export function Split(code: string | string[]): string[] {
  return Array.isArray(code) ? deepCopy(code) : code.split(LINE_SEPARATOR);
}
