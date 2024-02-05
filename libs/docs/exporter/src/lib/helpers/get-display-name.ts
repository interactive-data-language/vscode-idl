import { GlobalIndexedToken } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

/**
 * Gets display names for the tops of markdown files
 */
export function GetDisplayName(item: GlobalIndexedToken): string {
  switch (true) {
    /**
     * Functions
     */
    case item.type === GLOBAL_TOKEN_TYPES.FUNCTION ||
      item.type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
      return `${item.meta.display}()`;
    default:
      return item.meta.display;
  }
}
