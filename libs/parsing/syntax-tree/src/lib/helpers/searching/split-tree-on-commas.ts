import { CommaToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { SyntaxTree, TreeToken } from '../../branches.interface';

/** Tokens that we skip */
const IGNORE: { [key: string]: any } = {};
IGNORE[TOKEN_NAMES.LINE_CONTINUATION] = true;
IGNORE[TOKEN_NAMES.LINE_CONTINUATION_BASIC] = true;
IGNORE[TOKEN_NAMES.COMMENT] = true;
IGNORE[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Takes an array of tokens (i.e. syntax tree) and does a direct check
 * for commas. When commas are found, we split and track
 *
 * IMPORTANT NOTE: Depending on the routine you are checking, the elements
 * for commas and children will not match.
 */
export function SplitTreeOnCommas(
  tree: SyntaxTree,
  stopOnThese: { [key: string]: any } = {}
) {
  /** Commas we split by */
  const commas: TreeToken<CommaToken>[] = [];

  /** Children before/after each comma */
  const children: SyntaxTree[] = [];

  /** Track teh current children */
  const currentChildren: SyntaxTree = [];

  // process our syntax tree
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].name in IGNORE) {
      continue;
    }

    // check if we have a token to stop on
    if (tree[i].name in stopOnThese) {
      break;
    }

    if (tree[i].name === TOKEN_NAMES.COMMA) {
      commas.push(tree[i] as TreeToken<CommaToken>);
      children.push(currentChildren.splice(0, currentChildren.length));
    } else {
      currentChildren.push(tree[i]);
    }
  }

  // save extra kids
  if (currentChildren.length > 0) {
    children.push(currentChildren.splice(0, currentChildren.length));
  }

  return {
    commas,
    children,
  };
}
