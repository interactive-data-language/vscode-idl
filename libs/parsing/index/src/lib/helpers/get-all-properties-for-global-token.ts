import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  IGlobalIndexedToken,
  IParameterLookup,
  IPropertyLookup,
} from '@idl/types/idl-data-types';
import { copy } from 'fast-copy';

import { IDLIndex } from '../idl-index.class';

/**
 * Returns all properties for a global token and accounts for inheritance
 */
function GetAllPropertiesForGlobalToken_Recursor(
  props: IPropertyLookup,
  index: IDLIndex,
  global: IGlobalIndexedToken<GlobalStructureToken>,
) {
  for (let i = 0; i < global.meta.inherits.length; i++) {
    const inherits = index.findMatchingGlobalToken(
      GLOBAL_TOKEN_TYPES.STRUCTURE,
      global.meta.inherits[i],
    );
    // skip if nothing found
    if (inherits.length === 0) {
      continue;
    }
    const inheritThese = inherits[0].meta.props;

    const newNames = Object.keys(inherits[0].meta.props);
    for (let j = 0; j < newNames.length; j++) {
      if (!(newNames[j] in props)) {
        props[newNames[j]] = inheritThese[newNames[j]];
      }
    }

    // recurse into parent
    GetAllPropertiesForGlobalToken_Recursor(props, index, inherits[0]);
  }
}

/**
 * Returns all properties for a global token and accounts for inheritance
 */
export function GetAllPropertiesForGlobalToken(
  index: IDLIndex,
  global: IGlobalIndexedToken<GlobalStructureToken>,
): IParameterLookup {
  const props = copy(global.meta.props);

  // dive in and recurse
  GetAllPropertiesForGlobalToken_Recursor(props, index, global);

  return props;
}
