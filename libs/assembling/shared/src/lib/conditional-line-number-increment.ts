import { BRANCH_TYPES, IBranch, SyntaxTree } from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames } from '@idl/parsing/tokenizer';

/**
 * Conditionally increments line numbers for tokens in our tree for any tokens
 * with a line number equal or greater than the start
 */
export function ConditionalLineNumberIncrement(
  tree: SyntaxTree,
  start: number,
  increment: number
) {
  // process all children
  for (let i = 0; i < tree.length; i++) {
    // move start
    if (tree[i].pos[0] >= start) {
      tree[i].pos[0] += increment;
    }

    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      // save as variable for type simplicity
      const branch = tree[i] as IBranch<NonBasicTokenNames>;

      // check for the end
      if (branch.end !== undefined) {
        if (branch.end.pos[0] >= start) {
          branch.end.pos[0] += increment;
        }
      }

      // move children
      ConditionalLineNumberIncrement(branch.kids, start, increment);
    }
  }
}
