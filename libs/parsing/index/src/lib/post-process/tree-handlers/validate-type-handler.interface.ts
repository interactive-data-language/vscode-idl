import {
  IHandlerCallbackMetadata,
  ILocalTokenLookup,
  TreeCallbackHandler,
} from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../../idl-index.class';

/**
 * Metadata to validate types
 */
export interface ValidateTypeHandlerMeta extends IHandlerCallbackMetadata {
  /**
   * Track variables that we have found
   */
  variables: ILocalTokenLookup;
  /**
   * Global index
   */
  index: IDLIndex;
  /**
   * Name of the file we are processing
   */
  file: string;
}

/**
 * Tree callback handler for type validation
 */
export type ValidateTypeHandler = TreeCallbackHandler<ValidateTypeHandlerMeta>;
