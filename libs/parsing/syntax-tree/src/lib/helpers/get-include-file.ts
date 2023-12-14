import { IncludeToken } from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';

/**
 * Gets the lower-case filename that we are including
 */
export function GetIncludeFile(token: TreeToken<IncludeToken>) {
  return token.match[0].substring(1).toLowerCase();
}
