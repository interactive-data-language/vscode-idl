import { CaseStyleFlags, STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
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
    switch (true) {
      case meta.style.properties === STYLE_FLAG_LOOKUP.MATCH: {
        const prop = (token.cache as ITokenCache).property;
        if (prop === undefined) {
          return;
        }
        token.match[0] = `.${prop.display}`;
        break;
      }
      default:
        token.match[0] = AdjustCase(
          token.match[0].replace(/\s/g, ''),
          meta.style.properties as CaseStyleFlags
        );
        break;
    }
    return;
  }
);

ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.STRUCTURE_PROPERTY,
  (token, parsed, meta) => {
    switch (true) {
      case meta.style.properties === STYLE_FLAG_LOOKUP.MATCH: {
        const prop = (token.cache as ITokenCache).property;
        if (prop === undefined) {
          return;
        }
        token.match[0] = prop.display;
        break;
      }
      default:
        token.match[0] = AdjustCase(
          token.match[0].replace(/\s/g, ''),
          meta.style.properties as CaseStyleFlags
        );
        break;
    }
    return;
  }
);
