import {
  GetNextInBranch,
  ILocalIndexedToken,
  LocalVariableToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, VariableToken } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES, ParseIDLType } from '@idl/types/core';

import { IDLIndex } from '../../../../idl-index.class';

/**
 * Which tokens can come come next to indicate that we have
 */
const NEXT_TOKENS: { [key: string]: any } = {};
NEXT_TOKENS[TOKEN_NAMES.DOT] = true;
NEXT_TOKENS[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
NEXT_TOKENS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;
NEXT_TOKENS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
NEXT_TOKENS[TOKEN_NAMES.ACCESS_PROPERTY] = true;

/**
 * Check if we can determine data type from static reference
 */
export function EvaluateStaticReference(
  index: IDLIndex,
  source: ILocalIndexedToken<LocalVariableToken>,
  token: TreeToken<VariableToken>
) {
  /**
   * Get the next token
   */
  const next = GetNextInBranch(token);

  // return if there is not a token next to us
  if (next === undefined) {
    return;
  }

  // return if we dont have an allowed token afterwards
  if (!(next?.name in NEXT_TOKENS)) {
    return;
  }

  /**
   * Check for matching structure
   */
  const structs = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    source.name
  );

  // save if we have one
  if (structs.length > 0) {
    source.meta.type = ParseIDLType(structs[0].meta.display);
    source.meta.isDefined = true;
    source.meta.isStaticClass = true;
    source.meta.docs = `${IDL_TRANSLATION.lsp.types.staticReference} "${structs[0].meta.display}"`;
  }
}
