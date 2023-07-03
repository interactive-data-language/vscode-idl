import { TreeCallbackHandler } from '@idl/parsing/syntax-tree';

import {
  AssemblerStyleMeta,
  AssemblingStyleTreeHandler,
} from './handlers.interface';

/**
 * Manages callbacks for the assembler and pre-processing our syntax tree
 * before any formatting takes place.
 *
 * This is a placeholder to follow the patterns in other parts of the application
 */
export const ASSEMBLER_DEFAULT_STYLING: AssemblingStyleTreeHandler =
  new TreeCallbackHandler<AssemblerStyleMeta>();
