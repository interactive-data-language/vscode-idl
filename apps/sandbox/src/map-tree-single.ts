import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';

interface ISimplifiedTree {
  type: any[];
  name: any[];
  idx: any[];
  match: any[];
  pos: any[];
  parseProblems: any[];
  scope: any[];
}

/**
 * Recursor for our tree creator
 */
function MapTreeSingleRecursor(tree: SyntaxTree, simplified: ISimplifiedTree) {
  /**
   * Process each node
   */
  for (let i = 0; i < tree.length; i++) {
    simplified.type.push(tree[i].type);
    simplified.name.push(tree[i].name);
    simplified.idx.push(tree[i].idx);
    simplified.match.push(tree[i].match);
    simplified.pos.push(tree[i].pos);
    simplified.parseProblems.push(tree[i].parseProblems);
    simplified.scope.push(tree[i].scope);

    // check what kind of node we are working with
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      MapTreeSingleRecursor((tree[i] as TreeBranchToken).kids, simplified);
    }
  }
}

/**
 * Maps tree to our minimal data format
 */
export function MapTreeSingle(tree: SyntaxTree) {
  const mapped: ISimplifiedTree = {
    idx: [],
    match: [],
    name: [],
    parseProblems: [],
    pos: [],
    scope: [],
    type: [],
  };
  MapTreeSingleRecursor(tree, mapped);
  return mapped;
}
