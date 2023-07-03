import { ConditionalLineNumberIncrement } from '@idl/assembling/shared';
import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { LogicalOfToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
/**
 * Routine definitions for special cases snapping after names
 */
const ROUTINE_TOKENS: { [key: string]: any } = {};
ROUTINE_TOKENS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
ROUTINE_TOKENS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;

/**
 * Routine name tokens that we skip for our "first" token to snap to
 */
const ROUTINE_NAME_TOKENS: { [key: string]: any } = {};
ROUTINE_NAME_TOKENS[TOKEN_NAMES.ROUTINE_NAME] = true;
ROUTINE_NAME_TOKENS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

/**
 * Tokens that we dont snap
 */
const DONT_SNAP: { [key: string]: any } = {};
DONT_SNAP[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Offsets line numbers for an array of tokens
 */
export function Offsetter(tree: SyntaxTree, offset: number) {
  for (let i = 0; i < tree.length; i++) {
    // update start
    tree[i].pos[0] -= offset;

    // check if we have a branch
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      // process our kids
      Offsetter((tree[i] as TreeBranchToken).kids, offset);

      // check if we have an end to move too
      if ((tree[i] as TreeBranchToken).end !== undefined) {
        (tree[i] as TreeBranchToken).end.pos[0] -= offset;
      }
    }
  }
}

/**
 * Takes a branch and makes sure the first child is the line after the start and the
 * end is the line after our last child
 */
export function BranchSnap(token: TreeBranchToken, tree: SyntaxTree) {
  // return if we dont snap
  if (token.name in DONT_SNAP) {
    return;
  }

  // get our kids
  let kids = token.kids;

  // check if we have kids
  if (kids.length === 0) {
    return;
  }

  // get the first kid
  let firstKid = kids[0];

  // get the reference start position
  let startRef = token.pos[0];

  // special branch cases
  switch (true) {
    // check if we have a routine token
    case token.name in ROUTINE_TOKENS:
      // if we have routine name, special cases
      if (firstKid.name in ROUTINE_NAME_TOKENS) {
        // use end of the routine name
        startRef =
          (firstKid as TreeBranchToken).end !== undefined
            ? (firstKid as TreeBranchToken).end.pos[0]
            : firstKid.pos[0];

        // ignore routine name for our start
        kids = kids.slice(1);

        // return if we dont have any other children
        if (kids.length === 0) {
          return;
        }

        // update our first kid
        firstKid = kids[0];
      }
      break;
    default:
      break;
  }

  // fix lines for start if we need to
  const offset = firstKid.pos[0] - (startRef + 1);
  if (offset > 0) {
    ConditionalLineNumberIncrement(tree, startRef + 1, -offset);
  }

  // check if we have an end
  if (token.end !== undefined) {
    // get the last
    let lastKid = kids[kids.length - 1];

    // check if we have an "of" which always ends right before "endswitch" or "endcase"
    if (lastKid.name === TOKEN_NAMES.LOGICAL_OF) {
      const ofKids = (lastKid as TreeToken<LogicalOfToken>).kids;
      if (ofKids.length === 0) {
        return;
      }
      lastKid = ofKids[ofKids.length - 1];
    }

    /** Get the end of the kid */
    const kidEnd =
      (lastKid as TreeBranchToken).end !== undefined
        ? (lastKid as TreeBranchToken).end.pos[0]
        : lastKid.pos[0];

    // get offset
    const endOffset = token.end.pos[0] - (kidEnd + 1);

    // correct end
    if (endOffset > 0) {
      ConditionalLineNumberIncrement(tree, token.end.pos[0], -endOffset);
    }
  }
}
