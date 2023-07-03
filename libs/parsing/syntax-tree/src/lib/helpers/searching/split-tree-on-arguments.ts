import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { SyntaxTree, TreeBranchToken } from '../../branches.interface';
import { ISplitTreeOnArguments } from './split-tree-on-arguments.interface';
import { SplitTreeOnCommas } from './split-tree-on-commas';

/**
 * Stop comma splitting on these
 */
const KEYWORDS: { [key: string]: any } = {};
KEYWORDS[TOKEN_NAMES.KEYWORD] = true;
KEYWORDS[TOKEN_NAMES.KEYWORD_BINARY] = true;

/**
 * Skip first comma for these
 */
const SKIP_FIRST: { [key: string]: any } = {};
SKIP_FIRST[TOKEN_NAMES.CALL_PROCEDURE] = true;
SKIP_FIRST[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Takes an array of tokens (i.e. syntax tree) and recursively splits them
 * by operators
 */
export function SplitTreeOnArguments(
  token: TreeBranchToken
): ISplitTreeOnArguments {
  const split = SplitTreeOnCommas(token.kids);

  // separate by args or keywords
  const args: SyntaxTree[] = [];
  const keywords: SyntaxTree[] = [];

  // process each split
  for (let i = 0; i < split.children.length; i++) {
    // get kids
    const kids = split.children[i];

    // check if we have a chunk of keywords
    if (kids[0]?.name in KEYWORDS) {
      keywords.push(kids);
      continue;
    } else {
      args.push(kids);
    }
  }

  /**
   * Check if we have a procedure and, if we have an argument, then
   * we should remove the first which would be empty because we start with a comma
   */
  if (token.name in SKIP_FIRST && args.length > 0) {
    args.splice(0, 1);
  }

  return { args, keywords };
}
