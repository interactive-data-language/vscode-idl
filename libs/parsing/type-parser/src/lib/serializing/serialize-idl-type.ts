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

    /**
     * Merge back together
     *
     * If we have values, use those, because we parse them to get back
     * to exactly what we had before
     *
     * If we dont have values, then check input flag for whether we
     * use the display or normal name
     */
    if (Array.isArray(reduced[i].value)) {
      name += reduced[i].value.join(' | ');
    } else {
      name += !useName ? reduced[i].display : reduced[i].name;
    }
  }
  return name;
}
