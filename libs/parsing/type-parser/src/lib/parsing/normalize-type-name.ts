import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  TYPE_MAP_AND_ALIASES,
} from '@idl/types/idl-data-types';

/**
 * Gets the name for a type for consistent logic across the board
 */
export function NormalizeTypeName(name: string) {
  /** Get lower case */
  const lc = name.toLowerCase();

  // determine how to normalize
  switch (true) {
    /**
     * Do we have a known alias? All "known" IDL types
     * will enter here
     */
    case lc in TYPE_MAP_AND_ALIASES:
      return TYPE_MAP_AND_ALIASES[lc];

    /**
     * Check for custom type display name for user types
     */
    case lc in CUSTOM_TYPE_DISPLAY_NAMES:
      return CUSTOM_TYPE_DISPLAY_NAMES[lc];

    /**
     * Unknown so normalize to lower case for consistency
     */
    default:
      return lc;
  }
}
