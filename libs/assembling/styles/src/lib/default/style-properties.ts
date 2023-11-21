import { TransformCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { ITokenCache } from '@idl/parsing/index';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * All of our tokens for numbers to process
 */
const PROPERTIES = [
  TOKEN_NAMES.ACCESS_PROPERTY,
  TOKEN_NAMES.STRUCTURE_PROPERTY,
];

ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.ACCESS_PROPERTY,
  (token, parsed, meta) => {
    // check for a property in our token cache
    const prop = (token.cache as ITokenCache)?.property;

    // if we have a known property, transform the display name
    if (prop !== undefined) {
      token.match[0] = `.${TransformCase(prop.display, meta.style.properties)}`;
    } else {
      token.match[0] = TransformCase(
        token.match[0].replace(/\s/g, ''),
        meta.style.properties
      );
    }
  }
);

ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.STRUCTURE_PROPERTY,
  (token, parsed, meta) => {
    // check for a property in our token cache
    const prop = (token.cache as ITokenCache)?.property;

    // transform case using known property or the text the user has written
    token.match[0] = TransformCase(
      prop !== undefined ? prop.display : token.match[0].replace(/\s/g, ''),
      meta.style.properties
    );
  }
);
