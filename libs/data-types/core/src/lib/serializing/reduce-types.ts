import { IDLDataType, IDLDataTypeBase } from '../idl-data-types.interface';

/**
 * Takes an IDL data type and reduces it to remove any duplicate types
 */
export function ReduceIDLDataType(type: IDLDataType): IDLDataType {
  // return original if we dont have anything to reduce
  if (type.length < 2) {
    return type;
  }

  // track what we have found
  const found: { [key: string]: IDLDataTypeBase<string> } = {};

  // process each type
  for (let i = 0; i < type.length; i++) {
    if (!(type[i].display in found)) {
      found[type[i].display] = type[i];
    }
  }

  return Object.values(found);
}
