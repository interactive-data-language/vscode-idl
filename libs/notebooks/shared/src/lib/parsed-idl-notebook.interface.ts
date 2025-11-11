import { IParsed } from '@idl/types/syntax-tree';

/**
 * Data structure for a parsed notebook file
 */
export interface IParsedIDLNotebook {
  [key: string]: IParsed;
}
