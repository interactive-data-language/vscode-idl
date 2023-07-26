import { TokenName } from '@idl/parsing/tokenizer';

import { SyntaxTree, TreeToken } from '../../branches.interface';

/**
 * Checks the top-level of our syntax tree for a matching token
 */
export function FindDirectTreeChildren<T extends TokenName>(
  tree: SyntaxTree,
  token: T
) {
  // init result for recursing
  const found: TreeToken<T>[] = [];

  // process all children
  for (let i = 0; i < (tree || []).length; i++) {
    if (tree[i].name === token) {
      found.push(tree[i] as TreeToken<T>);
    }
  }

  // return what we found!
  return found;
}
