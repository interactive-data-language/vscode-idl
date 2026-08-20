import {
  GLOBAL_TOKEN_TYPES,
  GlobalRoutineToken,
  IParameterLookup,
} from '@idl/types/idl-data-types';
import { copy } from 'fast-copy';

import { IDLIndex } from '../idl-index.class';

/**
 * Regex to test procedure method for get/set property
 */
const PROPERTY_REGEX = /::(getProperty|setProperty)$/i;

/**
 * Gets all keywords for global token and does the logic
 * for get/set and internal routines to automatically add
 * properties and set directions of values
 */
export function GetAllKeywordsForGlobalToken(
  index: IDLIndex,
  global: GlobalRoutineToken,
): IParameterLookup {
  if (
    global.type === GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD &&
    PROPERTY_REGEX.test(global.name) &&
    global.meta.source !== 'user'
  ) {
    const struct = index.globalIndex.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.STRUCTURE,
      global.name.split('::')[0],
    );

    if (struct.length > 0) {
      const newLookup = copy(struct[0].meta.props);

      // update with any kws we have
      Object.assign(newLookup, copy(global.meta.kws));

      /** Check if get/set */
      const isSet = global.name.endsWith('setproperty');

      // make sure direction is clearly indicated
      const kws = Object.values(newLookup);
      for (let i = 0; i < kws.length; i++) {
        kws[i].direction = isSet ? 'in' : 'out';
      }

      return newLookup;
    }
  }

  return global.meta.kws;
}
