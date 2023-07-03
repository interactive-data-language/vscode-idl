import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import {
  ASSEMBLER_DEFAULT_STYLING,
  AssemblerStyleMeta,
} from '@idl/assembling/tree-handlers';
import { BasicCallback, BranchCallback } from '@idl/parsing/syntax-tree';
import { BasicTokenNames, NonBasicTokenNames } from '@idl/parsing/tokenizer';

import { BASIC_CONTROL, BRANCH_CONTROL } from './style-control.interface';

/**
 * Callback to format basic tokens
 */
const BasicControlCallback: BasicCallback<
  BasicTokenNames,
  AssemblerStyleMeta
> = (token, parsed, meta) => {
  token.match[0] = AdjustCase(token.match[0], meta.style.control);
};

// ASSEMBLER_PRE_PROCESSOR
for (let i = 0; i < BASIC_CONTROL.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBasicToken(
    BASIC_CONTROL[i],
    BasicControlCallback
  );
}

/**
 * Callback t format basic tokens
 */
const BranchControlCallback: BranchCallback<
  NonBasicTokenNames,
  AssemblerStyleMeta
> = (token, parsed, meta) => {
  if (meta.style.control === STYLE_FLAG_LOOKUP.NONE) {
    return;
  }

  // check if we have formatting to apply
  // format the start
  if (token.match.length > 0) {
    token.match[0] = AdjustCase(token.match[0], meta.style.control);
  }

  // format the end
  if (token.end !== undefined) {
    if (token.end.match.length > 0) {
      token.end.match[0] = AdjustCase(token.end.match[0], meta.style.control);
    }
  }
};

// ASSEMBLER_PRE_PROCESSOR
for (let i = 0; i < BRANCH_CONTROL.length; i++) {
  ASSEMBLER_DEFAULT_STYLING.onBranchToken(
    BRANCH_CONTROL[i],
    BranchControlCallback
  );
}
