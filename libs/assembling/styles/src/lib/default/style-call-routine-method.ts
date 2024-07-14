import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { ITokenCache } from '@idl/parsing/index';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Handle function method formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_FUNCTION_METHOD,
  (token, parsed, meta) => {
    if (meta.style.routineMethods === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    // get the type before
    const methods = (token.cache as ITokenCache)?.method;

    // check if we give benefit-of-the-doubt and dont have known
    if (meta.vanilla || methods === undefined || methods.length === 0) {
      token.match[0] = token.match[0].replace(
        token.match[2],
        TransformCase(token.match[2], meta.style.routineMethods)
      );
      return;
    }

    // get the display name for the method
    const display = methods[0].meta.display;

    // check if we need to transform the text
    token.match[0] = token.match[0].replace(
      token.match[2],
      TransformCase(display.split('::')[1], meta.style.routineMethods)
    );
  }
);

/**
 * Handle procedure method formatting
 */
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.CALL_PROCEDURE_METHOD,
  (token, parsed, meta) => {
    if (meta.style.routineMethods === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    // get the type before
    const methods = (token.cache as ITokenCache)?.method;

    // check if we give benefit-of-the-doubt and dont have known
    if (meta.vanilla || methods === undefined || methods.length === 0) {
      token.match[0] = token.match[0].replace(
        token.match[2],
        TransformCase(token.match[2], meta.style.routineMethods)
      );
      return;
    }

    // get the display name for the method
    const display = methods[0].meta.display;

    // check if we need to transform the text
    token.match[0] = token.match[0].replace(
      token.match[2],
      TransformCase(display.split('::')[1], meta.style.routineMethods)
    );
  }
);
