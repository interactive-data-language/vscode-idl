import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed, PopulateIndex } from '@idl/parsing/syntax-tree';

/**
 * Applies problem fixers to code
 */
export function ApplyFixers(parsed: IParsed, cancel: CancellationToken) {
  ASSEMBLER_PROBLEM_FIXERS.run(parsed, cancel, (token, meta) => meta);

  // fix any index values in the tree
  PopulateIndex(parsed.tree);
}
