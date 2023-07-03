import { GlobalTokenSource, GlobalTokenType } from '@idl/data-types/core';

/**
 * Data structure for information coming from internal IDL routines
 */
export interface IGlobalFromIDL {
  /** Name of the token */
  name: string;
  /** Type of the token */
  type: GlobalTokenType;
  /** Where does the routine come from */
  source: GlobalTokenSource;
  /** Filepath relative to start of help Subsystems for HTML docs */
  link: string;
  /**
   * Filepath relative to start of help Subsystems for HTML docs for properties
   * which are sometimes in separate files
   */
  properties?: string;
}

/**
 * By global token type, track the display name of different tokens to use for
 * formatting.
 *
 * Organized by type and the lower case name which includes the display name.
 */
export type GlobalDisplayNameLookup = {
  [property in GlobalTokenType]?: { [key: string]: string };
};
