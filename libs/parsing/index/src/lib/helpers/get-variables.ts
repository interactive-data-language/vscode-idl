import {
  GetRoutineName,
  ILocalTokenLookup,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';

import { ITokenCache } from './token-cache.interface';

const IS_PARENT: { [key: string]: any } = {};
IS_PARENT[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
IS_PARENT[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
IS_PARENT[TOKEN_NAMES.MAIN_LEVEL] = true;

/**
 * Get source information for a variable
 *
 * If we don't have a matching variable, returns undefined
 */
export function GetVariables(
  token: TreeToken<TokenName>,
  parsed: IParsed,
  useCache = true
): ILocalTokenLookup {
  if (token.cache) {
    if ('variables' in (token.cache as ITokenCache) && useCache) {
      return (token.cache as ITokenCache).variables;
    }
  }

  const parent =
    token?.name in IS_PARENT ? token : (token?.scopeTokens || [])[0];

  // init variable lookup
  let lookup: ILocalTokenLookup = {};

  // check for parent
  if (parent !== undefined) {
    // extract lookup
    switch (parent.name) {
      case TOKEN_NAMES.ROUTINE_FUNCTION:
        {
          const parentName = GetRoutineName(parent);
          if (parentName in parsed.local.func) {
            lookup = parsed.local.func[parentName];
          }
        }
        break;
      case TOKEN_NAMES.ROUTINE_PROCEDURE:
        {
          const parentName = GetRoutineName(parent);
          if (parentName in parsed.local.pro) {
            lookup = parsed.local.pro[parentName];
          }
        }
        break;
      case TOKEN_NAMES.MAIN_LEVEL:
        lookup = parsed.local.main;
        break;
      default:
        // DO NOTHING
        break;
    }
  }

  if (token.cache) {
    (token.cache as ITokenCache).variables = lookup;
  }
  return lookup;
}
