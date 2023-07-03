import { TreeCallbackHandler } from '@idl/parsing/syntax-tree';

import { RECURSION_CONTROL } from './recursion-control.interface';
import {
  ValidateTypeHandler,
  ValidateTypeHandlerMeta,
} from './validate-type-handler.interface';

/**
 * Callback manager for automatically fixing problems in code before
 * we same them
 */
export const VALIDATE_TYPE_HANDLER: ValidateTypeHandler =
  new TreeCallbackHandler<ValidateTypeHandlerMeta>(RECURSION_CONTROL);
