import { TreeCallbackHandler } from '@idl/parsing/syntax-tree';

import {
  PopulateTypeHandler,
  PopulateTypeHandlerMeta,
} from './populate-type-handler.interface';
import { RECURSION_CONTROL } from './recursion-control.interface';

/**
 * Callback manager for automatically fixing problems in code before
 * we same them
 */
export const POPULATE_TYPE_HANDLER: PopulateTypeHandler =
  new TreeCallbackHandler<PopulateTypeHandlerMeta>(RECURSION_CONTROL);
