import { BRANCH_TYPES, SyntaxTree } from '@idl/parsing/syntax-tree';
import { PositionArray } from '@idl/types/tokenizer';

import {
  TOKEN_EDIT_TYPE_LOOKUP,
  TokenEditType,
} from './get-overlapping-tokens.interface';

/**
 * Function that checks if a token's position is inside
 * of an edit
 */
function IsTokenInEdit(
  pos: PositionArray,
  editLineStart: number,
  editLineEnd: number
) {
  return pos[0] >= editLineStart && pos[0] <= editLineEnd;
}

/**
 * Checks if an edit is contained inside of a token
 */
function IsEditInToken(
  tokenStart: PositionArray,
  tokenEnd: PositionArray,
  editLineStart: number,
  editLineEnd: number
) {
  return tokenStart[0] <= editLineStart && tokenEnd[0] >= editLineEnd;
}

/**
 *  Finds tokens in our tree where the edit ranges overlap tokens
 */
export function GetOverlappingTokens(
  tree: SyntaxTree,
  editLineStart: number,
  editLineEnd: number
) {
  /** Tokens that overlap */
  const found: number[] = [];

  /** If we have complete overlap or not (for removing) */
  const editTypes: TokenEditType[] = [];

  for (let i = 0; i < tree.length; i++) {
    const el = tree[i];

    switch (el.type) {
      case BRANCH_TYPES.BRANCH: {
        // don't process incomplete tokens
        if (!el?.end?.pos) {
          break;
        }

        /**
         * Check if the edit is interior
         */
        if (IsEditInToken(el.pos, el.end.pos, editLineStart, editLineEnd)) {
          found.push(i);
          editTypes.push(TOKEN_EDIT_TYPE_LOOKUP.INTERIOR);
        } else {
          const flag =
            +IsTokenInEdit(el.pos, editLineStart, editLineEnd) +
            +IsTokenInEdit(el.end.pos, editLineStart, editLineEnd);
          if (flag > 0) {
            found.push(i);
            editTypes.push(
              flag === 2
                ? TOKEN_EDIT_TYPE_LOOKUP.COMPLETE
                : TOKEN_EDIT_TYPE_LOOKUP.PARTIAL
            );
          }
        }

        break;
      }

      /**
       * Don't check basic tokens, only interested in branches in case we have
       * complex changes to make to the tree
       */
      // case BRANCH_TYPES.BASIC: {
      //   if (SimpleComparison(el.pos, editLineStart, editLineEnd)) {
      //     found.push(i);
      //     editTypes.push(true);
      //   }
      //   break;
      // }

      // do nothing
      default:
        break;
    }
  }

  return { found, editTypes };
}
