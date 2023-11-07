import { FullCaseStyleFlags, STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase, TransformCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { CUSTOM_TYPE_DISPLAY_NAMES } from '@idl/data-types/core';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';

/**
 * Style the structure name
 */
function StyleStructureName(name: string, flag: FullCaseStyleFlags) {
  const low = name.toLowerCase().trim();
  return TransformCase(
    low in CUSTOM_TYPE_DISPLAY_NAMES ? CUSTOM_TYPE_DISPLAY_NAMES[low] : name,
    flag
  );
}

// handle inheritance statements
ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.STRUCTURE_INHERITANCE,
  (token, parsed, meta) => {
    /**
     * Style inheritance control statement
     */
    switch (meta.style.control) {
      case STYLE_FLAG_LOOKUP.LOWER:
        token.match[0] = token.match[0].replace(/inherits/gim, 'inherits');
        break;
      case STYLE_FLAG_LOOKUP.UPPER:
        token.match[0] = token.match[0].replace(/inherits/gim, 'INHERITS');
        break;
      default:
        // do nothing
        break;
    }

    /**
     * Style class name
     */
    token.match[0] = token.match[0].replace(
      token.match[1],
      StyleStructureName(token.match[1], meta.style.structureNames)
    );
  }
);

// handle inheritance statements
ASSEMBLER_DEFAULT_STYLING.onBranchToken(
  TOKEN_NAMES.STRUCTURE_NAME,
  (token, parsed, meta) => {
    switch (true) {
      // check for system variable
      case token.match[0].trim().startsWith('!'):
        token.match[0] = AdjustCase(token.match[0], meta.style.systemVariables);
        break;
      // default to case transform!
      default: {
        token.match[0] = StyleStructureName(
          token.match[0],
          meta.style.structureNames
        );
        break;
      }
    }
  }
);
