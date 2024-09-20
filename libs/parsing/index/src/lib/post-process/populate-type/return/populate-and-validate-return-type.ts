import { CancellationToken } from '@idl/cancellation-tokens';
import {
  DocsToMarkdown,
  FindAllBranchChildren,
  IParsed,
  IsWithinBranch,
  MARKDOWN_TYPE_LOOKUP,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  IDLDataType,
  IDLTypeHelper,
  IGlobalIndexedToken,
} from '@idl/types/core';

import { IDLIndex } from '../../../idl-index.class';
import { TypeFromTokens } from '../from/type-from-tokens';

/**
 * What global tokens do we try and get return types for
 */
const RETURN_TYPES_FOR: { [key: string]: undefined } = {};
RETURN_TYPES_FOR[GLOBAL_TOKEN_TYPES.FUNCTION] = undefined;
RETURN_TYPES_FOR[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = undefined;

/**
 * Populates the return type for functions
 */
export function PopulateAndValidateReturnType(
  index: IDLIndex,
  parsed: IParsed,
  cancel: CancellationToken
): boolean {
  /** Are there docs changes */
  let docsChanges = false;

  /**
   * Find functions to process
   */
  const functions = (
    parsed.global.filter(
      (global) =>
        global.type in RETURN_TYPES_FOR && !global.name.endsWith('::init')
    ) as IGlobalIndexedToken<GlobalFunctionToken | GlobalFunctionMethodToken>[]
  ).filter((global) => Object.keys(global.meta.docsLookup).length === 0);

  /**
   * Do nothing if we have no matches
   */
  if (functions.length === 0) {
    return;
  }

  /**
   * Find tokens to compare against
   */
  const tokens = parsed.tree.filter(
    (item) => item.name === TOKEN_NAMES.ROUTINE_FUNCTION
  );

  // process each  function
  for (let i = 0; i < functions.length; i++) {
    // check for cancel
    cancel.throwIfCancelled();

    // get the function we need
    const func = functions[i];

    // process tokens to find matching function definition
    for (let j = 0; j < tokens.length; j++) {
      // skip tokens without end
      if (!tokens[j].end) {
        continue;
      }

      // if not inside token, return
      if (
        !IsWithinBranch(
          {
            line: func.pos[0],
            character: func.pos[1],
          },
          tokens[j].pos,
          tokens[j].end.pos
        )
      ) {
        continue;
      }

      /**
       * Get all places where we call return
       */
      const allTypes: IDLDataType = FindAllBranchChildren(
        tokens[j],
        TOKEN_NAMES.CALL_PROCEDURE
      )
        .filter((pro) => pro.match[0].toLowerCase() === 'return')
        .map((pro) => TypeFromTokens(index, parsed, pro.kids))
        .flat();

      // reduce type
      const reduced = IDLTypeHelper.reduceIDLDataType(allTypes);

      // update type
      func.meta.returns = reduced;

      // update docs to show type
      func.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
        meta: func.meta,
        name: func.meta.display,
      });

      // update flag
      docsChanges = true;

      // found our token, so stop
      break;
    }
  }

  return docsChanges;
}
