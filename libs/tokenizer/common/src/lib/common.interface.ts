/** Position of a token */
export interface IPosition {
  /** Line number we start on */
  line: number;
  /** Line number that we finish */
  index: number;
}

/**
 * Structure to store all the information about our match
 */
export interface IDetailedPosition extends IPosition {
  length: number;
}

/** Basic token with no closing statement */
export type BasicToken = 0;

/* Start of a multi-part token */
export type StartToken = 1;

/** End of a multi-part token */
export type EndToken = 2;

/** Types of tokens that we can match */
export type FoundTokenType = BasicToken | StartToken | EndToken;

/**
 * Strictly typed interface for constant of allowed token tupes
 */
export interface ITokenTypes {
  BASIC: BasicToken;
  START: StartToken;
  END: EndToken;
}

/**
 * Allowed types of tokens
 */
export const TOKEN_TYPES: ITokenTypes = {
  BASIC: 0,
  START: 1,
  END: 2,
};
