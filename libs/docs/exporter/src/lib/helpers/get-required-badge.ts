import { IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * Gets a vitepress badge for if a parameter is required or not
 */
export function GetRequiredBadge(prop: IParameterOrPropertyDetails) {
  if (prop.req) {
    return `<Badge type="tip" text="required" />`;
  } else {
    return `<Badge type="info" text="optional" />`;
  }
}
