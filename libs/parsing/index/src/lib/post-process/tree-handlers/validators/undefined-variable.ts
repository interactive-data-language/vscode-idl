import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  BasicCallback,
  FindDirectBranchChildren,
  GetNextInBranch,
  IsBeforeToken,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, VariableToken } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';

import { FAKE_ASSIGNMENT_PARENTS } from '../populators/type-from-assignment';
import { VALIDATE_TYPE_HANDLER } from '../validate-type-handler';
import { ValidateTypeHandlerMeta } from '../validate-type-handler.interface';

/**
 * Routines that we dont want to recurse into for token discovery
 */
export const ROUTINE_TOKENS: { [key: string]: boolean } = {};
ROUTINE_TOKENS[TOKEN_NAMES.CALL_FUNCTION] = true;
ROUTINE_TOKENS[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
ROUTINE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE] = true;
ROUTINE_TOKENS[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;
ROUTINE_TOKENS[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;

/**
 * Tokens that we are validating
 */
const TOKENS = [TOKEN_NAMES.VARIABLE];

/**
 * Variables that we skip
 */
const SKIP_VARIABLES: { [key: string]: any } = {
  // iTools catch, ierr blocks
  ierr: true,
};

/**
 * Callback to validate assignment
 */
const cb: BasicCallback<VariableToken, ValidateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  // return if we are in a common block
  if (token.scope.indexOf(TOKEN_NAMES.CONTROL_COMMON) !== -1) {
    return;
  }
  /**
   * Does our parent have a common block or not
   */
  let hasCommon = false;

  // check if we have a common block to reduce our problems to warnings
  if (token.scopeTokens.length > 0) {
    hasCommon =
      FindDirectBranchChildren(token.scopeTokens[0], TOKEN_NAMES.CONTROL_COMMON)
        .length > 0;
  }

  /** Get variable name */
  const varName = token.match[0].toLowerCase();

  // check if we have special variables to skip
  if (varName in SKIP_VARIABLES) {
    return;
  }

  // check for assignment to the right for goofy syntax
  if (
    varName !== 'self' &&
    GetNextInBranch(token)?.name === TOKEN_NAMES.ASSIGNMENT &&
    !(token.scope[token.scope.length - 1] in FAKE_ASSIGNMENT_PARENTS)
  ) {
    return;
  }

  // get our variable
  const variable = meta.variables[varName];

  switch (true) {
    // variable that is not defined
    case variable === undefined || !variable.meta.isDefined:
      parsed.postProcessProblems.push(
        SyntaxProblemWithoutTranslation(
          hasCommon
            ? IDL_PROBLEM_CODES.POTENTIALLY_UNDEFINED_VAR
            : IDL_PROBLEM_CODES.UNDEFINED_VAR,
          IDL_TRANSLATION.parsing.errors[
            hasCommon
              ? IDL_PROBLEM_CODES.POTENTIALLY_UNDEFINED_VAR
              : IDL_PROBLEM_CODES.UNDEFINED_VAR
          ] + ` "${token.match[0]}"`,
          token.pos,
          token.pos
        )
      );
      break;
    case IsBeforeToken(token.pos, variable.pos):
      parsed.postProcessProblems.push(
        SyntaxProblemWithoutTranslation(
          hasCommon
            ? IDL_PROBLEM_CODES.POTENTIAL_VAR_USAGE_BEFORE_DEF
            : IDL_PROBLEM_CODES.VAR_USAGE_BEFORE_DEF,
          IDL_TRANSLATION.parsing.errors[
            hasCommon
              ? IDL_PROBLEM_CODES.POTENTIAL_VAR_USAGE_BEFORE_DEF
              : IDL_PROBLEM_CODES.VAR_USAGE_BEFORE_DEF
          ] + ` "${variable.meta.display}"`,
          token.pos,
          token.pos
        )
      );
      break;
    default:
      break;
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  VALIDATE_TYPE_HANDLER.onBasicToken(TOKENS[i], cb);
}
