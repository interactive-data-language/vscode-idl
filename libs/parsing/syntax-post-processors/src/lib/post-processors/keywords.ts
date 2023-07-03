import {
  BranchCallback,
  IBasicBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  IDLSyntaxValidatorMeta,
} from '@idl/parsing/syntax-tree';
import {
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  KeywordToken,
  NonBasicTokenNames,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

import { SKIP_TOKENS } from './arg-kw-def';

/**
 * Turns "KW =" into a keyword definition to delineate from variables and enable
 * strict checking eventually.
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

  // get children and filter out line continuations
  const children = branch.kids.filter((child) => !(child.name in SKIP_TOKENS));

  // find our matched
  for (let i = 0; i < children.length - 1; i++) {
    // skip if not variable
    if (children[i].name !== TOKEN_NAMES.VARIABLE) {
      continue;
    }

    // if next token is assignment, then we have a keyword
    if (children[i + 1]?.name === TOKEN_NAMES.ASSIGNMENT) {
      (children[i] as any as IBasicBranch<KeywordToken>).name =
        TOKEN_NAMES.KEYWORD;
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
