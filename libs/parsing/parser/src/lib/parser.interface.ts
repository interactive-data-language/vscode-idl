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
   * Are we parsing a notebook cell? This need to be manually set when interacting
   * directly with the `Parser()`, but from the IDLIndex it is set automatically
   */
  isNotebook: boolean;
  /**
   * If we are cleaning up, do we keep the text?
   */
  keepText: boolean;
}

/**
 * Options for parsing
 */
export const DEFAULT_PARSER_OPTIONS: IParserOptions = {
  full: true,
  cleanup: true,
  isNotebook: false,
  keepText: false,
};
