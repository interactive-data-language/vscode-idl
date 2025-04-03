import {
  IHandlerCallbackMetadata,
  ILocalTokenLookup,
  TreeCallbackHandler,
} from '@idl/parsing/syntax-tree';

import { IDLIndex } from '../../idl-index.class';

/**
 *Data structure we use for our type population callback handler
 */
export interface PopulateTypeHandlerMeta extends IHandlerCallbackMetadata {
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
 * For type population
 */
export type PopulateTypeHandler = TreeCallbackHandler<PopulateTypeHandlerMeta>;
