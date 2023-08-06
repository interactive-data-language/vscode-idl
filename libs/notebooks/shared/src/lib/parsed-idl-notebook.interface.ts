import { IParsed } from '@idl/parsing/syntax-tree';

/**
 * Data structure for a parsed notebook file
 */
export interface IParsedIDLNotebook {
  [key: string]: IParsed;
}
