import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDLDataType } from '@idl/types/idl-data-types';

/**
 * Gets a vitepress badge for function return
 */
export function GetReturnsBadge(type: IDLDataType) {
  return `<Badge type="warning" text="${IDLTypeHelper.serializeIDLType(
    type,
  )}" />`;
}
