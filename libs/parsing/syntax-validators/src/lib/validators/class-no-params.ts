import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  BranchCallback,
  FindAllBranchChildren,
  GetRoutineName,
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
  SyntaxProblemWithTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  RoutineNameToken,
  RoutineProcedureToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Makes sure arguments come first
 */
const cb: BranchCallback<RoutineProcedureToken, IDLSyntaxValidatorMeta> = (
  branch,
  parsed
) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  /** Get the routine name */
  const name = GetRoutineName(branch);

  // routine definitions
  if (name.endsWith('__define')) {
    /** First child should be the name token */
    const nameToken = branch.kids[0] as TreeToken<RoutineNameToken>;

    /** Get defined arguments */
    const args = FindAllBranchChildren(nameToken, TOKEN_NAMES.ARG_DEFINITION);

    /** Get defined procedures */
    const kws = FindAllBranchChildren(
      nameToken,
      TOKEN_NAMES.KEYWORD_DEFINITION
    );

    // check if we have either
    if (args.length > 0 || kws.length > 0) {
      nameToken.parseProblems.push(IDL_PROBLEM_CODES.CLASS_NO_PARAMETERS);
      parsed.parseProblems.push(
        SyntaxProblemWithTranslation(
          IDL_PROBLEM_CODES.CLASS_NO_PARAMETERS,
          nameToken.pos,
          nameToken?.end?.pos || nameToken.pos
        )
      );
    }
  }
};

IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKEN_NAMES.ROUTINE_PROCEDURE, cb);
