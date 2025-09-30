import { IDLDataType, IDLDataTypeBase } from '@idl/types/idl-data-types';

/**
 * Takes an IDL data type and reduces it to remove any duplicate types
 */
export function ReduceIDLDataType(type: IDLDataType): IDLDataType {
  // track what we have found
  const found: { [key: string]: IDLDataTypeBase<string> } = {};

  // process each type
  for (let i = 0; i < type.length; i++) {
    if (!(type[i].name in found)) {
      found[type[i].name] = type[i];

      // recursively reduce type args
      for (let j = 0; j < type[i].args.length; j++) {
        type[i].args[j] = ReduceIDLDataType(type[i].args[j]);
      }
    } else {
      /**
       * If existing, see if we have literal values that we need to merge
       */
      if (Array.isArray(found[type[i].name].value)) {
        // existing array, so concat
        if (Array.isArray(type[i].value)) {
          found[type[i].name].value = found[type[i].name].value.concat(
            ...type[i].value
          );
        } else {
          // if only one has a value, then remove tracked values
          // because we should make it generic
          delete found[type[i].name].value;
        }
      }
    }
  }

  return Object.values(found);
}
