import { BRANCH_TYPES, IBranch, SyntaxTree } from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames } from '@idl/parsing/tokenizer';

/**
 * Recurser to fix line numbers when we add or remove tokens inside of
 * our tree.
 *
 * Bumpers are an array of [startAfter, increment] for the line counts where
 * start after applies AFTER that line number.
 *
 * If you pass in more than one bumper, they are applied from first to last.
 */
export function IncrementLineNumbers(tree: SyntaxTree, increment: number) {
  // process all children
  for (let i = 0; i < tree.length; i++) {
    // move start
    tree[i].pos[0] += increment;

    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      // save as variable for type simplicity
      const branch = tree[i] as IBranch<NonBasicTokenNames>;

      // check for the end
      if (branch.end !== undefined) {
        branch.end.pos[0] += increment;
      }

      // move children
      IncrementLineNumbers(branch.kids, increment);
    }
  }
}
