import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

import { GetRoutine } from '../../helpers/get-routine';
import { IDLIndex } from '../../idl-index.class';

/**
 * Returns hover help for a routine that is being called
 *
 * Specifically, it is tokens in our code such as call procedure  or call
 * function
 */
export function GetRoutineHoverHelp(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<TokenName>
): string {
  /** Find global token */
  const global = GetRoutine(index, parsed, token, false);

  // return docs if we found it
  if (global.length > 0) {
    return global[0].meta.docs;
  }

  // /**
  //  * Handle other cases with advanced logic
  //  */
  // switch (true) {
  //   // found global tokens so return first matching docs
  //   case global.length > 0:
  //     // return 'in global';
  //     return global[0].meta.docs;

  //   // if no match, and a method, search for it
  //   case type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD ||
  //     type === GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD: {
  //     // get the term we will search for, used for filtering below
  //     const searchFor = `::${(name.includes('::') ? name.split('::')[1] : name)
  //       .trim()
  //       .toLowerCase()}`;

  //     // search and apply custom filtering that makes sure we have an
  //     // exact method match and not partial
  //     const searchedGlobal = index
  //       .searchGlobalTokens(type, searchFor)
  //       .filter((found) => found.name.endsWith(searchFor));

  //     // return if we have results
  //     if (searchedGlobal.length > 0) {
  //       return searchedGlobal[0].meta.docs;
  //     }
  //     break;
  //   }
  //   default:
  //     break;
  // }

  // return empty string by default
  return '';
}
