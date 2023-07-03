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
 * For type population
 */
export type PopulateTypeHandler = TreeCallbackHandler<PopulateTypeHandlerMeta>;
