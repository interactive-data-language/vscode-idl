import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBasicToken,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';

/**
 * Recursor for our tree creator
 */
function MapTreeRecursor(tree: SyntaxTree, simplified: SyntaxTree) {
  /**
   * Process each node
   */
  for (let i = 0; i < tree.length; i++) {
    const add: TreeBasicToken = {
      type: tree[i].type as any,
      name: tree[i].name as any,
      idx: tree[i].idx,
      match: tree[i].match,
      pos: tree[i].pos,
      parseProblems: tree[i].parseProblems,
      scope: tree[i].scope,
    };

    simplified.push(add);

    // check what kind of node we are working with
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      MapTreeRecursor((tree[i] as TreeBranchToken).kids, simplified);
    }
  }
}

/**
 * Maps tree to our minimal data format
 */
export function MapTree(tree: SyntaxTree) {
  const mapped: SyntaxTree = [];
  MapTreeRecursor(tree, mapped);
  return mapped;
}
