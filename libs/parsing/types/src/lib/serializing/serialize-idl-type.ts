import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';

import { IDLTypeHelper } from '../idl-type-helper.class';

/**
 * Convert types back to a string for a nice display name
 * for things like hover help and AutoDoc
 */
export function SerializeIDLType(type: IDLDataType, useName = false) {
  // check for any
  if (IDLTypeHelper.isAnyType(type)) {
    return IDL_TYPE_LOOKUP.ANY;
  }

  // remove any duplicate types since we are likely saving
  const reduced = IDLTypeHelper.reduceIDLDataType(type);

  // not any, so do our thing
  let name = '';
  for (let i = 0; i < reduced.length; i++) {
    // add or operator to the name if we have one already
    if (name) {
      name += ' | ';
    }

    // check what we merge together
    switch (true) {
      case !useName:
        name += reduced[i].display;
        break;
      case Array.isArray(reduced[i].value):
        name += reduced[i].value.join(' | ');
        break;
      default:
        name += reduced[i].name;
        break;
    }
  }
  return name;
}
