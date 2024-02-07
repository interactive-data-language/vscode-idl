import {
  BranchCallback,
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * This syntax validator checks many branches and verifies they are correct and
 * have children present.
 *
 * For example: make sure something comes after an operator or the `do` portion of a
 * loop has something to do.
 *
 * Catches a decent number of syntax errors from IDL in one fell swoop for many tokens.
 */

/**
 * Names of all tokens that should have children
 */
const TOKENS: NonBasicTokenNames[] = [
  TOKEN_NAMES.ASSIGNMENT,
  TOKEN_NAMES.OPERATOR,
  TOKEN_NAMES.OPERATOR_COMPOUND,
  TOKEN_NAMES.OPERATOR_LOGICAL,
  TOKEN_NAMES.OPERATOR_NEGATIVE,
  // TOKEN_NAMES.OPERATOR_POINTER, // specific problem reported elsewhere
  TOKEN_NAMES.PARENTHESES,
  TOKEN_NAMES.LOOP_FOR,
  TOKEN_NAMES.LOOP_FOREACH,
  TOKEN_NAMES.LOOP_WHILE,
  TOKEN_NAMES.LOOP_DO,
  TOKEN_NAMES.LOOP_REPEAT,
  TOKEN_NAMES.LOOP_UNTIL,
  TOKEN_NAMES.LOGICAL_IF,
  TOKEN_NAMES.LOGICAL_THEN,
  TOKEN_NAMES.LOGICAL_ELSE,
  TOKEN_NAMES.LOGICAL_TERNARY_THEN,
  TOKEN_NAMES.LOGICAL_TERNARY_ELSE,
  TOKEN_NAMES.LOGICAL_SWITCH, // handled elsewhere
  TOKEN_NAMES.LOGICAL_CASE, // handled elsewhere
  TOKEN_NAMES.LOGICAL_OF,
];

/**
 * Callback to validate that we have children in our token, but does no additional
 * syntax verification
 */
const callback: BranchCallback<NonBasicTokenNames, IDLSyntaxValidatorMeta> = (
  token,
  parsed
) => {
  // check for missing children
  if (token.kids.length === 0) {
    // save problem
    token.parseProblems.push(IDL_PROBLEM_CODES.EXPECTED_STATEMENT);
    parsed.parseProblems.push(
      SyntaxProblemWithTranslation(
        IDL_PROBLEM_CODES.EXPECTED_STATEMENT,
        token.pos,
        token.end !== undefined ? token.end.pos : token.pos
      )
    );
  }
};

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKENS[i], callback);
}
