import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/tokenizer';
import { IDLTypeHelper } from '@idl/types/core';

import { IDLIndex } from '../../../../idl-index.class';
import { EvaluateToken } from '../../evaluate/evaluate-token';
import { TypeFromVariable } from '../type-from-variable';

/**
 * Gets the type of a token from variables or by literally interpreting
 * a token that is present (i.e. string)
 *
 * Returns undefined if no value is found (or if any type is detected)
 */
export function EvaluateVariableOrToken(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<TokenName>
): string | undefined {
  // check what our kid is
  switch (token.name) {
    case TOKEN_NAMES.VARIABLE: {
      const type = TypeFromVariable(index, parsed, token);
      if (!IDLTypeHelper.isAnyType(type)) {
        return type[0].value ? type[0].value : type[0].display;
      }
      return undefined;
    }
    default:
      return EvaluateToken(token);
  }
}
