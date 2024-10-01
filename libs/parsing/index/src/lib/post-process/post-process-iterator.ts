import './tree-handlers/populate-type.index';
import './tree-handlers/validate-type.index';

import { CancellationToken } from '@idl/cancellation-tokens';
import {
  FindDirectBranchChildren,
  ILocalTokenLookup,
  IParsed,
  ITreeRecurserOptions,
  TreeBranchToken,
  TreeRecurser,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { GetMethod } from '../helpers/get-method';
import { IDLIndex } from '../idl-index.class';
import { PopulateAndValidateReturnType } from './populate-type/return/populate-and-validate-return-type';
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
): boolean {
  // init variables
  const variables: ILocalTokenLookup = {};

  /** Base metadata */
  const baseMeta = { variables, index, file };

  /** Track if docs change */
  let docsChanges = false;

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

      /**
       * Callbacks for populating types
       */
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

      /**
       * Callbacks for validating data types
       */
      const validateOpts: Partial<ITreeRecurserOptions> = {
        onBasicToken: (token, current) => {
          VALIDATE_TYPE_HANDLER.processBasicToken(
            token,
            parsed,
            current,
            baseMeta
          );

          /**
           * Track which global tokens we use
           */
          switch (token.name) {
            case TOKEN_NAMES.SYSTEM_VARIABLE:
              parsed.uses[GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE][
                token.match[0].toLowerCase()
              ] = true;
              break;
            default:
              break;
          }
        },
        onBranchToken: (token, current) => {
          VALIDATE_TYPE_HANDLER.processBranchToken(
            token,
            parsed,
            current,
            baseMeta
          );

          /**
           * Track which global tokens we use
           */
          switch (token.name) {
            case TOKEN_NAMES.CALL_FUNCTION:
              parsed.uses[GLOBAL_TOKEN_TYPES.FUNCTION][
                token.match[1].toLowerCase()
              ] = true;
              break;
            case TOKEN_NAMES.CALL_PROCEDURE:
              parsed.uses[GLOBAL_TOKEN_TYPES.PROCEDURE][
                token.match[0].toLowerCase()
              ] = true;
              break;
            case TOKEN_NAMES.CALL_FUNCTION_METHOD:
              {
                const methods = GetMethod(index, parsed, token);
                if (methods.length > 0) {
                  parsed.uses[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD][
                    methods[0].name
                  ] = true;
                }
              }
              break;
            case TOKEN_NAMES.CALL_PROCEDURE_METHOD:
              {
                const methods = GetMethod(index, parsed, token);
                if (methods.length > 0) {
                  parsed.uses[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD][
                    methods[0].name
                  ] = true;
                }
              }
              break;
            case TOKEN_NAMES.STRUCTURE: {
              const names = FindDirectBranchChildren(
                token,
                TOKEN_NAMES.STRUCTURE_NAME
              );
              if (names.length > 0) {
                parsed.uses[GLOBAL_TOKEN_TYPES.STRUCTURE][
                  names[0].match[0].toLowerCase()
                ] = true;
              }
              break;
            }
            default:
              break;
          }
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

      /**
       * Check usage of variables for the routine we are in
       */
      ValidateVariableUsage(parsed, variables);

      /**
       * Populate return type
       */
      if (topToken.name === TOKEN_NAMES.ROUTINE_FUNCTION) {
        docsChanges =
          PopulateAndValidateReturnType(index, parsed, topToken, cancel) ||
          docsChanges;
      }
    }
  }

  /**
   * Execute callbacks for type population that need the whole tree
   */
  POPULATE_TYPE_HANDLER.processTree(parsed.tree, parsed, baseMeta);

  /**
   * Execute callbacks for type validation that need the whole tree
   */
  VALIDATE_TYPE_HANDLER.processTree(parsed.tree, parsed, baseMeta);

  // return flag if docs have changed or not
  return docsChanges;
}
