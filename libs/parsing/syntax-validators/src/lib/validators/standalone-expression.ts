import {
  CHAIN_TOKEN_STARTS,
  GetChainEnd,
  IDL_SYNTAX_TREE_VALIDATOR,
  IParsed,
  SyntaxProblemWithTranslation,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  NonBasicTokenNames,
  OperatorIncrementDecrementToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Tokens that can appear first
 */
const OK_FIRST: { [key: string]: any } = {};

// miscellaneous
OK_FIRST[TOKEN_NAMES.COLON] = true;
OK_FIRST[TOKEN_NAMES.COMMA] = true;
OK_FIRST[TOKEN_NAMES.EXECUTIVE_COMMAND] = true;
OK_FIRST[TOKEN_NAMES.INCLUDE] = true;
OK_FIRST[TOKEN_NAMES.LINE_CONTINUATION] = true;
OK_FIRST[TOKEN_NAMES.LINE_SEPARATION] = true;
OK_FIRST[TOKEN_NAMES.PROMPT] = true;
OK_FIRST[TOKEN_NAMES.PYTHON] = true;
OK_FIRST[TOKEN_NAMES.UNKNOWN] = true;
OK_FIRST[TOKEN_NAMES.UNEXPECTED_CLOSER] = true;

// comments
OK_FIRST[TOKEN_NAMES.COMMENT] = true;
OK_FIRST[TOKEN_NAMES.COMMENT_BLOCK] = true;
OK_FIRST[TOKEN_NAMES.CALL_PROCEDURE] = true;
OK_FIRST[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true;
OK_FIRST[TOKEN_NAMES.BLOCK] = true;

// routines
OK_FIRST[TOKEN_NAMES.ROUTINE_NAME] = true;
OK_FIRST[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;

// logic statements
OK_FIRST[TOKEN_NAMES.LOGICAL_SWITCH] = true;
OK_FIRST[TOKEN_NAMES.LOGICAL_CASE] = true;
OK_FIRST[TOKEN_NAMES.LOGICAL_IF] = true;

// loops
OK_FIRST[TOKEN_NAMES.LOOP_FOR] = true;
OK_FIRST[TOKEN_NAMES.LOOP_FOREACH] = true;
OK_FIRST[TOKEN_NAMES.LOOP_WHILE] = true;
OK_FIRST[TOKEN_NAMES.LOOP_REPEAT] = true;
OK_FIRST[TOKEN_NAMES.LOOP_UNTIL] = true;
OK_FIRST[TOKEN_NAMES.LOOP_DO] = true;

// control statements
OK_FIRST[TOKEN_NAMES.CONTROL_BREAK] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_COMMON] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_COMPILE_OPT] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_CONTINUE] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_FORWARD_FUNCTION] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_GO_TO] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_JUMP] = true;
OK_FIRST[TOKEN_NAMES.CONTROL_ON_IOERROR] = true;

// TODO: IF POINTER, CHECK TO MAKE SURE RIGHT
OK_FIRST[TOKEN_NAMES.OPERATOR_POINTER] = true;

/**
 * Tokens that can come after a variable
 */
const AFTER_VAR: { [key: string]: any } = {};
AFTER_VAR[TOKEN_NAMES.ASSIGNMENT] = true;
AFTER_VAR[TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT] = true;
AFTER_VAR[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Call back to make sure that, if we have children, there is a comma first
 */
function Callback(token: TreeBranchToken, parsed: IParsed) {
  /** Get children */
  const kids = token.kids;

  /** Check if main level program */
  const inMain =
    token.name === TOKEN_NAMES.MAIN_LEVEL ||
    token.scope.indexOf(TOKEN_NAMES.MAIN_LEVEL) !== -1;

  // process all kids
  for (let i = 0; i < kids.length; i++) {
    // skip if nothing to check
    if (kids[i].name in OK_FIRST) {
      continue;
    }

    /**
     * Check increment/decrement operators
     */
    if (kids[i].name === TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT) {
      if (
        (kids[i] as TreeToken<OperatorIncrementDecrementToken>).kids[0]
          ?.name !== TOKEN_NAMES.VARIABLE
      ) {
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            inMain && parsed.isNotebook
              ? IDL_PROBLEM_CODES.IMPLIED_PRINT_NOTEBOOK
              : IDL_PROBLEM_CODES.STANDALONE_EXPRESSION,
            kids[i].pos,
            (kids[i] as TreeBranchToken)?.end?.pos || kids[i].pos
          )
        );
      }

      // shift
      i++;
      continue;
    }

    /**
     * Check variables
     */
    if (kids[i].name in CHAIN_TOKEN_STARTS) {
      /** Get original index */
      const orig = i;

      /** Get the end of the chain */
      i = GetChainEnd(kids, i);

      /** If the next token is not allowed, then we have problem */
      if (!(kids[i + 1]?.name in AFTER_VAR)) {
        parsed.parseProblems.push(
          SyntaxProblemWithTranslation(
            inMain && parsed.isNotebook
              ? IDL_PROBLEM_CODES.IMPLIED_PRINT_NOTEBOOK
              : IDL_PROBLEM_CODES.STANDALONE_EXPRESSION,
            kids[orig].pos,
            (kids[i] as TreeBranchToken)?.end?.pos || kids[i].pos
          )
        );
      } else {
        // shift
        i++;
      }

      continue;
    }

    // default
    parsed.parseProblems.push(
      SyntaxProblemWithTranslation(
        inMain && parsed.isNotebook
          ? IDL_PROBLEM_CODES.IMPLIED_PRINT_NOTEBOOK
          : IDL_PROBLEM_CODES.STANDALONE_EXPRESSION,
        kids[i].pos,
        (kids[i] as TreeBranchToken)?.end?.pos || kids[i].pos
      )
    );
  }
}

/**
 * Tokens to check for unexpected commas
 */
const TOKENS: NonBasicTokenNames[] = [
  // routines
  TOKEN_NAMES.ROUTINE_FUNCTION,
  TOKEN_NAMES.ROUTINE_PROCEDURE,
  TOKEN_NAMES.MAIN_LEVEL,

  // logic statements
  TOKEN_NAMES.LOGICAL_THEN,
  TOKEN_NAMES.LOGICAL_ELSE,
  TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN,
  TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT,

  // generic blocks of code
  TOKEN_NAMES.BLOCK,

  // loops
  TOKEN_NAMES.LOOP_DO,
  TOKEN_NAMES.LOOP_REPEAT,
];

// add all token syntax validators
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_VALIDATOR.onBranchToken(TOKENS[i], Callback);
}
