import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';

import { GlobalIndexedToken } from '../global-index.interface';

/**
 * Given a global token, returns the display name to be shown in the outline in VSCode
 */
export function OutlineDisplayName(token: GlobalIndexedToken): string {
  switch (token.type) {
    case GLOBAL_TOKEN_TYPES.FUNCTION:
      return `${token.meta.display}()`;
    case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD:
      return `${token.meta.display}()`;
    default:
      return token.meta.display;
  }
}
