import {
  IDL_SYNTAX_TREE_VALIDATOR,
  IParsed,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  AccessPropertyToken,
  CallFunctionMethodToken,
  CallProcedureMethodToken,
  StructureIndexedPropertyToken,
  TOKEN_NAMES,
  TokenName,
} from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Tokens that need to be wrapped
 */
const BAD_BEFORE: { [key: string]: boolean } = {};
BAD_BEFORE[TOKEN_NAMES.CALL_FUNCTION] = true;
BAD_BEFORE[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/**
 * Checks if we have a bad token before and reports the error for the token
 * that needs to be wrapped
 */
function BadBefore(
  token: TreeToken<
    | AccessPropertyToken
    | StructureIndexedPropertyToken
    | CallProcedureMethodToken
    | CallFunctionMethodToken
  >,
  parsed: IParsed,
  before?: TreeToken<TokenName>
) {
  // return if no token before
  if (before === undefined) {
    return;
  }

  // check name
  if (before.name in BAD_BEFORE) {
    token.parseProblems.push(IDL_PROBLEM_CODES.ILLEGAL_CHAIN);
    parsed.parseProblems.push(
      SyntaxProblemWithTranslation(
        IDL_PROBLEM_CODES.ILLEGAL_CHAIN,
        before.pos,
        (token as TreeBranchToken)?.end?.pos || token.pos
      )
    );
  }
}

/**
 * Branch tokens to track
 */
const BRANCHES = [
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY,
];

for (let i = 0; i < BRANCHES.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
    BRANCHES[i],
    (token, parsed, meta) => {
      BadBefore(token, parsed, meta.before);
    }
  );
}

/**
 * Branch tokens to track
 */
const BASICS = [TOKEN_NAMES.ACCESS_PROPERTY];

for (let i = 0; i < BASICS.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(BASICS[i], (token, parsed, meta) => {
    BadBefore(token, parsed, meta.before);
  });
}
