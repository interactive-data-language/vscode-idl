import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import {
  CallProcedureMethodToken,
  CallProcedureToken,
  ControlGoToToken,
  RoutineNameToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Tokens that, if they have children, expect a comma to be the first thing
 */
type CommaTokens =
  | ControlGoToToken
  | CallProcedureMethodToken
  | CallProcedureToken
  | RoutineNameToken;

/**
 * Tokens to check for unexpected commas
 */
const TOKENS: CommaTokens[] = [
  TOKEN_NAMES.CONTROL_GO_TO,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE,
  TOKEN_NAMES.ROUTINE_NAME,
];

/** Tokens that we ignore when expecting a comma first or not */
export const FILTER_TOKENS: { [key: string]: boolean } = {};
FILTER_TOKENS[TOKEN_NAMES.COMMENT] = true;
FILTER_TOKENS[TOKEN_NAMES.LINE_CONTINUATION] = true;

/**
 * Call back to make sure that, if we have children, there is a comma first
 */
function Callback(token: IBranch<CommaTokens>, syntax: SyntaxProblems) {
  // only validate if we have children
  if (token.kids.filter((child) => !(child.name in FILTER_TOKENS)).length > 0) {
    // verify the first child is a comma
    if (token.kids[0].name !== TOKEN_NAMES.COMMA) {
      token.parseProblems.push(IDL_PROBLEM_CODES.EXPECTED_COMMA);
      syntax.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.EXPECTED_COMMA,
          token.pos,
          token.pos
        )
      );
    }
  }
}

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKENS[i], (token, parsed) => {
    Callback(token, parsed.parseProblems);
  });
}
