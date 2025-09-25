import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/tokenizer';
import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDLDataType,
  ParseIDLType,
} from '@idl/types/core';
import copy from 'fast-copy';

import { IDLIndex } from '../../../../idl-index.class';
import { EvaluateReturnType } from '../helpers/evaluate-return-type';
import { TypeFromCallFunction } from './functions/type-from-call-function';
import { TypeFromObjNew } from './functions/type-from-obj-new';
import { TypeFromTask } from './functions/type-from-task';

/**
 * Attempts to determine the type when we have assignment
 */
export function TypeFromFunction(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<CallFunctionToken>
): IDLDataType {
  /** Function name */
  let name = token.match[1].toLowerCase();

  /** Flag to return the type we parsed from special functions */
  let returnNameAsType = false;

  /** Track if we were an ENVI task */
  let wasENVITask = false;

  /** Track if we were an IDL task */
  let wasIDLTask = false;

  // special cases to overload the type that we check for
  switch (name) {
    case 'call_function':
      name = TypeFromCallFunction(index, parsed, token) || name;
      break;
    case 'envitask':
      name = TypeFromTask(index, parsed, token, 'ENVI') || 'ENVITask';
      wasENVITask = true;
      returnNameAsType = true;
      break;
    case 'idltask':
      name = TypeFromTask(index, parsed, token, 'IDL') || 'IDLTask';
      wasIDLTask = true;
      returnNameAsType = true;
      break;
    case 'obj_new':
      name = TypeFromObjNew(index, parsed, token);
      returnNameAsType = true;
      break;
    default:
  }

  // first, check for structure
  const structure = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.STRUCTURE,
    name
  );

  // if we have a structure with that name, mark as the type
  if (structure.length > 0) {
    return ParseIDLType(structure[0].meta.display);
  }

  /**
   * If we don't know about the task, then we should just return a generic Task Object
   * or load the type from the name
   */
  if (returnNameAsType) {
    switch (true) {
      case wasENVITask:
        return ParseIDLType(`ENVITask<any>`);
      case wasIDLTask:
        return ParseIDLType(`IDLTask<any>`);
      default:
        return ParseIDLType(name);
    }
  }

  // check for function in our index
  const functions = index.findMatchingGlobalToken(
    GLOBAL_TOKEN_TYPES.FUNCTION,
    name
  );

  // check if we found a function
  if (functions.length > 0) {
    return copy(EvaluateReturnType(index, parsed, token, functions[0]));
  }

  // default return value
  return copy(IDL_ANY_TYPE);
}
