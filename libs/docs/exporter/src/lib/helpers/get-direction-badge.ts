import { IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * Gets a vitepress badge for the direction of a parameter
 */
export function GetDirectionBadge(prop: IParameterOrPropertyDetails) {
  switch (prop.direction) {
    case 'in':
      return `<Badge type="info" text="input" />`;
    case 'out':
      return `<Badge type="info" text="output" />`;
    default:
      return `<Badge type="info" text="in or out" />`;
  }
}
