import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import {
  BracketToken,
  CallFunctionMethodToken,
  CallFunctionToken,
  ControlCommonToken,
  ControlCompileOptToken,
  ControlForwardFunctionOptToken,
  LoopForeachToken,
  LoopForToken,
  StructureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Tokens that are not allowed to have commas afterwards
 */
type CommaTokens =
  | BracketToken
  | ControlCommonToken
  | ControlCompileOptToken
  | ControlForwardFunctionOptToken
  | CallFunctionMethodToken
  | CallFunctionToken
  | LoopForToken
  | LoopForeachToken
  | StructureToken;

/**
 * Tokens to check for unexpected commas
 */
const TOKENS: CommaTokens[] = [
  TOKEN_NAMES.BRACKET,
  TOKEN_NAMES.CONTROL_COMMON,
  TOKEN_NAMES.CONTROL_COMPILE_OPT,
  TOKEN_NAMES.CONTROL_FORWARD_FUNCTION,
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_FUNCTION,
  TOKEN_NAMES.LOOP_FOR,
  TOKEN_NAMES.LOOP_FOREACH,
  TOKEN_NAMES.STRUCTURE,
];

/**
 * Call back to make sure that, if we have children, there is a comma first
 */
function Callback<T extends CommaTokens>(
  token: IBranch<T>,
  syntax: SyntaxProblems
) {
  // only validate if we have children
  if (token.kids.length > 0) {
    // verify the first child is a comma
    if (token.kids[0].name === TOKEN_NAMES.COMMA) {
      token.parseProblems.push(IDL_PROBLEM_CODES.UNEXPECTED_COMMA);
      syntax.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.UNEXPECTED_COMMA,
          token.pos,
          token.kids[0].pos
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
