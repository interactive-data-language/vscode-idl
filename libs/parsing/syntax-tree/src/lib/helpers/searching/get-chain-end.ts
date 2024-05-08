import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { SyntaxTree } from '../../branches.interface';

/**
 * When processing token chains, what do we skip?
 */
export const CHAIN_SKIP_TOKENS: { [key: string]: any } = {};
CHAIN_SKIP_TOKENS[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true;
CHAIN_SKIP_TOKENS[TOKEN_NAMES.COMMA] = true;
CHAIN_SKIP_TOKENS[TOKEN_NAMES.LINE_CONTINUATION] = true;
CHAIN_SKIP_TOKENS[TOKEN_NAMES.LINE_CONTINUATION_BASIC] = true;

/**
 * Tokens that indicate the start of a chain
 */
export const CHAIN_TOKEN_STARTS: { [key: string]: any } = {};
CHAIN_TOKEN_STARTS[TOKEN_NAMES.PARENTHESES] = true;
CHAIN_TOKEN_STARTS[TOKEN_NAMES.VARIABLE] = true;
CHAIN_TOKEN_STARTS[TOKEN_NAMES.SYSTEM_VARIABLE] = true;
CHAIN_TOKEN_STARTS[TOKEN_NAMES.OPERATOR_POINTER] = true;

/**
 * Tokens that can be a part of a chain
 */
export const CHAIN_TOKENS: { [key: string]: any } = {};
CHAIN_TOKENS[TOKEN_NAMES.PARENTHESES] = true;
CHAIN_TOKENS[TOKEN_NAMES.VARIABLE] = true;
CHAIN_TOKENS[TOKEN_NAMES.SYSTEM_VARIABLE] = true;
CHAIN_TOKENS[TOKEN_NAMES.ACCESS_PROPERTY] = true;
CHAIN_TOKENS[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
CHAIN_TOKENS[TOKEN_NAMES.BRACKET] = true;
CHAIN_TOKENS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
CHAIN_TOKENS[TOKEN_NAMES.OPERATOR_POINTER] = true;

/**
 * Takes an array of tokens (i.e. syntax tree), a start point, and returns the index
 * of the last token in an access chain
 */
export function GetChainEnd(children: SyntaxTree, start: number): number {
  /** Track the last entry in our access chain */
  let chainEnd: number = undefined;

  // process each child
  for (let i = start; i < children.length; i++) {
    // if we have an operator to skip, then skip
    if (children[i].name in CHAIN_SKIP_TOKENS) {
      // if the token after our start is not in a chain, then return our first token
      if (i - 1 === start) {
        return start;
      }
      continue;
    }

    // check if we have a token for a chain
    if (children[i].name in CHAIN_TOKENS) {
      chainEnd = i;
    } else {
      /**
       * If we had a chain, but this token isn't part of that chain, then get the type for
       * the token at the end of the chain.
       */
      if (chainEnd !== undefined) {
        return chainEnd;
      } else {
        /**
         * If we don't have a chain token, then save the type directly from the token
         */
        return i;
      }
    }
  }

  /**
   * Check if we have a chain that didnt close, so we return the last element
   * of our array
   */
  if (chainEnd) {
    return children.length - 1;
  } else {
    return start;
  }
}
