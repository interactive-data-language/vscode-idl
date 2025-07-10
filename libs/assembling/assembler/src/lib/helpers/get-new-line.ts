import { MakeSpaces, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/tokenizer';

import { DONT_INDENT_INSIDE_OF } from './merge-rules.interface';

/**
 * Gets new lines for us based on where we are and what we are inside of
 */
export function GetNewLine(
  indentLevel: number,
  tabWidth: number,
  tokenParent: TreeToken<TokenName> | undefined,
  hangingLine: number | undefined
): string[] {
  // return if we dont indent
  if (tokenParent?.name in DONT_INDENT_INSIDE_OF) {
    return [''];
  }

  // check for presence of hanging line
  if (hangingLine) {
    return [MakeSpaces(hangingLine)];
  }

  switch (true) {
    // if we have an indent level, then indent
    case indentLevel > 0:
      return [MakeSpaces(indentLevel * tabWidth)];

    default:
      return [''];
  }
}
