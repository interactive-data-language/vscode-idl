import { IDLDataType, SerializeIDLType } from '@idl/types/core';

/**
 * Make the display name for properties be a little nicer
 */
export function GetPropertyDisplayName(name: string, type?: IDLDataType) {
  if (type !== undefined) {
    if (name.toUpperCase() === name) {
      return `${SerializeIDLType(type)}.${name.toLowerCase()}`;
    } else {
      return `${SerializeIDLType(type)}.${name}`;
    }
  } else {
    if (name.toUpperCase() === name) {
      return name.toLowerCase();
    } else {
      return name;
    }
  }
}
