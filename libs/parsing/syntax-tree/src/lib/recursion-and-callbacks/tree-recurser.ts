import { CancellationToken } from '@idl/cancellation-tokens';
import {
  MainLevelToken,
  NonBasicTokenNames,
  RoutineFunctionToken,
  RoutineProcedureToken,
} from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import {
  BRANCH_TYPES,
  IBranch,
  SyntaxTree,
  TreeBasicToken,
  TreeBranchToken,
  TreeToken,
} from '../branches.interface';
import { IParsed } from '../build-syntax-tree.interface';
import { GetRoutineName } from '../helpers/get-routine-name';
import {
  BASE_TREE_RECURSER_OPTIONS,
  DEFAULT_CURRENT,
  ITreeRecurserOptions,
  ITreeRecurserRecursionOptions,
} from './tree-recurser.interface';

/**
 * Routine that recurses our tree
 */
function _Recurser(
  tree: SyntaxTree,
  current: ITreeRecurserRecursionOptions
): void {
  // process every token
  for (let i = 0; i < tree.length; i++) {
    // check if we should skip
    if (tree[i].name in current.skipTokens) {
      continue;
    }

    // check for cancel
    current.cancel.throwIfCancelled();

    // check if we can populate our parent
    if (tree[i].name in current.allowedGlobalParents) {
      current.globalParent = {
        type: current.allowedGlobalParents[tree[i].name],
        name: GetRoutineName(
          tree[i] as IBranch<
            RoutineProcedureToken | RoutineFunctionToken | MainLevelToken
          >
        ),
        token: tree[i] as TreeBranchToken,
      };
    }

    // skip if before our line and we
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      /**
       * Check if we need to process our branch first
       */
      const branchLast =
        tree[i].name in current.processBranchFirstFor
          ? false
          : tree[i].name in current.processBranchLastFor ||
            !current.processBranchFirst;

      // check if we process our branch
      if (!branchLast) {
        current.exit = current.onBranchToken(
          tree[i] as TreeBranchToken,
          current
        );
      }

      // save the last local parent we encountered
      let lastLocal = current.localParent;
      let lastBefore = current.before;
      let lastAccess = current.accessTokens;

      // update local parent for recursion
      current.localParent = tree[i] as TreeBranchToken;

      // reset before
      current.before = undefined;

      // populate scope
      current.scope.push(tree[i].name as NonBasicTokenNames);
      current.scopeTokens.push(tree[i] as TreeToken<NonBasicTokenNames>);

      // reset access because we are recursing
      current.accessTokens = [];

      // check children
      _Recurser((tree[i] as TreeBranchToken).kids, current);

      // check for exit
      if (current.exit) {
        lastLocal = undefined;
        lastBefore = undefined;
        lastAccess = undefined;
        return;
      }

      // if we did not find what we waned, update the local parent with the value before recursion
      current.localParent = lastLocal;
      current.before = lastBefore;
      current.accessTokens = lastAccess;

      // clean up
      lastLocal = undefined;
      lastBefore = undefined;
      lastAccess = undefined;

      // handle branch token
      if (branchLast) {
        current.exit = current.onBranchToken(
          tree[i] as TreeBranchToken,
          current
        );
      }
    } else {
      // handle branch token
      current.exit = current.onBasicToken(tree[i] as TreeBasicToken, current);
    }

    // check for exit
    if (current.exit) {
      return;
    }

    // save current token as before
    current.before = tree[i];

    // check for access
    if (tree[i].name in current.allowedAccessTokens) {
      // save allowed
      current.accessTokens.push(tree[i]);
    } else {
      // reset since access is over
      current.accessTokens = [];
    }
  }

  // we finished processing a branch or the tree and need to remove an element from the scope
  current.scope.pop();
  current.scopeTokens.pop();
}

/**
 * Based on a syntax tree cursor location, return the token that we
 * have covered.
 */
export function TreeRecurser(
  parsed: IParsed,
  cancel: CancellationToken,
  options: Partial<ITreeRecurserOptions>
) {
  // recurse through the tree
  _Recurser(
    parsed.tree,
    Object.assign(
      copy(BASE_TREE_RECURSER_OPTIONS),
      copy(DEFAULT_CURRENT),
      options,
      { cancel }
    )
  );
}
