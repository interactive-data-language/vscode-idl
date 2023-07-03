import { MakeSpaces, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

import { DONT_INDENT_INSIDE_OF } from './merge-rules.interface';

/**
 * Gets new lines for us based on where we are and what we are inside of
 */
export function GetNewLine(
  indentLevel: number,
  tabWidth: number,
  tokenParent: TreeToken<TokenName> | undefined
): string[] {
  // determine how to start our line
  if (!(tokenParent?.name in DONT_INDENT_INSIDE_OF)) {
    if (indentLevel > 0) {
      return [MakeSpaces(indentLevel * tabWidth)];
    }
  }

  return [''];
}
