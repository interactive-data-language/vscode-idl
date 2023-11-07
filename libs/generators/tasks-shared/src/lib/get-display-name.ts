import { capitalCase } from 'case-anything';

/**
 * Gets the display name from text for a task name or parameter display name
 */
export function GetDisplayName(text: string) {
  return capitalCase(text).replace(/_/gim, ' ');
}
