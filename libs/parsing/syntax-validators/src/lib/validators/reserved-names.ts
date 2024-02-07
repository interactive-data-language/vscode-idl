import {
  RESERVED_FUNCTION_METHODS,
  RESERVED_FUNCTIONS,
  RESERVED_PROCEDURE_METHODS,
  RESERVED_PROCEDURES,
} from '@idl/parsing/routines';
import {
  FindFirstBranchChild,
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import {
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import {
  IDL_PROBLEM_CODES,
  ISyntaxProblem,
  SyntaxProblems,
} from '@idl/types/problem-codes';

/**
 * Handles checking a function or procedure branch for a routine or method
 * name and validates it against what is reserved (i.e. comes from IDL or ENVI already)
 */
function CheckName(
  token: IBranch<RoutineProcedureToken | RoutineFunctionToken>,
  syntax: SyntaxProblems,
  procedure: boolean
) {
  // init problem
  let problem: ISyntaxProblem;

  // check for routine
  const name = FindFirstBranchChild(token, TOKEN_NAMES.ROUTINE_NAME);
  if (name !== undefined) {
    // extract the string to compare
    const compare = name.match[0].toLowerCase();

    // are we a procedure?
    if (procedure) {
      if (compare in RESERVED_PROCEDURES) {
        name.parseProblems.push(IDL_PROBLEM_CODES.RESERVED_PROCEDURE);
        problem = SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.RESERVED_PROCEDURE,
          token.pos,
          name.end.pos
        );
      }
    } else {
      if (compare in RESERVED_FUNCTIONS) {
        name.parseProblems.push(IDL_PROBLEM_CODES.RESERVED_FUNCTION);
        problem = SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.RESERVED_FUNCTION,
          token.pos,
          name.end.pos
        );
      }
    }
  } else {
    // check for method if no routine
    const method = FindFirstBranchChild(token, TOKEN_NAMES.ROUTINE_METHOD_NAME);
    if (method !== undefined) {
      // extract the string to compare
      const compare = method.match[0].toLowerCase();

      // are we a procedure
      if (procedure) {
        if (compare in RESERVED_PROCEDURE_METHODS) {
          method.parseProblems.push(
            IDL_PROBLEM_CODES.RESERVED_PROCEDURE_METHOD
          );
          problem = SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.RESERVED_PROCEDURE_METHOD,
            token.pos,
            method.end.pos
          );
        }
      } else {
        if (compare in RESERVED_FUNCTION_METHODS) {
          method.parseProblems.push(IDL_PROBLEM_CODES.RESERVED_FUNCTION_METHOD);
          problem = SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.RESERVED_FUNCTION_METHOD,
            token.pos,
            method.end.pos
          );
        }
      }
    }
  }

  // check if we have a problem
  if (problem !== undefined) {
    syntax.push(problem);
  }
}

/**
 * Check user-defined function names
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_FUNCTION,
  (token, parsed) => {
    CheckName(token, parsed.parseProblems, false);
  }
);

/**
 * Check user-defined procedure names
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  (token, parsed) => {
    CheckName(token, parsed.parseProblems, true);
  }
);
