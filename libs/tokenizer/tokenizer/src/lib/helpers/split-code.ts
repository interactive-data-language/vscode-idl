import { LINE_SEPARATOR } from '@idl/types/tokenizer';
import { copy } from 'fast-copy';

/**
 * Splits code based on the new line characters
 */
export function SplitCode(code: string | string[]): string[] {
  return Array.isArray(code) ? copy(code) : code.split(LINE_SEPARATOR);
}
