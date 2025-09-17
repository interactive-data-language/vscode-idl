/**
 * Structure for regular expressions that parse our code
 */
export interface IBaseTokenDef<T extends number> {
  /** Name of the token */
  name: T;
  /** RegExp for the start or whole token */
  match: RegExp;
  /** If we have more text than our match, this indicates the end of our token */
  end?: RegExp;
  /**
   * When we close our token, do we go to the next line after?
   *
   * This handles special cases, like line continuations when, after line continuation
   * and an optional comment, we need to skip to the next line.
   */
  nextLineOnClose?: boolean;
  /**
   * Optional callback used to get the token name from matches. Use case
   * for this customization is when we have a single regex used for
   * different types of tokens.
   *
   * For example: for, foreach, and while are one regex
   * For example: if, then, and else are one regex
   */
  getTokenName?: (matches: string[]) => T;
  /**
   * Optional post-processing for token matches. Called AFTER getTokenName
   */
  postProcessMatches?: (name: T, matches: string[]) => string[];
  /**
   * When a non-basic token ends, check if we have a matching parent token that should
   * be closed immediately afterwards.
   *
   * Only applied if the token we are trying to close matches the token type specified here
   */
  closeParentTokenAfterEnd?: T;
  /**
   * Resets tokens to DEFAULT_TOKENS after closing a token
   */
  defaultTokens?: boolean;
  /**
   * Flag that, if set, will prevent this token from being a match
   * if we are *not* at the beginning on a file
   */
  onlyFirst?: boolean;
}
