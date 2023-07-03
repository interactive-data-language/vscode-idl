import {
  BranchCallback,
  IBasicBranch,
  IDL_SYNTAX_TREE_POST_PROCESSOR,
  IDLSyntaxValidatorMeta,
} from '@idl/parsing/syntax-tree';
import {
  ArgDefinitionToken,
  KeywordDefinitionToken,
  NonBasicTokenNames,
  RoutineMethodNameToken,
  RoutineNameToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

export const SKIP_TOKENS: { [key: string]: any } = {};
SKIP_TOKENS[TOKEN_NAMES.COMMA] = true;
SKIP_TOKENS[TOKEN_NAMES.COMMENT] = true;
SKIP_TOKENS[TOKEN_NAMES.COMMENT_BLOCK] = true;
SKIP_TOKENS[TOKEN_NAMES.LINE_CONTINUATION] = true;
SKIP_TOKENS[TOKEN_NAMES.LINE_CONTINUATION_BASIC] = true;

/**
 * Turns variables for argument definitions into argument definition tokens for
 * stricter checking and making sure arguments are all defined before keywords
 */
const cb: BranchCallback<
  RoutineMethodNameToken | RoutineNameToken,
  IDLSyntaxValidatorMeta
> = (branch) => {
  // return if no children
  if (branch.kids.length === 0) {
    return;
  }

  // get children and filter out line continuations
  const children = branch.kids.filter((child) => !(child.name in SKIP_TOKENS));

  // find our matched
  for (let i = 0; i < children.length; i++) {
    /**
     * If the next token is assignment, then we have a keyword definition
     */
    if (children[i + 1]?.name === TOKEN_NAMES.ASSIGNMENT) {
      (children[i] as any as IBasicBranch<KeywordDefinitionToken>).name =
        TOKEN_NAMES.KEYWORD_DEFINITION;
      i++;
    } else {
      (children[i] as any as IBasicBranch<ArgDefinitionToken>).name =
        TOKEN_NAMES.ARG_DEFINITION;
    }
  }
};

/**
 * Tokens to process
 */
const TOKENS: NonBasicTokenNames[] = [
  TOKEN_NAMES.ROUTINE_NAME,
  TOKEN_NAMES.ROUTINE_METHOD_NAME,
];

// add all tokens
for (let i = 0; i < TOKENS.length; i++) {
  IDL_SYNTAX_TREE_POST_PROCESSOR.onBranchToken(TOKENS[i], cb);
}
