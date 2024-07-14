import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { TreeBranchToken } from '../branches.interface';
import { IParsed } from '../parsed.interface';
import { ILocalTokenLookup } from '../populators/populate-local.interface';
import { GetRoutineName } from './get-routine-name';

/**
 * Get variables for parent token
 */
export function GetLocalTokenLookup(
  parsed: IParsed,
  parent?: TreeBranchToken
): ILocalTokenLookup {
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

  return lookup;
}
