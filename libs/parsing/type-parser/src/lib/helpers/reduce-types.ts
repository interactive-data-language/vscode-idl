import { IDLDataType, IDLDataTypeBase } from '@idl/types/idl-data-types';

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
    } else {
      /**
       * If existing, see if we have literal values that we need to merge
       */
      if (Array.isArray(type[i].value)) {
        if (Array.isArray(found[type[i].display].value)) {
          // existing array, so concat
          found[type[i].display].value = found[type[i].display].value.concat(
            type[i].value
          );
        }
      }

      /**
       * If existing, see if we have literal values that we need to merge
       */
      if (Array.isArray(found[type[i].display].value)) {
        // existing array, so concat
        if (Array.isArray(type[i].value)) {
          found[type[i].display].value = found[type[i].display].value.concat(
            type[i].value
          );
        } else {
          // if only one has a value, then remove tracked values
          // because we should make it generic
          delete found[type[i].display].value;
        }
      }
    }
  }

  return Object.values(found);
}
