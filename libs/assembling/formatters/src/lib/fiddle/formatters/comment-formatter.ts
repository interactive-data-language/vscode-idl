import { CommentToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { TokenFormatter } from '../../formatter-rule-set.interface';

/**
 * For the default assembler, formats comments to be consistent
 */
export const COMMENT_FORMATTER: TokenFormatter<CommentToken> = (
  token,
  meta
) => {
  /**
   * Check if our comment is in a comment block. If so, then we preserve all
   * left alignment, even if it isn't quite right.
   *
   * Would need a special formatter to format comment blocks for consistency
   * which is doable and not rocket science
   */
  if (meta.scope.slice(-1)[0] === TOKEN_NAMES.COMMENT_BLOCK) {
    token.match[0] = `;${token.match[0].substring(1)}`.trimEnd();
  } else {
    token.match[0] = `; ${token.match[0].substring(1).trim()}`;
  }
};
