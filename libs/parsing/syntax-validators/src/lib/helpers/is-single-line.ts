import { BRANCH_TYPES, TreeBranchToken } from '@idl/parsing/syntax-tree';

/**
 * Checks a branch's children to determine if it is a single line or not
 *
 * Used for main level programs, probably wont work with others
 */
export function IsSingleLine(token: TreeBranchToken): boolean {
  // if we have an end, return that
  if (token.end !== undefined) {
    return token.end.pos[0] - token.pos[0] === 0;
  }

  // if no kids, then we are a single line
  if (token.kids.length === 0) {
    return false;
  }

  /** get position of first kid */
  const first = token.kids[0];

  /** Get position of the last kid */
  const last = token.kids[token.kids.length - 1];

  // check for branch and see if we need to get the end
  let lastPos = last.pos;
  if (last.type === BRANCH_TYPES.BRANCH) {
    if (last.end !== undefined) {
      lastPos = last.end.pos;
    }
  }

  return lastPos[0] - first.pos[0] === 0;
}
