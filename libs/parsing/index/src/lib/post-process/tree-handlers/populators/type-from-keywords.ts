import { BasicCallback, GetNextInBranch } from '@idl/parsing/syntax-tree';
import { KeywordToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { GetKeyword } from '../../../helpers/get-keyword';
import { ITokenCache } from '../../../helpers/token-cache.interface';
import { TypeFromTokens } from '../../populate-type/from/type-from-tokens';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';

/**
 * Tokens that we are validating
 */
const TOKENS = [TOKEN_NAMES.KEYWORD];

/**
 * Types from keywords
 */
export const TYPE_FROM_KEYWORDS: BasicCallback<
  KeywordToken,
  PopulateTypeHandlerMeta
> = (token, parsed, meta) => {
  // get the next keyword
  const next = GetNextInBranch(token);

  // skip if not assignment
  if (next?.name !== TOKEN_NAMES.ASSIGNMENT) {
    return;
  }

  // update flag that we got the type from our kids
  (next.cache as ITokenCache).validatedRight = true;

  // only process if we have one kid without line continuations
  if (
    next.kids.filter((kid) => kid.name !== TOKEN_NAMES.LINE_CONTINUATION)
      .length > 1
  ) {
    TypeFromTokens(meta.index, parsed, next.kids);
    return;
  }

  /** Matching keyword */
  const kw = GetKeyword(meta.index, parsed, token);

  // check for keyword existence
  if (kw !== undefined) {
    // make sure it is not input
    if (kw.direction === 'in') {
      return;
    }
  }

  // get only child
  const kid = next.kids[0];

  // make sure variable
  if (kid?.name !== TOKEN_NAMES.VARIABLE) {
    return;
  }

  /** Variable name */
  const name = kid.match[0].toLowerCase();

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

  // return if already defined
  if (source.meta.isDefined) {
    return;
  }

  // set type if we have a keyword
  if (kw !== undefined) {
    source.meta.type = kw.type;
  }

  // update position
  source.pos = kid.pos;

  // save variable
  source.meta.isDefined = true;
};

// for (let i = 0; i < TOKENS.length; i++) {
//   POPULATE_TYPE_HANDLER.onBasicToken(TOKENS[i], VARIABLES_FROM_KEYWORDS);
// }
