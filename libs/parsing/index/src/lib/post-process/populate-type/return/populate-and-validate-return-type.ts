import { CancellationToken } from '@idl/cancellation-tokens';
import {
  DocsToMarkdown,
  FindAllBranchChildren,
  IParsed,
  IsWithinBranch,
  MARKDOWN_TYPE_LOOKUP,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { RoutineFunctionToken, TOKEN_NAMES } from '@idl/tokenizer';
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
  token: TreeToken<RoutineFunctionToken>,
  cancel: CancellationToken
): boolean {
  /** Are there docs changes */
  let docsChanges = false;

  // skip tokens without end
  if (!token.end) {
    return docsChanges;
  }

  /**
   * Find functions to process
   */
  const functions = (
    parsed.global.filter(
      (global) =>
        global.type in RETURN_TYPES_FOR && !global.name.endsWith('::init')
    ) as IGlobalIndexedToken<GlobalFunctionMethodToken | GlobalFunctionToken>[]
  ).filter((global) => Object.keys(global.meta.docsLookup).length === 0);

  /**
   * Get names of all function methods (for ::init or class name for new obj)
   */
  const initNames = parsed.global
    .filter((item) => item.type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD)
    .map((item) => item.name);

  /**
   * Do nothing if we have no matches
   */
  if (functions.length === 0) {
    return;
  }

  // process each  function
  for (let i = 0; i < functions.length; i++) {
    // check for cancel
    cancel.throwIfCancelled();

    // get the function we need
    const func = functions[i];

    /**
     * Check if we are a function call for class initialization. This is because we have the init
     * method in our current globals and we add the function call manually
     */
    if (initNames.indexOf(`${func.name}::init`) !== -1) {
      continue;
    }

    // if not inside token, return
    if (
      !IsWithinBranch(
        {
          line: func.pos[0],
          character: func.pos[1],
        },
        token.pos,
        token.end.pos
      )
    ) {
      continue;
    }

    /**
     * Get all places where we call return
     */
    const allTypes: IDLDataType = FindAllBranchChildren(
      token,
      TOKEN_NAMES.CALL_PROCEDURE
    )
      .filter((pro) => pro.match[0].toLowerCase() === 'return')
      .filter((pro) => pro.kids.length > 1)
      .map((pro) => TypeFromTokens(index, parsed, pro.kids))
      .flat();

    /**
     * Skip if we didnt get types from kids
     */
    if (allTypes.length === 0) {
      continue;
    }

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

  return docsChanges;
}
