import {
  GlobalFunctionToken,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';

/**
 * Response from loading tasks
 */
export interface IGlobalsToTrack {
  function: IGlobalIndexedToken<GlobalFunctionToken>;
  structure: IGlobalIndexedToken<GlobalStructureToken>;
}
