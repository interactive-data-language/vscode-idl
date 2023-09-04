import {
  ASSEMBLER_STYLER_LOOKUP,
  AssemblerStyler,
  ICodeStyle,
} from '@idl/assembling/config';
import { ASSEMBLER_DEFAULT_STYLING } from '@idl/assembling/tree-handlers';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed, PopulateScopeDetail } from '@idl/parsing/syntax-tree';

/**
 * Applies styles from a tree handler to our parsed code
 */
export function ApplyStyle(
  parsed: IParsed,
  cancel: CancellationToken,
  style: ICodeStyle,
  styler: AssemblerStyler = ASSEMBLER_STYLER_LOOKUP.DEFAULT
) {
  // make sure we have scope detail
  PopulateScopeDetail(parsed, cancel);

  switch (styler) {
    case ASSEMBLER_STYLER_LOOKUP.DEFAULT:
      // apply styling
      ASSEMBLER_DEFAULT_STYLING.run(parsed, cancel, (token, meta) => {
        return { ...meta, style };
      });
      break;
    default:
      throw new Error(`Unknown style to apply of: "${styler}"`);
  }
}
