import { IToken } from 'vscode-textmate';

/**
 * Add useful information to the tokens that we extract vis
 * TextMate parsing
 */
export interface IHelpfulTextMateToken extends IToken {
  /** The line that our token is found on */
  line: number;
  /** Text that is matched */
  match: string;
}

/**
 * Controls which scopes we keep if we have empty space
 */
export const KEEP_EMPTY_SCOPES: { [key: string]: boolean } = {};
KEEP_EMPTY_SCOPES['string.quoted.single.idl'] = true;
KEEP_EMPTY_SCOPES['string.quoted.double.idl'] = true;
KEEP_EMPTY_SCOPES['string.template.idl'] = true;
