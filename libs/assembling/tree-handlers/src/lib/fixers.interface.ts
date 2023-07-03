import {
  IHandlerCallbackMetadata,
  TreeCallbackHandler,
} from '@idl/parsing/syntax-tree';

import { AssemblingFixerTreeHandler } from './handlers.interface';

/**
 * Callback manager for automatically fixing problems in code before
 * we same them
 */
export const ASSEMBLER_PROBLEM_FIXERS: AssemblingFixerTreeHandler =
  new TreeCallbackHandler<IHandlerCallbackMetadata>();
