import { IParsed } from '@idl/parsing/syntax-tree';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalProcedureToken,
  IGlobalIndexedToken,
} from '@idl/types/core';

/**
 * Given a filename and a parsed file, attempts to find a matching procedure
 * definition that we can use to create a task definition from
 *
 * If nothing is found, we return `undefined`
 */
export function GetProcedure(filename: string, parsed: IParsed) {
  const global = parsed.global;
  for (let i = 0; i < global.length; i++) {
    if (
      global[i].type === GLOBAL_TOKEN_TYPES.PROCEDURE &&
      global[i].name === filename
    ) {
      return global[i] as IGlobalIndexedToken<GlobalProcedureToken>;
    }
  }
  return undefined;
}
