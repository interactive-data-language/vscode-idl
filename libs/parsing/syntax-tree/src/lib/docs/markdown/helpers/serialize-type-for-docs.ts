import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDLDataType } from '@idl/types/idl-data-types';

/**
 * Serializes a type for documentation and escapes the alligators
 */
export function SerializeTypeForDocs(type: IDLDataType) {
  return IDLTypeHelper.serializeIDLType(type)
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}
