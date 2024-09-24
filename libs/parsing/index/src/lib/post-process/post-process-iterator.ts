import './tree-handlers/populate-type';
import './tree-handlers/validate-type';

import { CancellationToken } from '@idl/cancellation-tokens';
import {
  ILocalTokenLookup,
  IParsed,
  ITreeRecurserOptions,
  TreeBranchToken,
  TreeRecurser,
} from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../idl-index.class';
import { RECURSE_INTO } from './post-process-iterator.interface';
import { POPULATE_TYPE_HANDLER } from './tree-handlers/populate-type-handler';
import { SetVariables } from './tree-handlers/set-variables';
import { VALIDATE_TYPE_HANDLER } from './tree-handlers/validate-type-handler';
import { ValidateVariableUsage } from './tree-handlers/validate-variable-usage';

/**
 * Apply post-processing to a parsed file
 *
 * This uses a structured approach which allows for more flexibility in injecting
 * custom steps to the process
 *
 * This iterator loops through top-level tokens and only recurses into functions,
 * procedures, and main level programs.
 *
 * Some regression tests change because we dont process all tokens which is
 * OK (code after main, or before routine definitions).
 */
export function PostProcessIterator(
  index: IDLIndex,
  file: string,
  parsed: IParsed,
  cancel: CancellationToken
) {
  // init variables
  const variables: ILocalTokenLookup = {};

  /** Base metadata */
  const baseMeta = { variables, index, file };

  /**
   * Loop through top-level tokens
   */
  for (let i = 0; i < parsed.tree.length; i++) {
    /** Get token from tree */
    const topToken = parsed.tree[i];

    /**
     * If we have a routine token, get and update variables
     */
    if (topToken.name in RECURSE_INTO) {
      // update variables that we are tracking
      SetVariables(topToken.scopeTokens[0] || topToken, parsed, variables);

      const populateOps: Partial<ITreeRecurserOptions> = {
        onBasicToken: (token, current) => {
          POPULATE_TYPE_HANDLER.processBasicToken(
            token,
            parsed,
            current,
            baseMeta
          );
        },
        onBranchToken: (token, current) => {
          POPULATE_TYPE_HANDLER.processBranchToken(
            token,
            parsed,
            current,
            baseMeta
          );
        },
      };

      /**
       * Populate type
       */
      TreeRecurser(
        (topToken as TreeBranchToken)?.kids || [],
        cancel,
        Object.assign(POPULATE_TYPE_HANDLER.recursionOptions, populateOps)
      );

      const validateOpts: Partial<ITreeRecurserOptions> = {
        onBasicToken: (token, current) => {
          VALIDATE_TYPE_HANDLER.processBasicToken(
            token,
            parsed,
            current,
            baseMeta
          );
        },
        onBranchToken: (token, current) => {
          VALIDATE_TYPE_HANDLER.processBranchToken(
            token,
            parsed,
            current,
            baseMeta
          );
        },
      };
      /**
       * Validate type
       */
      TreeRecurser(
        (topToken as TreeBranchToken)?.kids || [],
        cancel,
        Object.assign(VALIDATE_TYPE_HANDLER.recursionOptions, validateOpts)
      );

      // make sure variables are used right
      ValidateVariableUsage(parsed, variables);
    }
  }

  /**
   * Process the whole tree
   */
  POPULATE_TYPE_HANDLER.processTree(parsed.tree, parsed, baseMeta);

  /**
   * Process the whole tree
   */
  VALIDATE_TYPE_HANDLER.processTree(parsed.tree, parsed, baseMeta);
}
