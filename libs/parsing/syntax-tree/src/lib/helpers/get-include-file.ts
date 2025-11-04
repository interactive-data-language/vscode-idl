import { IncludeToken } from '@idl/tokenizer';
import { TreeToken } from '@idl/types/syntax-tree';

/**
 * Gets the lower-case filename that we are including
 */
export function GetIncludeFile(token: TreeToken<IncludeToken>) {
  return token.match[0].substring(1).toLowerCase();
}
