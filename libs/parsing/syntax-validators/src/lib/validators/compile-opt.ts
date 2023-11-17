import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  FindAllBranchChildren,
  FindDirectBranchChildren,
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import {
  MainLevelToken,
  RoutineFunctionToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { IsSingleLine } from '../helpers/is-single-line';
import { NAME_TOKENS } from './return-functions';

/**
 * Checks our routine definition for a compile option
 */
function CheckForCompileOpt(
  token: IBranch<RoutineProcedureToken | RoutineFunctionToken | MainLevelToken>,
  syntax: SyntaxProblems
) {
  // look for compile opt statements
  const kids = FindAllBranchChildren(token, TOKEN_NAMES.CONTROL_COMPILE_OPT);

  // handle the different cases
  switch (true) {
    // no compile opts
    case kids.length === 0:
      {
        // get end position at end of routine name
        let endPos = token.pos;
        const first = token.kids[0];
        if (first?.name in NAME_TOKENS) {
          if ((first as TreeBranchToken).end !== undefined) {
            endPos = (first as TreeBranchToken).end.pos;
          }
        }

        // report problem
        token.parseProblems.push(IDL_PROBLEM_CODES.NO_COMPILE_OPT);
        syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.NO_COMPILE_OPT,
            token.pos,
            endPos
          )
        );
      }
      break;
    // more than one compile opt
    case kids.length > 1:
      for (let i = 0; i < kids.length; i++) {
        token.parseProblems.push(IDL_PROBLEM_CODES.MULTIPLE_COMPILE_OPT);
        syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.MULTIPLE_COMPILE_OPT,
            kids[i].pos,
            kids[i].end ? kids[i].end.pos : kids[i].pos
          )
        );
      }
      break;
    default:
      break;
  }
}

/**
 * Make sure functions have compile opt statements
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_FUNCTION,
  (token, parsed) => {
    CheckForCompileOpt(token, parsed.parseProblems);
  }
);

/**
 * Make sure procedures have compile opt statements
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  (token, parsed) => {
    CheckForCompileOpt(token, parsed.parseProblems);
  }
);

/**
 * Check for compile_opt statements in main level programs
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.MAIN_LEVEL,
  (token, parsed, meta) => {
    if (meta.isNotebook || IsSingleLine(token)) {
      return;
    }

    CheckForCompileOpt(token, parsed.parseProblems);
  }
);

/**
 * Allowed compile options
 */
export const ALLOWED_COMPILE_OPTIONS: { [key: string]: undefined } = {
  idl2: undefined,
  idl3: undefined,
  defint32: undefined,
  float64: undefined,
  hidden: undefined,
  logical_predicate: undefined,
  nosave: undefined,
  obsolete: undefined,
  static: undefined,
  strictarr: undefined,
  strictarrsubs: undefined,
};

/**
 * Tell user to switch to compile_opt idl2
 */
const USE_IDL2: { [key: string]: boolean } = {
  defint32: true,
  strictarr: true,
};

/**
 * Verify compile opt statements
 */
IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(
  TOKEN_NAMES.CONTROL_COMPILE_OPT,
  (token, parsed) => {
    // get all our variable children
    const vars = FindDirectBranchChildren(token, TOKEN_NAMES.CONTROL_OPTION);

    // check how to proceed
    if (vars.length === 0) {
      token.parseProblems.push(IDL_PROBLEM_CODES.MISSING_COMPILE_OPTIONS);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.MISSING_COMPILE_OPTIONS,
          token.pos,
          token.end ? token.end.pos : token.pos
        )
      );

      // return because there is nothing else to do
      return;
    }

    // init flags
    let idl2Found = false;

    // process all of the children
    for (let i = 0; i < vars.length; i++) {
      // get the variable we compare
      const compare = vars[i].match[0].toLowerCase();

      // check for idl2
      if (!idl2Found) {
        idl2Found = compare === 'idl2' || compare === 'idl3';
      }

      // do we have an invalid compile option
      if (!(compare in ALLOWED_COMPILE_OPTIONS)) {
        token.parseProblems.push(IDL_PROBLEM_CODES.ILLEGAL_COMPILE_OPT);
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ILLEGAL_COMPILE_OPT,
            vars[i].pos,
            vars[i].pos
          )
        );
      } else {
        // check if they should be told to use compile opt idl2 instead
        if (compare in USE_IDL2) {
          token.parseProblems.push(IDL_PROBLEM_CODES.USE_IDL2_COMPILE_OPT);
          parsed.parseProblems.push(
            SyntaxProblemWithTranslation(
              IDL_PROBLEM_CODES.USE_IDL2_COMPILE_OPT,
              vars[i].pos,
              vars[i].pos
            )
          );
        }
      }
    }

    // check if we found a compile opt
    if (!idl2Found) {
      token.parseProblems.push(IDL_PROBLEM_CODES.NO_COMPILE_OPT_IDL2);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.NO_COMPILE_OPT_IDL2,
          token.pos,
          token.end ? token.end.pos : token.pos
        )
      );
    }
  }
);
