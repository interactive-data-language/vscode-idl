import {
  ILocalIndexedToken,
  IParsed,
  LocalVariableToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { VariableToken } from '@idl/parsing/tokenizer';

import { GetVariables } from './get-variables';

/**
 * Get source information for a variable
 *
 * If we don't have a matching variable, returns undefined
 */
export function GetVariable(
  token: TreeToken<VariableToken>,
  parsed: IParsed
): ILocalIndexedToken<LocalVariableToken> | undefined {
  return GetVariables(token, parsed)[token.match[0].toLowerCase()];
}
