import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDLDataType } from '@idl/types/idl-data-types';

/**
 * Gets a vitepress badge for data types
 */
export function GetTypeBadge(type: IDLDataType) {
  return `<Badge type="warning" text="type=${IDLTypeHelper.serializeIDLType(
    type,
  )}" />`;
}
