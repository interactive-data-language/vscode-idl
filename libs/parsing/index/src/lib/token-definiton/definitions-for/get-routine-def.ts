import { GLOBAL_TOKEN_TYPES, GlobalTokenType } from '@idl/data-types/core';

import { GlobalIndexedToken } from '../../global-index.interface';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns all matching global tokens given search criteria. Always returns an
 * array and, if zero-length, there are no matches
 *
 * Specifically, it is tokens in our code such as call procedure  or call
 * function
 *
 * @deprecated
 */
export function GetRoutineDef(
  index: IDLIndex,
  type: GlobalTokenType,
  name: string
): GlobalIndexedToken[] {
  // check for global token first
  let global = index.findMatchingGlobalToken(type, name);

  // check for init method
  if (global.length === 0 && type === GLOBAL_TOKEN_TYPES.FUNCTION) {
    global = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.FUNCTION_METHOD,
      `${name}::init`
    );
  }

  // determine how to proceed
  switch (true) {
    // found global tokens so return first matching docs
    case global.length > 0:
      // return 'in global';
      return global;

    // no global tokens, so lets search our routine docs
    default:
      // do nothing
      // switch (type) {
      //   case GLOBAL_TOKEN_LOOKUP.FUNCTION:
      //     return index.help.getHelp('function', name);
      //   case GLOBAL_TOKEN_LOOKUP.FUNCTION_METHOD:
      //     return index.help.getHelp('function', `::${name}`);
      //   case GLOBAL_TOKEN_LOOKUP.PROCEDURE:
      //     return index.help.getHelp('procedure', name);
      //   case GLOBAL_TOKEN_LOOKUP.PROCEDURE_METHOD:
      //     return index.help.getHelp('procedure', `::${name}`);
      //   default:
      //     break;
      // }
      break;
  }

  return [];
}
