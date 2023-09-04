import { CancellationToken } from '@idl/cancellation-tokens';
import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TokenName,
} from '@idl/parsing/tokenizer';
import { Position } from 'vscode-languageserver/node';

import { IBranch, TreeToken } from '../branches.interface';
import { IParsed } from '../build-syntax-tree.interface';
import { PopulateScopeDetail } from '../populate-scope-detail';
import { TreeRecurser } from '../recursion-and-callbacks/tree-recurser';
import {
  DEFAULT_GLOBAL_PARENTS,
  ITreeRecurserRecursionOptions,
} from '../recursion-and-callbacks/tree-recurser.interface';
import { SetTokenCache } from '../set-token-cache';
import { GetRoutineName } from './get-routine-name';
import { IsWithinBranch, IsWithinToken } from './is-within';
import { ISelectedToken } from './selected-token.interface';

/**
 * Based on a syntax tree cursor location, return the token that we
 * have covered.
 *
 * @param relaxed Makes tokens extend one more space to the right which
 *                is what we need for auto-complete, but not hover help. Also
 *                includes the children in our tokens that get returned
 */
export function GetTokenAtCursor(
  parsed: IParsed,
  pos: Position,
  onlyStart = false
): ISelectedToken {
  // make a cancellation token
  const cancel = new CancellationToken();

  /** Initialize result */
  let result: ISelectedToken = {
    accessTokens: [],
    scope: [],
    scopeTokens: [],
    cancel,
  };

  // make sure we have scope detail populated in our tree
  SetTokenCache(parsed, cancel);
  PopulateScopeDetail(parsed, cancel);

  /** Init token that we found */
  let foundToken: TreeToken<TokenName> = undefined;

  // recurse through the tree to find a match
  TreeRecurser(parsed, cancel, {
    processBranchFirst: true,
    onBasicToken: (token, current) => {
      // return if our token is before our line
      if (token.pos[0] < pos.line) {
        return;
      }

      // halt recursion if our token is after the cursor position
      if (token.pos[0] > pos.line) {
        return;
      }

      // check if we are in it
      if (IsWithinToken(pos, token.pos)) {
        result = current;
        foundToken = token;
        return true;
      }
    },
    onBranchToken: (token, current) => {
      // halt recursion if our token is after the cursor position
      if (token.pos[0] > pos.line) {
        return;
      }

      // check if we are in it
      if (IsWithinToken(pos, token.pos)) {
        result = current;
        foundToken = token;
        return true;
      }

      // get end of token
      const end = token?.end?.pos;

      // make sure we have an end
      if (end !== undefined) {
        // if we didnt match children, are we inside of our branch
        if (!onlyStart) {
          if (IsWithinBranch(pos, token.pos, end)) {
            result = current;
            foundToken = token;
            return true;
          }
        }

        /**
         * NEVER end recursion when we check the end token
         *
         * This is because we check our branch first, which means we may
         * check a token after our cursor, which is not wrong
         */
        // // if our token ends before cursor, return
        // if (end[0] > pos.line) {
        //   return true;
        // }
      }
    },
  });

  // set found token
  result.token = foundToken;

  // update global parent which gets skewed if we move to the next global token
  // and then exit the loop
  if (foundToken !== undefined) {
    if ((foundToken.scopeTokens || [])[0]?.name in DEFAULT_GLOBAL_PARENTS) {
      result.globalParent = {
        name: GetRoutineName(
          foundToken.scopeTokens[0] as IBranch<
            RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
          >
        ),
        type: DEFAULT_GLOBAL_PARENTS[foundToken.scopeTokens[0].name],
        token: foundToken.scopeTokens[0],
      };
    }
  }

  // clean up extra properties from our result
  delete (result as ITreeRecurserRecursionOptions).allowedGlobalParents;
  delete (result as ITreeRecurserRecursionOptions).allowedAccessTokens;
  delete (result as ITreeRecurserRecursionOptions).exit;

  // copy token so that, if we need to make changes for some reason, we can
  return result;
}
