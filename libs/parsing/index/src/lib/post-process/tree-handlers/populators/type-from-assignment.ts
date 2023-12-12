import {
  BasicCallback,
  GetBefore,
  GetNextInBranch,
} from '@idl/parsing/syntax-tree';
import {
  SystemVariableToken,
  TOKEN_NAMES,
  VariableToken,
} from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { ITokenCache } from '../../../helpers/token-cache.interface';
import { TypeFromTokens } from '../../populate-type/from/type-from-tokens';
import { POPULATE_TYPE_HANDLER } from '../populate-type-handler';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';
import { TYPE_FROM_KEYWORDS } from './type-from-keywords';

/**
 * Tokens that we are validating
 */
const TOKENS = [TOKEN_NAMES.VARIABLE, TOKEN_NAMES.SYSTEM_VARIABLE];

/**
 * Parents that we have which mean we aren't really assigning ourself a value
 */
export const FAKE_ASSIGNMENT_PARENTS: { [key: string]: any } = {};
FAKE_ASSIGNMENT_PARENTS[TOKEN_NAMES.OPERATOR_POINTER] = true;

/**
 * Get type from assignment
 *
 * NOTE: If variables are defined in-line within expressions, then
 * those are defined within `TypeFromMultipleTokens()`
 */
const cb: BasicCallback<
  VariableToken | SystemVariableToken,
  PopulateTypeHandlerMeta
> = (token, parsed, meta) => {
  // return if keyword is before
  const before = GetBefore(GetBefore(token));
  if (before?.name === TOKEN_NAMES.KEYWORD) {
    TYPE_FROM_KEYWORDS(before, parsed, meta);
    return;
  }

  // if our parent is an operator, return
  if (token.scope[token.scope.length - 1] in FAKE_ASSIGNMENT_PARENTS) {
    return;
  }

  // get the next token in our branch
  const next = GetNextInBranch(token);

  // return if no keyword
  if (next === undefined) {
    return;
  }

  // skip if not assignment
  if (next.name !== TOKEN_NAMES.ASSIGNMENT) {
    return;
  }

  // update flag that we got the type from our kids
  (next.cache as ITokenCache).validatedRight = true;

  /**
   * Always get our assignment type so we validate, but only save if it is the first time we
   * are saving it
   */
  const assignmentType = TypeFromTokens(meta.index, parsed, next.kids);

  // return if system variable
  if (token.name === TOKEN_NAMES.SYSTEM_VARIABLE) {
    return;
  }

  /** Variable name */
  const name = token.match[0].toLowerCase();

  // skip self
  if (name === 'self') {
    return;
  }

  // get variable source
  const source = meta.variables[name];

  // skip forward if we dont have anything
  if (source === undefined) {
    return;
  }

  // return if we already found this
  if (source.meta.isDefined) {
    return;
  }

  // update types
  source.meta.type = copy(assignmentType);

  // update position
  source.pos = copy(token.pos);

  // track that we have found this variable
  source.meta.isDefined = true;
};

for (let i = 0; i < TOKENS.length; i++) {
  POPULATE_TYPE_HANDLER.onBasicToken(TOKENS[i], cb);
}
