import {
  BRANCH_TYPES,
  BranchCallback,
  IBasicBranch,
  IBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  IDLSyntaxValidatorMeta,
} from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  KeywordBinaryToken,
  NonBasicTokenNames,
  OperatorToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { SKIP_TOKENS } from './arg-kw-def';

/**
 * Turns "/keyword" into a single token for keyword-binary
 */
const cb: BranchCallback<
  | CallFunctionToken
  | CallFunctionMethodToken
  | CallProcedureToken
  | CallProcedureMethodToken,
  IDLSyntaxValidatorMeta
> = (branch) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  // set flag that we have a "comma" before (for functions we can have binary keyword before comma)
  let commaBefore = true;

  // track properties of
  let n = branch.kids.length;

  // find our matched
  for (let i = 0; i < n; i++) {
    // get child
    const child = branch.kids[i];

    // check for comma
    if (child.name === TOKEN_NAMES.COMMA) {
      commaBefore = true;
      continue;
    }

    // skip if we need to
    if (child.name in SKIP_TOKENS) {
      continue;
    }

    // determine how to proceed
    if (commaBefore) {
      // reset comma flag
      commaBefore = false;

      // check for operator which has children
      if (child.match[0] === '/') {
        const operatorChildren = (child as IBranch<OperatorToken>).kids;

        // get the first child
        const firstChild = operatorChildren[0];

        // make sure we have a child with the right name
        if (firstChild?.name === TOKEN_NAMES.VARIABLE) {
          // extract the keyword
          const kw = firstChild.match[0];

          // make our new token
          const basic: IBasicBranch<KeywordBinaryToken> = {
            type: BRANCH_TYPES.BASIC,
            name: TOKEN_NAMES.KEYWORD_BINARY,
            pos: [
              child.pos[0],
              child.pos[1],
              firstChild.pos[1] + firstChild.pos[2] - child.pos[1],
            ],
            match: [`/${kw}`, kw],
            idx: i,
            scope: [],
            parseProblems: [],
          };

          branch.kids[i] = basic;

          // move children if we have them
          if (operatorChildren.length > 1) {
            n += operatorChildren.length - 1;
            i += operatorChildren.length - 1;
            branch.kids.splice(i, 0, ...operatorChildren.slice(1));
          }
        }
      }
    }
  }
};

/**
 * Tokens to process
 */
const TOKENS: NonBasicTokenNames[] = [
  TOKEN_NAMES.CALL_FUNCTION,
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  TOKEN_NAMES.CALL_PROCEDURE,
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
];

// add all tokens
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_POST_PROCESSOR.onBranchToken(TOKENS[i], cb);
}
