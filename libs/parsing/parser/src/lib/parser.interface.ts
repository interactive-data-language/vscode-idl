/**
 * Options for parsing
 */
export interface IParserOptions {
  /**
   * Do we do a full parse or not?
   */
  full: boolean;
  /**
   * Do we cleanup and reduce memory usage by removing properties we dont need?
   */
  cleanup: boolean;
  /**
   * Are we parsing a notebook cell
   */
  isNotebook: boolean;
}

/**
 * Options for parsing
 */
export const DEFAULT_PARSER_OPTIONS: IParserOptions = {
  full: true,
  cleanup: true,
  isNotebook: false,
};
