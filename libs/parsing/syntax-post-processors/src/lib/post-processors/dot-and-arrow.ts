import { IDL_SYNTAX_TREE_POST_PROCESSOR } from '@idl/parsing/syntax-tree';
import {
  ArrowToken,
  DotToken,
  IBasicToken,
  TOKEN_NAMES,
} from '@idl/parsing/tokenizer';

/**
 * Map unknown arrow to an arrow
 */
IDL_SYNTAX_TREE_POST_PROCESSOR.onBasicToken(TOKEN_NAMES.UNKNOWN, (token) => {
  if (token.match[0] === '->') {
    (token as any as IBasicToken<ArrowToken>).name = TOKEN_NAMES.ARROW;
  }
});

/**
 * Map decimal to a dot
 */
IDL_SYNTAX_TREE_POST_PROCESSOR.onBasicToken(TOKEN_NAMES.NUMBER, (token) => {
  if (token.match[0] === '.') {
    (token as any as IBasicToken<DotToken>).name = TOKEN_NAMES.DOT;
  }
});
