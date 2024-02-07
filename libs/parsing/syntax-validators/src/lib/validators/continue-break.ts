import {
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/** Allowed parents for continue parents */
const CONTINUE_PARENTS: { [key: string]: boolean } = {};
CONTINUE_PARENTS[TOKEN_NAMES.LOOP_FOR] = true;
CONTINUE_PARENTS[TOKEN_NAMES.LOOP_FOREACH] = true;
CONTINUE_PARENTS[TOKEN_NAMES.LOOP_WHILE] = true;
CONTINUE_PARENTS[TOKEN_NAMES.LOOP_REPEAT] = true;

/* Allowed parents for break statements */
const BREAK_PARENTS: { [key: string]: boolean } = {};
BREAK_PARENTS[TOKEN_NAMES.LOOP_FOR] = true;
BREAK_PARENTS[TOKEN_NAMES.LOOP_FOREACH] = true;
BREAK_PARENTS[TOKEN_NAMES.LOOP_WHILE] = true;
BREAK_PARENTS[TOKEN_NAMES.LOOP_REPEAT] = true;
BREAK_PARENTS[TOKEN_NAMES.LOGICAL_SWITCH] = true;
BREAK_PARENTS[TOKEN_NAMES.LOGICAL_CASE] = true;

/**
 * Helper function to validate parents
 */
function ValidateParents(
  scope: TokenName[],
  allowed: { [ley: string]: boolean }
): boolean {
  // process all scope items
  for (let i = 0; i < scope.length; i++) {
    // if we have an allowed parent immediately return
    if (scope[i] in allowed) {
      return true;
    }
  }
  return false;
}

/**
 * Validate that continue statements having right parents
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.CONTROL_CONTINUE,
  (token, parsed) => {
    if (!ValidateParents(token.scope, CONTINUE_PARENTS)) {
      token.parseProblems.push(IDL_PROBLEM_CODES.BAD_CONTINUE_LOCATION);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.BAD_CONTINUE_LOCATION,
          token.pos,
          token.pos
        )
      );
    }
  }
);

/**
 * Validate that break statements have right parents
 */
IDL_SYNTAX_TREE_VALIDATOR.onBasicToken(
  TOKEN_NAMES.CONTROL_BREAK,
  (token, parsed) => {
    if (!ValidateParents(token.scope, BREAK_PARENTS)) {
      token.parseProblems.push(IDL_PROBLEM_CODES.BAD_BREAK_LOCATION);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.BAD_BREAK_LOCATION,
          token.pos,
          token.pos
        )
      );
    }
  }
);
