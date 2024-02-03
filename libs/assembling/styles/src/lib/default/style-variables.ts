import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { GetVariable } from '@idl/parsing/index';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { SerializeIDLType } from '@idl/types/core';

ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.SYSTEM_VARIABLE,
  (token, parsed, meta) => {
    // return if nothing to do
    if (meta.style.systemVariables === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    token.match[0] = AdjustCase(token.match[0], meta.style.systemVariables);
  }
);

ASSEMBLER_DEFAULT_STYLING.onBasicToken(
  TOKEN_NAMES.VARIABLE,
  (token, parsed, meta) => {
    // return if nothing to do
    if (meta.style.localVariables === STYLE_FLAG_LOOKUP.NONE) {
      return;
    }

    // get source information
    const source = GetVariable(token, parsed);
    if (source !== undefined) {
      // check if we have a static class reference
      if (source.meta.isStaticClass) {
        // serialize
        let serialized = SerializeIDLType(source.meta.type);

        // remove any type args
        const idxArgs = serialized.indexOf('<');
        if (idxArgs !== -1) {
          serialized = serialized.substring(0, idxArgs);
        }

        // handle multiple types - shouldnt happen, but just in case
        const idxOr = serialized.indexOf('|');
        if (idxOr !== -1) {
          serialized = serialized.substring(0, idxOr);
        }

        // save
        token.match[0] = serialized;
      } else {
        token.match = [source.meta.display];
      }
    }
  }
);
