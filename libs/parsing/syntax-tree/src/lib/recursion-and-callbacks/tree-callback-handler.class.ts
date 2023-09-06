import { CancellationToken } from '@idl/cancellation-tokens';
import {
  BasicTokenNames,
  NonBasicTokenNames,
  TokenName,
} from '@idl/parsing/tokenizer';

import { ITreeRecurserOptions, TreeToken } from '../..';
import { IParsed } from '../build-syntax-tree.interface';
import {
  BasicCallback,
  BasicCallbackLookup,
  BranchCallback,
  BranchCallbackLookup,
  IHandlerCallbackMetadata,
  TreeCallback,
  TreeCallbackArgs,
  TreeCallbackLookup,
} from './tree-callback-handler.interface';
import { TreeCallbackRunner } from './tree-callback-runner';

/**
 * Class designed to add and execute on callbacks for given tokens
 * when they are found and we recurse through a syntax tree
 */
export class TreeCallbackHandler<TMeta extends IHandlerCallbackMetadata> {
  /**
   * Callbacks for basic tokens, organized by token name
   */
  private basic: BasicCallbackLookup<TMeta> = {};

  /**
   * Callbacks for branches, organized by token name
   */
  private branch: BranchCallbackLookup<TMeta> = {};

  /**
   * Callbacks for entire syntax trees
   */
  private tree: TreeCallbackLookup<TMeta> = [];

  /**
   * Controls recursion if we dive into children before processing parents
   * which is the default
   */
  recursionOptions: Partial<ITreeRecurserOptions> = {
    processBranchFirst: false,
  };

  constructor(recursionOptions: Partial<ITreeRecurserOptions> = {}) {
    Object.assign(this.recursionOptions, recursionOptions);
  }

  /**
   * Add a callback for basic tokens
   */
  onBasicToken<T extends BasicTokenNames>(
    token: T,
    callback: BasicCallback<T, TMeta>
  ) {
    // add if we are not tracking already
    if (!(token in this.basic)) {
      this.basic[token] = [];
    }

    // save callback
    this.basic[token].push(callback);
  }

  /**
   * Execute all callbacks for basic token
   */
  processBasicToken<T extends BasicTokenNames>(
    token: TreeToken<T>,
    parsed: IParsed,
    cb: () => TMeta
  ) {
    // process if we have validators
    if (token.name in this.basic) {
      const meta = cb();
      const cbs = this.basic[token.name];
      for (let i = 0; i < cbs.length; i++) {
        cbs[i](token, parsed, meta);
      }
    }
  }

  /**
   * Add a callback for branch tokens
   */
  onBranchToken<T extends NonBasicTokenNames>(
    token: T,
    callback: BranchCallback<T, TMeta>
  ) {
    // add if we are not tracking already
    if (!(token in this.branch)) {
      this.branch[token] = [];
    }

    // save callback
    this.branch[token].push(callback);
  }

  /**
   * Pre-process a branch token
   */
  processBranchToken<T extends NonBasicTokenNames>(
    token: TreeToken<T>,
    parsed: IParsed,
    cb: () => TMeta
  ) {
    // process if we have validators
    if (token.name in this.branch) {
      const meta = cb();
      const cbs = this.branch[token.name];
      for (let i = 0; i < cbs.length; i++) {
        cbs[i](token, parsed, meta);
      }
    }
  }

  /**
   * Add a callback for the syntax tree
   */
  onTree(callback: TreeCallback<TMeta>) {
    this.tree.push(callback);
  }

  /**
   * Process the complete syntax tree
   */
  processTree(...args: TreeCallbackArgs<TMeta>) {
    for (let i = 0; i < this.tree.length; i++) {
      this.tree[i](...args);
    }
  }

  /**
   * Loop through our tree and execute/run all of our callbacks
   */
  run(
    parsed: IParsed,
    cancel: CancellationToken,
    cb: (token: TreeToken<TokenName>, meta: IHandlerCallbackMetadata) => TMeta
  ) {
    TreeCallbackRunner(this, parsed, cancel, cb);
  }
}
