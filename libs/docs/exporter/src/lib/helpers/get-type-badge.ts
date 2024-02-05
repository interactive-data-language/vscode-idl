import { IDLDataType, SerializeIDLType } from '@idl/types/core';

/**
 * Gets a vitepress badge for data types
 */
export function GetTypeBadge(type: IDLDataType) {
  return `<Badge type="warning" text="type=${SerializeIDLType(type)}" />`;
}
