import { BranchCallback, GetBeforeInBranch } from '@idl/parsing/syntax-tree';
import { AssignmentToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { ITokenCache } from '../../../helpers/token-cache.interface';
import { TypeFromTokens } from '../../populate-type/from/type-from-tokens';
import { VALIDATE_TYPE_HANDLER } from '../validate-type-handler';
import { ValidateTypeHandlerMeta } from '../validate-type-handler.interface';

/**
 * Tokens that we are validating
 */
const TOKENS = [TOKEN_NAMES.ASSIGNMENT];

/**
 * Tokens we dont validate assignment for
 */
const SKIP_IF_BEFORE: { [key: string]: any } = {};
SKIP_IF_BEFORE[TOKEN_NAMES.VARIABLE] = true;
SKIP_IF_BEFORE[TOKEN_NAMES.SYSTEM_VARIABLE] = true;
SKIP_IF_BEFORE[TOKEN_NAMES.KEYWORD] = true;
SKIP_IF_BEFORE[TOKEN_NAMES.KEYWORD_DEFINITION] = true;

/**
 * Callback to validate that a keyword is correct
 */
const cb: BranchCallback<AssignmentToken, ValidateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  // check if we have assignment next to validate
  const before = GetBeforeInBranch(token);
  if (before !== undefined) {
    if (before.name in SKIP_IF_BEFORE) {
      return;
    }
  }

  /**
   * Validate the tokens to the left
   */
  if (token.accessTokens.length > 0) {
    if (!(token.cache as ITokenCache).validatedLeft) {
      (token.cache as ITokenCache).validatedLeft = true;
      TypeFromTokens(meta.index, parsed, token.accessTokens);
    }
  }

  // generate type and validate
  if (!(token.cache as ITokenCache).validatedRight) {
    (token.cache as ITokenCache).validatedRight = true;
    TypeFromTokens(meta.index, parsed, token.kids);
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  VALIDATE_TYPE_HANDLER.onBranchToken(TOKENS[i], cb);
}
