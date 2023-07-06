import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import {
  BRANCH_TYPES,
  IBranch,
  IDL_SYNTAX_TREE_VALIDATOR,
  SyntaxProblemWithTranslation,
  SyntaxTree,
} from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames, TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Operators to check children (i.e. recurse)
 */
const RECURSION_CHECK: { [key: string]: boolean } = {};
RECURSION_CHECK[TOKEN_NAMES.OPERATOR] = true;
RECURSION_CHECK[TOKEN_NAMES.OPERATOR_COMPOUND] = true;
RECURSION_CHECK[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true;

/**
 * This tokens CAN be next to each other
 */
const SKIP_CHECK: { [key: string]: boolean } = {};
SKIP_CHECK[TOKEN_NAMES.OPERATOR_LOGICAL] = true;
SKIP_CHECK[TOKEN_NAMES.UNKNOWN] = true;
SKIP_CHECK[TOKEN_NAMES.COMMENT] = true;
SKIP_CHECK[TOKEN_NAMES.COMMENT_BLOCK] = true;
SKIP_CHECK[TOKEN_NAMES.ACCESS_PROPERTY] = true;
SKIP_CHECK[TOKEN_NAMES.LINE_SEPARATION] = true;
SKIP_CHECK[TOKEN_NAMES.LINE_SEPARATION_BASIC] = true;
SKIP_CHECK[TOKEN_NAMES.LOGICAL_TERNARY_THEN] = true;
SKIP_CHECK[TOKEN_NAMES.STRING_TEMPLATE_ESCAPE] = true;
SKIP_CHECK[TOKEN_NAMES.STRING_TEMPLATE_EXPRESSION] = true;
SKIP_CHECK[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;

/**
 * Checks a branch for problems
 */
function CheckBranch(
  branch: IBranch<NonBasicTokenNames>,
  syntax: SyntaxProblems
) {
  // make sure there are kids
  if (branch.kids.length > 0) {
    // do we need to check our first recursive kid?
    // for example, two operators next to each other
    if (branch.name in RECURSION_CHECK) {
      if (branch.name === branch.kids[0]?.name) {
        branch.parseProblems.push(IDL_PROBLEM_CODES.DOUBLE_TOKEN);
        branch.kids[0].parseProblems.push(IDL_PROBLEM_CODES.DOUBLE_TOKEN);
        syntax.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.DOUBLE_TOKEN,
            branch.pos,
            branch.kids[0].pos
          )
        );
      }
    }

    // check all children
    CheckNeighbors(branch.kids, syntax);
  }
}

/**
 * Basic neighbor check to detect two of the same tokens next to each other
 * which is always invalid
 *
 * TODO: Properly handle line continuations
 */
function CheckNeighbors(tree: SyntaxTree, syntax: SyntaxProblems) {
  switch (true) {
    case tree.length == 0:
      return;
    case tree.length == 1:
      if (tree[0].name in SKIP_CHECK) {
        return;
      }
      // check if branch
      if (tree[0].type === BRANCH_TYPES.BRANCH) {
        CheckBranch(tree[0], syntax);
      }
      return;
    default:
      // process all tokens
      for (let i = 0; i < tree.length; i++) {
        // skip tokens that are allowed to be next to each other
        if (tree[i].name in SKIP_CHECK) {
          continue;
        }

        // check if branch
        if (tree[i].type === BRANCH_TYPES.BRANCH) {
          CheckBranch(tree[i] as IBranch<NonBasicTokenNames>, syntax);
        }

        // make sure we can check our neighbor
        if (i <= tree.length - 2) {
          if (
            tree[i].name === tree[i + 1].name &&
            tree[i].pos[0] === tree[i + 1].pos[0]
          ) {
            tree[i].parseProblems.push(IDL_PROBLEM_CODES.DOUBLE_TOKEN);
            tree[i + 1].parseProblems.push(IDL_PROBLEM_CODES.DOUBLE_TOKEN);
            syntax.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.DOUBLE_TOKEN,
                tree[i].pos,
                tree[i + 1].pos
              )
            );
          }
        }
      }
      break;
  }
}

IDL_SYNTAX_TREE_VALIDATOR.onTree((tree, parsed) => {
  CheckNeighbors(tree, parsed.parseProblems);
});
