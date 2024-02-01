import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  GlobalTokens,
  GlobalTokenType,
  IGlobalIndexedToken,
} from '@idl/types/core';

import { PROPERTIES_ARE_KEYWORDS } from '../overrides/properties-and-keywords/properties-are-keywords';
import { UpdateThese } from './set-keywords-as-properties.interface';

/**
 * Finds matching tokens
 */
export function GetMatch<T extends GlobalTokenType>(
  global: GlobalTokens,
  name: string,
  type: T
) {
  const matches: IGlobalIndexedToken<T>[] = [];
  for (let i = 0; i < global.length; i++) {
    if (
      global[i].type === type &&
      global[i].name.toLowerCase() === name.toLowerCase()
    )
      matches.push(global[i] as IGlobalIndexedToken<T>);
  }
  return matches;
}

function UpdateThings(
  global: GlobalTokens,
  className: string,
  updateThese: UpdateThese
) {
  // find matching global token
  const matches = GetMatch(global, className, GLOBAL_TOKEN_TYPES.STRUCTURE);

  // skip if nothing
  if (matches.length === 0) {
    return;
  }

  /** Get our first match */
  const match = matches[0];

  // process each sub thing
  for (let j = 0; j < updateThese.length; j++) {
    const updateMatches = GetMatch(
      global,
      updateThese[j][0],
      updateThese[j][1]
    );

    // update each item we find
    for (let z = 0; z < updateMatches.length; z++) {
      Object.assign(
        updateMatches[z].meta.kws,
        match.meta.props,
        updateMatches[z].meta.kws
      );
    }
  }
}

/**
 * Regex for which class names we want to automatically add properties to
 * as keywords
 */
const REGEX = /^idl(?:gr|ff)/im;

/**
 * Automation to determine if we need to add in extra keywords or not
 */
function ShouldSet(className: string): boolean {
  return REGEX.test(className);
}

/**
 * Sets keywords as properties for our docs
 */
export function SetKeywordsFromProperties(global: GlobalTokens) {
  /** Get manual overrides */
  const keys = Object.keys(PROPERTIES_ARE_KEYWORDS);
  for (let i = 0; i < keys.length; i++) {
    UpdateThings(global, keys[i], PROPERTIES_ARE_KEYWORDS[keys[i]]);
  }

  // update all graphics routines
  const structures = global.filter(
    (item) => item.type === GLOBAL_TOKEN_TYPES.STRUCTURE
  ) as IGlobalIndexedToken<GlobalStructureToken>[];

  // process each structure
  for (let i = 0; i < structures.length; i++) {
    const struct = structures[i];
    if (!ShouldSet(struct.name)) {
      continue;
    }

    /** Get all classes that properties come from */
    const update = struct.meta.inherits.concat(struct.name);

    // merge
    for (let j = 0; j < update.length; j++) {
      UpdateThings(global, update[j], [
        [`${struct.name}`, GLOBAL_TOKEN_TYPES.FUNCTION],
        [`${struct.name}::init`, GLOBAL_TOKEN_TYPES.FUNCTION_METHOD],
        [`${struct.name}::getproperty`, GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
        [`${struct.name}::setproperty`, GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
      ]);
    }
  }
}
