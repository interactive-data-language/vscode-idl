import { IDL_TYPE_LOOKUP, IDLDataType } from '../idl-data-types.interface';
import { IDLTypeHelper } from '../idl-type-helper.class';

/**
 * Convert types back to a string for a nice display name
 * for things like hover help and AutoDoc
 */
export function SerializeIDLType(type: IDLDataType) {
  // check for any
  if (IDLTypeHelper.isAnyType(type)) {
    return IDL_TYPE_LOOKUP.ANY;
  }

  // remove any duplicate types since we are likely saving
  const reduced = IDLTypeHelper.reduceIDLDataType(type);

  // not any, so do our thing
  let name = '';
  for (let i = 0; i < reduced.length; i++) {
    if (i > 0) {
      name += ' | ';
    }
    name += reduced[i].display;
  }
  return name;
}
