import { TokenName } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { TreeToken } from '../branches.interface';
import { IParsed } from '../build-syntax-tree.interface';
import {
  ILocalIndexedToken,
  ILocalTokenLookup,
  LocalTokenTypes,
} from '../populators/populate-local.interface';
import { IParentInformation } from './selected-token.interface';

/**
 * Returns source information for a variable that we are hovering over.
 *
 * This needs to know the parent token so we can find lookups for
 * procedures, functions, or main level programs which contain the local
 * variables.
 */
export function GetVariableTokenDef(
  parsed: IParsed,
  token: TreeToken<TokenName>,
  parent?: IParentInformation
): ILocalIndexedToken<LocalTokenTypes> | undefined {
  // initialize our result
  let foundToken: ILocalIndexedToken<LocalTokenTypes>;

  // return if we dont actually have a parent
  if (parent === undefined) {
    return foundToken;
  }

  // check for parent
  if (parent !== undefined) {
    const varName = token.match[0].toLowerCase();
    const parentName = parent.name;

    // init variable lookup
    let lookup: ILocalTokenLookup = {};

    // extract lookup
    switch (parent.type) {
      case 'function':
        if (parentName in parsed.local.func) {
          lookup = parsed.local.func[parentName];
        }
        break;
      case 'procedure':
        if (parentName in parsed.local.pro) {
          lookup = parsed.local.pro[parentName];
        }
        break;
      case 'main':
        lookup = parsed.local.main;
        break;
      default:
        // DO NOTHING
        break;
    }

    // check for matching variable and set docs
    if (varName in lookup) {
      foundToken = copy(lookup[varName]);
    }
  }

  return foundToken;
}
