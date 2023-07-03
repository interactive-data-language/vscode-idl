import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  BranchCallback,
  IDL_SYNTAX_TREE_VALIDATOR,
  IDLSyntaxValidatorMeta,
  SyntaxProblemWithTranslation,
} from '@idl/parsing/syntax-tree';
import {
  RoutineMethodNameToken,
  RoutineNameToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Makes sure arguments come first
 */
const cb: BranchCallback<
  RoutineMethodNameToken | RoutineNameToken,
  IDLSyntaxValidatorMeta
> = (branch, parsed) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  // track when we encounter a keyword definition
  let keywordDefFound = false;

  // find our matched
  for (let i = 0; i < branch.kids.length; i++) {
    // check for comma
    if (branch.kids[i].name === TOKEN_NAMES.ASSIGNMENT) {
      keywordDefFound = true;
      continue;
    }

    // determine how to proceed
    if (keywordDefFound) {
      if (branch.kids[i].name === TOKEN_NAMES.ARG_DEFINITION) {
        branch.kids[i].parseProblems.push(IDL_PROBLEM_CODES.ARGS_FIRST);
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ARGS_FIRST,
            branch.kids[i].pos,
            branch.kids[i].pos
          )
        );
      }
    }
  }
};

IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKEN_NAMES.ROUTINE_NAME, cb);

IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKEN_NAMES.ROUTINE_METHOD_NAME, cb);
