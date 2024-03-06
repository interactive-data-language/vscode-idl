import { IDLDataType, SerializeIDLType } from '@idl/types/core';

/**
 * Gets a vitepress badge for function return
 */
export function GetReturnsBadge(type: IDLDataType) {
  return `<Badge type="warning" text="${SerializeIDLType(type)}" />`;
}
