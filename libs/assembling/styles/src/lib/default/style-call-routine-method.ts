import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { ITokenCache } from '@idl/parsing/index';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Handle function method formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  (token, parsed, meta) => {
    // get the type before
    const methods = (token.cache as ITokenCache)?.method;

    // check for data type
    if (methods === undefined) {
      return;
    }

    // return if we dont have any methods
    if (methods.length === 0) {
      return;
    }

    // get the display name for the method
    const display = methods[0].meta.display;

    // check if we need to match
    if (meta.style.routines === STYLE_FLAG_LOOKUP.MATCH) {
      token.match[0] = token.match[0].replace(
        token.match[2],
        display.split('::')[1]
      );
    }
  }
);

/**
 * Handle procedure method formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  (token, parsed, meta) => {
    // get the type before
    const methods = (token.cache as ITokenCache)?.method;

    // check for data type
    if (methods === undefined) {
      return;
    }

    // return if we dont have any methods
    if (methods.length === 0) {
      return;
    }

    // get the display name for the method
    const display = methods[0].meta.display;

    // check if we need to match or not
    if (meta.style.routines === STYLE_FLAG_LOOKUP.MATCH) {
      token.match[0] = token.match[0].replace(
        token.match[2],
        display.split('::')[1]
      );
    }
  }
);
