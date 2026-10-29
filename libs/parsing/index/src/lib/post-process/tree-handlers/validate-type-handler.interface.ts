import type {
  IHandlerCallbackMetadata,
  TreeCallbackHandler,
} from '@idl/parsing/syntax-tree';
import type { ILocalTokenLookup } from '@idl/types/syntax-tree';

import type { IDLIndex } from '../../idl-index.class';

/**
 * Metadata to validate types
 */
export interface ValidateTypeHandlerMeta extends IHandlerCallbackMetadata {
  /**
   * Name of the file we are processing
   */
  file: string;
  /**
   * Global index
   */
  index: IDLIndex;
  /**
   * Track variables that we have found
   */
  variables: ILocalTokenLookup;
}

/**
 * Tree callback handler for type validation
 */
export type ValidateTypeHandler = TreeCallbackHandler<ValidateTypeHandlerMeta>;
