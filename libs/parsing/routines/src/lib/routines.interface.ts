import { GlobalTokenSource, GlobalTokenType } from '@idl/types/core';

/**
 * Data structure for information coming from internal IDL routines
 */
export interface IGlobalFromIDL {
  /** Filepath relative to start of help Subsystems for HTML docs */
  link: string;
  /** Name of the token */
  name: string;
  /**
   * Filepath relative to start of help Subsystems for HTML docs for properties
   * which are sometimes in separate files
   */
  properties?: string;
  /** Where does the routine come from */
  source: GlobalTokenSource;
  /** Type of the token */
  type: GlobalTokenType;
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
