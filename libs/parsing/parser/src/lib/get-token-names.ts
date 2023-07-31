import {
  BRANCH_TYPES,
  IBranch,
  IParsed,
  SyntaxTree,
} from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames, TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Tokens that we filter out
 */
const FILTER_TOKENS: { [key: string]: boolean } = {};
FILTER_TOKENS[TOKEN_NAMES.COMMENT] = true;
FILTER_TOKENS[TOKEN_NAMES.COMMENT_BLOCK] = true;
FILTER_TOKENS[TOKEN_NAMES.LINE_SEPARATION] = true;
FILTER_TOKENS[TOKEN_NAMES.LINE_SEPARATION_BASIC] = true;

/**
 * Tokens that we normalize to single quotes
 */
const NORMALIZE_TOKENS: { [key: string]: boolean } = {};
NORMALIZE_TOKENS[TOKEN_NAMES.QUOTE_DOUBLE] = true;
NORMALIZE_TOKENS[TOKEN_NAMES.QUOTE_SINGLE] = true;

/**
 * Handles recursion through our syntax tree to extract token names in order of appearance
 */
function GetTokenNamesRecursor(tree: SyntaxTree, names: number[]) {
  for (let i = 0; i < tree.length; i++) {
    // save name if we are not a token that we are supposed to filter
    if (!(tree[i].name in FILTER_TOKENS)) {
      // save the name
      if (tree[i].name in NORMALIZE_TOKENS) {
        names.push(TOKEN_NAMES.QUOTE_SINGLE);
      } else {
        names.push(tree[i].name);
      }
    }

    // check for branch and if we need to recurse
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      GetTokenNamesRecursor(
        (tree[i] as IBranch<NonBasicTokenNames>).kids,
        names
      );
    }
  }
}

/**
 * Get token names from what is parsed.
 *
 * A few tokens are skipped to support formatting preference and
 * quotes are always normalized to single quotes to work around
 * formatting preferences.
 */
export function GetTokenNames(parsed: IParsed) {
  /** initialize result */
  const found: number[] = [];

  // extract token names
  GetTokenNamesRecursor(parsed.tree, found);

  return found;
}
