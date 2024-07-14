import {
  BasicCallback,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import {
  KeywordBinaryToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

import { FindKeyword } from '../../../helpers/get-keyword';
import { GetKeywordDisplayName } from '../../../helpers/get-keyword-display-name';
import { GetKeywords } from '../../../helpers/get-keywords';
import { VALIDATE_TYPE_HANDLER } from '../validate-type-handler';
import { ValidateTypeHandlerMeta } from '../validate-type-handler.interface';

/**
 * Keywords that we don't validate
 */
const IGNORE_KEYWORDS: { [key: string]: any } = {};
IGNORE_KEYWORDS['_extra'] = true;
IGNORE_KEYWORDS['_strict_extra'] = true;

/**
 * Tokens that we are validating
 */
const TOKENS = [TOKEN_NAMES.KEYWORD, TOKEN_NAMES.KEYWORD_BINARY];

/**
 * Callback to validate that a keyword is correct
 */
const cb: BasicCallback<
  KeywordToken | KeywordBinaryToken,
  ValidateTypeHandlerMeta
> = (token, parsed, meta) => {
  // get keywords
  const foundKeywords = GetKeywords(meta.index, parsed, token);

  // stop if we dont have any keywords which means we dont know the
  // routine or dont have type for methods
  if (foundKeywords === undefined) {
    return;
  }

  // check if we have IDL-level overloads for validity of keywords
  if (
    '_extra' in foundKeywords.keywords ||
    '_ref_extra' in foundKeywords.keywords
  ) {
    return;
  }

  // get the keyword name
  const kwName = GetKeywordDisplayName(token).toLowerCase();

  // skip if we should never validate
  if (kwName in IGNORE_KEYWORDS) {
    return;
  }

  // check for keyword existence
  if (FindKeyword(kwName, foundKeywords.keywords) === undefined) {
    parsed.postProcessProblems.push(
      SyntaxProblemWithoutTranslation(
        IDL_PROBLEM_CODES.UNKNOWN_KEYWORD,
        IDL_TRANSLATION.parsing.errors[IDL_PROBLEM_CODES.UNKNOWN_KEYWORD] +
          ` "${kwName}"`,
        token.pos,
        token.pos
      )
    );
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  VALIDATE_TYPE_HANDLER.onBasicToken(TOKENS[i], cb);
}
