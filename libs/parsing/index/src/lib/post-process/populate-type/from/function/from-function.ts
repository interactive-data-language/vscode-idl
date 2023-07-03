import {
  GLOBAL_TOKEN_TYPES,
  IDL_ANY_TYPE,
  IDLDataType,
  ParseIDLType,
} from '@idl/data-types/core';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { CallFunctionToken } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { IDLIndex } from '../../../../idl-index.class';
import { EvaluateReturnType } from '../helpers/evaluate-return-type';
import { FromENVIOrIDLTask } from './functions/envi-idl-task';
import { FromObjNew } from './functions/obj-new';

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

  // special cases to overload the type that we check for
  switch (name) {
    case 'envitask':
      name = FromENVIOrIDLTask(index, parsed, token, 'ENVI') || 'ENVITask';
      returnNameAsType = true;
      break;
    case 'idltask':
      name = FromENVIOrIDLTask(index, parsed, token, 'IDL') || 'IDLTask';
      returnNameAsType = true;
      break;
    case 'obj_new':
      name = FromObjNew(token);
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

  // TODO: revisit this
  // check if we should directly return our parsed name, even if we don't have it
  // in our global lookup (mostly for tasks or other object classes)
  if (returnNameAsType) {
    return ParseIDLType(name);
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
