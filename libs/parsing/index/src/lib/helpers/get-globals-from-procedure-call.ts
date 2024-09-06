import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallProcedureToken } from '@idl/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalIndexedRoutineToken,
  IDL_TYPE_LOOKUP,
} from '@idl/types/core';

import { IDLIndex } from '../idl-index.class';
import { TypeFromFirstArg } from '../post-process/populate-type/from/helpers/type-from-first-arg';

/**
 * Given a function we are calling, get the routine name
 */
export function GetGlobalsFromProcedureCall(
  index: IDLIndex,
  parsed: IParsed,
  local: TreeToken<CallProcedureToken>
): GlobalIndexedRoutineToken[] {
  // procedure name
  const proName = local.match[0].toLowerCase();

  /**
   * Init value for global routine
   */
  let global: GlobalIndexedRoutineToken[] = [];

  switch (true) {
    case proName === 'obj_destroy': {
      let type = TypeFromFirstArg(index, parsed, local);
      if (!type || type === IDL_TYPE_LOOKUP.ANY) {
        type = undefined;
      }

      // if we have a type, search
      if (type !== undefined) {
        global = index.findMatchingGlobalToken(
          GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD,
          `${type}::cleanup`
        );
      }

      // default to procedure if we dont know
      if (global.length === 0) {
        global = index.findMatchingGlobalToken(
          GLOBAL_TOKEN_TYPES.PROCEDURE,
          proName
        );
      }
      break;
    }
    case proName === 'call_procedure': {
      let type = TypeFromFirstArg(index, parsed, local);
      if (!type || type === IDL_TYPE_LOOKUP.ANY) {
        type = undefined;
      }

      global = index.findMatchingGlobalToken(
        GLOBAL_TOKEN_TYPES.PROCEDURE,
        type !== undefined ? type : proName
      );
      break;
    }
    default:
      global = index.findMatchingGlobalToken(
        GLOBAL_TOKEN_TYPES.PROCEDURE,
        proName
      );
      break;
  }

  return global;
}
