import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalIndexedRoutineToken,
  IDL_TYPE_LOOKUP,
} from '@idl/types/core';

import { IDLIndex } from '../idl-index.class';
import { TypeFromCallFunction } from '../post-process/populate-type/from/function/functions/type-from-call-function';
import { TypeFromObjNew } from '../post-process/populate-type/from/function/functions/type-from-obj-new';
import { TypeFromTask } from '../post-process/populate-type/from/function/functions/type-from-task';

/**
 * Given a function we are calling, get the routine name
 */
export function GetGlobalsFromFunctionCall(
  index: IDLIndex,
  parsed: IParsed,
  local: TreeToken<CallFunctionToken>
): GlobalIndexedRoutineToken[] {
  /** The thing we search for */
  let findThis = local.match[1].toLowerCase();

  switch (true) {
    case findThis === 'obj_new': {
      /** Get the class that is being initialized */
      const className = TypeFromObjNew(index, parsed, local);

      // if the class is not "any" then use that as the function
      // or init method
      if (className !== IDL_TYPE_LOOKUP.ANY) {
        findThis = className;
      }
      break;
    }
    case findThis === 'call_function': {
      const functionName = TypeFromCallFunction(index, parsed, local);
      if (functionName) {
        findThis = functionName;
      }
      break;
    }
    case findThis === 'envitask' || findThis === 'idltask': {
      /** Get the class that is being initialized */
      const className = TypeFromTask(
        index,
        parsed,
        local,
        findThis === 'envitask' ? 'ENVI' : 'IDL'
      );

      // if the class is not "any" then use that as the function
      // or init method
      if (className !== IDL_TYPE_LOOKUP.ANY) {
        findThis = className;
      }
      break;
    }
    default:
      break;
  }

  /**
   * Init value for global routine
   */
  let global: GlobalIndexedRoutineToken[] = [];

  // check for matching global token
  global = index.findMatchingGlobalToken(GLOBAL_TOKEN_TYPES.FUNCTION, findThis);

  // check for init method
  if (global.length === 0) {
    global = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.FUNCTION_METHOD,
      `${findThis}::init`
    );
  }

  return global;
}
