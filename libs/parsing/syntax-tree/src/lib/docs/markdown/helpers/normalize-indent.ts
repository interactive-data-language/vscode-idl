import { LINE_SEPARATOR } from '@idl/types/tokenizer';

/**
 * Takes docs and makes the text have th proper indentation when
 * it is nested in a list where we need consistent spacing
 */
export function NormalizeIndent(docs: string, indent: string): string {
  return `${indent}${docs.replace(LINE_SEPARATOR, `\n${indent}`)}`;
}
