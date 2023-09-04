import { CancellationToken } from '@idl/cancellation-tokens';
import copy from 'fast-copy';

import {
  BRANCH_TYPES,
  SyntaxTree,
  TreeBasicToken,
  TreeBranchToken,
} from '../branches.interface';
import {
  BASE_TREE_RECURSER_BASIC_OPTIONS,
  ITreeRecurserBasicOptions,
  ITreeRecurserBasicRecursionOptions,
} from './tree-recurser-basic.interface';

/**
 * Routine that recurses our tree
 */
function _Recurser(
  tree: SyntaxTree,
  current: ITreeRecurserBasicRecursionOptions
): void {
  // process every token
  for (let i = 0; i < tree.length; i++) {
    // check for cancel
    current.cancel.throwIfCancelled();

    // skip if before our line and we
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      // handle branch token
      current.exit = current.onBranchToken(
        tree[i] as TreeBranchToken,
        current.cancel
      );

      // check for exit
      if (current.exit) {
        return;
      }

      // check children if we can
      if (current.recursionFilter !== undefined) {
        if (tree[i].name in current.recursionFilter) {
          _Recurser((tree[i] as TreeBranchToken).kids, current);
        }
      } else {
        _Recurser((tree[i] as TreeBranchToken).kids, current);
      }
    } else {
      // handle branch token
      current.exit = current.onBasicToken(
        tree[i] as TreeBasicToken,
        current.cancel
      );
    }

    // check for exit
    if (current.exit) {
      return;
    }
  }

  return;
}

/**
 * Basic syntax tree recursor that provides a callback if you encounter a branch or
 * a basic token, but no additional information based on where you are
 * or what is around you.
 */
export function TreeRecurserBasic(
  tree: SyntaxTree,
  cancel: CancellationToken,
  options: Partial<ITreeRecurserBasicOptions>
) {
  // recurse through the tree
  _Recurser(
    tree,
    Object.assign(copy(BASE_TREE_RECURSER_BASIC_OPTIONS), options, { cancel })
  );
}
