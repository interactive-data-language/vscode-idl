import {
  BranchCallback,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  IDLSyntaxValidatorMeta,
} from '@idl/parsing/syntax-tree';
import {
  ControlCommonToken,
  ControlCompileOptToken,
  ControlForwardFunctionOptToken,
  ControlGoToToken,
  NonBasicTokenNames,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Turns variables for compound control statements into control options
 * so they are separate
 */
const cb: BranchCallback<
  | ControlCommonToken
  | ControlCompileOptToken
  | ControlForwardFunctionOptToken
  | ControlGoToToken,
  IDLSyntaxValidatorMeta
> = (branch) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  // find our matched
  for (let i = 0; i < branch.kids.length; i++) {
    // map name if variable
    if (branch.kids[i].name === TOKEN_NAMES.VARIABLE) {
      branch.kids[i].name = TOKEN_NAMES.CONTROL_OPTION;
    }
  }
};

/**
 * Tokens to process
 */
const TOKENS: NonBasicTokenNames[] = [
  //   TOKEN_NAMES.CONTROL_COMMON,
  TOKEN_NAMES.CONTROL_COMPILE_OPT,
  TOKEN_NAMES.CONTROL_FORWARD_FUNCTION,
  TOKEN_NAMES.CONTROL_GO_TO,
];

// add all tokens
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_POST_PROCESSOR.onBranchToken(TOKENS[i], cb);
}
