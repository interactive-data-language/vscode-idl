import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBranchToken,
} from './branches.interface';

/**
 * Populates the index for a syntax tree to make sure it is valid.
 *
 * The math for this gets complicated and could be error prone, so
 * having a central point where this runs removes risk of bugs and
 * problems across the code base
 */
export function PopulateIndex(tree: SyntaxTree) {
  for (let i = 0; i < tree.length; i++) {
    tree[i].idx = i;
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      PopulateIndex((tree[i] as TreeBranchToken).kids);
    }
  }
}
