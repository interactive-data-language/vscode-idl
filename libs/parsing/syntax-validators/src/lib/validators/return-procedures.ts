import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  FindAllBranchChildren,
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import {
  CallProcedureToken,
  MainLevelToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { FILTER_TOKENS } from './expected-comma';

/**
 * Call back to make sure that, if we have children, there is a comma first
 */
function Callback(
  token: IBranch<RoutineProcedureToken | MainLevelToken>,
  syntax: SyntaxProblems
) {
  // get all procedures we are calling
  const returns = FindAllBranchChildren(token, TOKEN_NAMES.CALL_PROCEDURE);

  // process all of our procedures
  for (let i = 0; i < returns.length; i++) {
    if (returns[i].match[0].toLowerCase() === 'return') {
      if (
        (returns[i] as IBranch<CallProcedureToken>).kids.filter(
          (child) => !(child.name in FILTER_TOKENS)
        ).length > 0
      ) {
        returns[i].parseProblems.push(
          IDL_PROBLEM_CODES.RETURN_VALUES_PROCEDURES
        );
        syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.RETURN_VALUES_PROCEDURES,
            returns[i].pos,
            returns[i].end ? returns[i].end.pos : returns[i].pos
          )
        );
      }
    }
  }
}

/**
 * Check return statements in procedures
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  (token, parsed) => {
    Callback(token, parsed.parseProblems);
  }
);

/**
 * Check return statements in main level programs
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.MAIN_LEVEL,
  (token, parsed) => {
    Callback(token, parsed.parseProblems);
  }
);
