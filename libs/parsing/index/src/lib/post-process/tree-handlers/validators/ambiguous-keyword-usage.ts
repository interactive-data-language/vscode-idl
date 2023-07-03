import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  BranchCallback,
  FindDirectBranchChildren,
  SyntaxProblemWithoutTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  KeywordBinaryToken,
  KeywordToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';

import { GetKeywordDisplayName } from '../../../helpers/get-keyword-display-name';
import { GetKeywords } from '../../../helpers/get-keywords';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';
import { VALIDATE_TYPE_HANDLER } from '../validate-type-handler';

/**
 * Union type of call routine tokens
 */
export type CallRoutineToken =
  | CallProcedureToken
  | CallProcedureMethodToken
  | CallFunctionToken
  | CallFunctionMethodToken;

/**
 * Tokens that we are validating
 */
const TOKENS: CallRoutineToken[] = [
  TOKEN_NAMES.CALL_FUNCTION,
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
];

/**
 * Callback to validate that a keyword is correct
 */
const cb: BranchCallback<CallRoutineToken, PopulateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  const keywords = GetKeywords(meta.index, parsed, token);

  // return if we don't have any keywords to check
  if (keywords === undefined) {
    return;
  }

  /** Get defined keywords */
  const defined = Object.keys(keywords.keywords);

  // get the keywords that we use
  const used: TreeToken<KeywordBinaryToken | KeywordToken>[] =
    FindDirectBranchChildren(token, TOKEN_NAMES.KEYWORD).concat(
      FindDirectBranchChildren(token, TOKEN_NAMES.KEYWORD_BINARY) as any
    );

  // process each used keyword
  for (let i = 0; i < used.length; i++) {
    // get display name
    const display = GetKeywordDisplayName(used[i]).toLowerCase();

    // skip if direct match
    if (display in keywords.keywords) {
      continue;
    }

    // check abbreviation
    let count = 0;
    for (let j = 0; j < defined.length; j++) {
      count += defined[j].startsWith(display) ? 1 : 0;
      if (count > 1) {
        break;
      }
    }

    // error if needed
    if (count > 1) {
      parsed.postProcessProblems.push(
        SyntaxProblemWithoutTranslation(
          IDL_PROBLEM_CODES.AMBIGUOUS_KEYWORD_ABBREVIATION,
          IDL_TRANSLATION.parsing.errors[
            IDL_PROBLEM_CODES.AMBIGUOUS_KEYWORD_ABBREVIATION
          ] + ` "${display}"`,
          used[i].pos,
          used[i].pos
        )
      );
    }
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  VALIDATE_TYPE_HANDLER.onBranchToken(TOKENS[i], cb);
}
