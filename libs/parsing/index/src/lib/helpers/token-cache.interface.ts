import {
  GlobalFunctionMethodToken,
  GlobalIndexedRoutineToken,
  GlobalProcedureMethodToken,
  GlobalTokenType,
  IDLDataType,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import {
  ILocalTokenLookup,
  ISplitTreeOnArguments,
} from '@idl/parsing/syntax-tree';

import { IFoundKeywords } from './get-keywords.interface';
import { IFoundParameter, IFoundProperty } from './get-property.interface';

/**
 * Cache stores anything that we could return from a helper
 * routine so that we don't have to recalculate or determine
 * something that is not in the cache.
 *
 * NOTE: Changing property names means you'll need to update the cache
 * logic in the miscellaneous routines as we check for cache values by key name
 */
export interface ITokenCache {
  /** The type of our token */
  type?: IDLDataType;
  /**
   * Data type for the token before.
   *
   * Only set for a few tokens, but it is used for type validation and
   * making sure things like properties and methods exist or not.
   */
  typeBefore?: IDLDataType;
  /**
   * Keyword for given token
   */
  keyword?: IFoundParameter;
  /** Keywords */
  keywords?: IFoundKeywords;
  /** Variables */
  variables?: ILocalTokenLookup;
  /** Routines */
  routine?: GlobalIndexedRoutineToken[];
  /** Global token */
  global?: IGlobalIndexedToken<GlobalTokenType>;
  /** Method */
  method?: IGlobalIndexedToken<
    GlobalFunctionMethodToken | GlobalProcedureMethodToken
  >[];
  /** Property */
  property?: IFoundProperty;
  /** Flag indicating that we have validated the type to our left already for a token */
  validatedLeft?: boolean;
  /** Flag indicating that we have validated the type to our right already for a token */
  validatedRight?: boolean;
  /** Arguments and keywords */
  argSplit?: ISplitTreeOnArguments;
  /** For each argument, the data type */
  argTypes?: IDLDataType[];
}
