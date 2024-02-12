import { IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * Gets a vitepress badge for the direction of a parameter
 */
export function GetDirectionBadge(prop: IParameterOrPropertyDetails) {
  switch (prop.direction) {
    case 'in':
      return `<Badge type="info" text="direction=in" />`;
    case 'out':
      return `<Badge type="info" text="direction=out" />`;
    default:
      return `<Badge type="info" text="direction=in/out" />`;
  }
}
