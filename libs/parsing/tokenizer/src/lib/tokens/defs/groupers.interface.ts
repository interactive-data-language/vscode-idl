import {
  BracketToken,
  ITokenDef,
  ParenthesesToken,
  StructureToken,
  TOKEN_NAMES,
} from '../../tokens.interface';

/**
 * Map the extracted text from regex to token
 */
const TOKEN_TYPE_BY_MATCH = {
  '[': TOKEN_NAMES.BRACKET,
  '(': TOKEN_NAMES.PARENTHESES,
  '{': TOKEN_NAMES.STRUCTURE,
};

export type GroupersTokenDef = ITokenDef<
  ParenthesesToken | BracketToken | StructureToken
>;

/**
 * For matching parentheses, brackets, and structures
 */
export const GROUPERS: GroupersTokenDef = {
  name: TOKEN_NAMES.PARENTHESES,
  match: /\(|\[|{/im,
  end: /\)|]|}/im,
  getTokenName: (matches) => {
    // verify matches
    if (matches.length !== 1) {
      console.log(`parentheses regex did not return one match as expected`);
      return TOKEN_NAMES.PARENTHESES;
    }

    // validate it is there
    if (!(matches[0] in TOKEN_TYPE_BY_MATCH)) {
      console.log(`parentheses regex did not extract "[" or "(" or "[`);
      return TOKEN_NAMES.PARENTHESES;
    }

    return TOKEN_TYPE_BY_MATCH[matches[0]];
  },
};
