import {
  BRANCH_TYPES,
  IBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  SyntaxTree,
} from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';

/**
 * Recursion options
 */
interface IPointerRecurse {
  /** Name of the token that came before */
  before: TokenName | undefined;
}

/**
 * When we encounter these tokens, don't save them
 */
const DONT_SAVE_AS_BEFORE: { [key: string]: boolean } = {};
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.BLOCK] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.LINE_CONTINUATION] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.LINE_CONTINUATION_BASIC] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.COMMENT] = true;
DONT_SAVE_AS_BEFORE[TOKEN_NAMES.COMMENT_BLOCK] = true;

/**
 * Indicate tokens that can come before pointer dereferencing
 */
const OK_BEFORE: { [key: string]: boolean } = {};
OK_BEFORE[TOKEN_NAMES.COMMA] = true;
OK_BEFORE[TOKEN_NAMES.COLON] = true;
OK_BEFORE[TOKEN_NAMES.CALL_FUNCTION] = true;
OK_BEFORE[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
OK_BEFORE[TOKEN_NAMES.STRUCTURE_PROPERTY] = true;
OK_BEFORE[TOKEN_NAMES.STRUCTURE_INDEXED_PROPERTY] = true;
OK_BEFORE[TOKEN_NAMES.ASSIGNMENT] = true;
OK_BEFORE[TOKEN_NAMES.LINE_SEPARATION] = true;
OK_BEFORE[TOKEN_NAMES.LINE_SEPARATION_BASIC] = true;
OK_BEFORE[TOKEN_NAMES.OPERATOR] = true;
OK_BEFORE[TOKEN_NAMES.OPERATOR_LOGICAL] = true;
OK_BEFORE[TOKEN_NAMES.PARENTHESES] = true;
OK_BEFORE[TOKEN_NAMES.BRACKET] = true;
OK_BEFORE[TOKEN_NAMES.MAIN_LEVEL] = true;

// loops
OK_BEFORE[TOKEN_NAMES.LOOP_DO] = true;
OK_BEFORE[TOKEN_NAMES.LOOP_REPEAT] = true;
OK_BEFORE[TOKEN_NAMES.LOOP_UNTIL] = true;

// logic statements
OK_BEFORE[TOKEN_NAMES.LOGICAL_IF] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_THEN] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_ELSE] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_CASE] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_SWITCH] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_OF] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_EXPRESSION] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_TERNARY_THEN] = true;
OK_BEFORE[TOKEN_NAMES.LOGICAL_TERNARY_ELSE] = true;

/**
 * Parent tokens that can indicate pointer dereferencing
 */
const POINTER_PARENTS: { [key: string]: boolean } = {};
POINTER_PARENTS[TOKEN_NAMES.MAIN_LEVEL] = true;
POINTER_PARENTS[TOKEN_NAMES.ROUTINE_PROCEDURE] = true;
POINTER_PARENTS[TOKEN_NAMES.ROUTINE_FUNCTION] = true;
POINTER_PARENTS[TOKEN_NAMES.LOGICAL_OF] = true;

/**
 * Parent tokens that can indicate an asterisk being used for array indexing
 */
const INDEXING_PARENTS: { [key: string]: boolean } = {};
INDEXING_PARENTS[TOKEN_NAMES.BRACKET] = true;

/**
 * Turns "/keyword" into a single token for keyword-binary
 */
function SpecialOperatorsRecursor(tree: SyntaxTree, recurse: IPointerRecurse) {
  // return if no children
  if (tree.length === 0) {
    return;
  }

  /** Get current token name */
  let name: TokenName;
  let match: string;

  // process our tree
  for (let i = 0; i < tree.length; i++) {
    // update name
    name = tree[i].name;

    // check if we are an operator
    if (name === TOKEN_NAMES.OPERATOR) {
      match = tree[i].match[0];

      // make sure asterisk
      if (match === '*' || match === '-') {
        /** Init last parent */
        let lastParent: number = undefined;

        /**
         * Handle a few cases to figure out what our parent is
         */
        switch (true) {
          case tree[i].scope.length > 0: {
            lastParent = tree[i].scope[tree[i].scope.length - 1];
            break;
          }
          // no parents, re
          default:
            lastParent = TOKEN_NAMES.MAIN_LEVEL;
            break;
        }

        // check if we can change our name
        let update = false;
        switch (match) {
          /**
           * Check if we need to see what our asterisk means
           */
          case '*':
            switch (true) {
              case lastParent in POINTER_PARENTS || recurse.before in OK_BEFORE:
                update = true;
                break;
              default:
                break;
            }

            if (update) {
              switch (true) {
                case lastParent in INDEXING_PARENTS &&
                  (tree[i] as IBranch<any>).kids.length === 0:
                  tree[i].name = TOKEN_NAMES.OPERATOR_INDEXING;
                  break;
                default:
                  tree[i].name = TOKEN_NAMES.OPERATOR_POINTER;
                  break;
              }
            }
            break;
          /**
           * Check if we have negative vs subtraction
           */
          case '-':
            switch (true) {
              // first after bracket, filter before if sub-bracket that is closed
              case recurse.before === TOKEN_NAMES.BRACKET:
                update = true;
                break;
              case recurse.before in OK_BEFORE:
                update = true;
                break;
              default:
                break;
            }

            if (update) {
              tree[i].name = TOKEN_NAMES.OPERATOR_NEGATIVE;
            }
            break;
          default:
            break;
        }
      }
    }

    // save the token that came before
    if (!(name in DONT_SAVE_AS_BEFORE)) {
      recurse.before = name;
    }

    // check if we need to recurse
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      SpecialOperatorsRecursor((tree[i] as IBranch<any>).kids, recurse);
      recurse.before = undefined;
    }
  }
}

IDL_SYNTAX_TREE_POST_PROCESSOR.onTree((tree) => {
  SpecialOperatorsRecursor(tree, { before: undefined });
});
