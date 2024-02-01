import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma';
import {
  INITIAL,
  IToken,
  ITokenizeLineResult,
  parseRawGrammar,
  Registry,
} from 'vscode-textmate';

import {
  IHelpfulTextMateToken,
  KEEP_EMPTY_SCOPES,
} from './textmate-parse.interface';

/**
 * This comes from: https://www.npmjs.com/package/vscode-textmate
 */

/** Buffer for the WASM binary file for onigurama */
const WASM_BIN_BUFFER = readFileSync(
  GetExtensionPath('node_modules/vscode-oniguruma/release/onig.wasm')
).buffer;

// Create a registry that can create a grammar from a scope name.
const registry = new Registry({
  onigLib: loadWASM(WASM_BIN_BUFFER).then(() => {
    return {
      createOnigScanner(patterns) {
        return new OnigScanner(patterns);
      },
      createOnigString(s) {
        return new OnigString(s);
      },
    };
  }),
  loadGrammar: async () => {
    return parseRawGrammar(
      await readFile(
        GetExtensionPath('extension/language/syntaxes/idl.tmLanguage'),
        {
          encoding: 'utf-8',
        }
      )
    );
  },
});

/** Promise that resolves to our IDL grammar file */
const IDL_GRAMMAR = registry.loadGrammar('source.idl');

/**
 * Parse code using the IDL TextMate grammar
 */
export async function TextMateParse(
  inCode: string | string[]
): Promise<IHelpfulTextMateToken[]> {
  // split
  const code = Array.isArray(inCode) ? inCode : inCode.split('\n');

  /** Load grammar */
  const grammar = await IDL_GRAMMAR;

  /** Hold parsed tokens */
  const tokens: IHelpfulTextMateToken[] = [];

  /** Initialize rule stack */
  let ruleStack = INITIAL;

  /** tokens by line */
  let lineTokens: ITokenizeLineResult;

  /** internal iterator, one less var to clean up */
  let j = 0;

  /** Current token on our line we are processing */
  let token: IToken;

  /** Match for the current token */
  let match: string;

  /** Current scope for the token we are processing */
  let scope: string;

  // process each line of code
  for (let i = 0; i < code.length; i++) {
    // parse our line
    lineTokens = grammar.tokenizeLine(code[i], ruleStack);

    // merge tokens
    for (j = 0; j < lineTokens.tokens.length; j++) {
      // extract token
      token = lineTokens.tokens[j];

      // extract match
      match = code[i].substring(token.startIndex, token.endIndex);

      // get scope
      scope = token.scopes[token.scopes.length - 1];

      // skip if empty match, not quite sure where this comes
      // from, but there are empty spaces all over which get captured
      if (match.trim() === '' && !(scope in KEEP_EMPTY_SCOPES)) {
        continue;
      }

      // save useful information about our match
      tokens.push({
        line: i,
        match,
        ...token,
      });
    }

    // update rule stack
    ruleStack = lineTokens.ruleStack;
  }

  return tokens;
}
