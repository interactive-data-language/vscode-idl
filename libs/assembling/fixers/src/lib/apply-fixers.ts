import { ASSEMBLER_PROBLEM_FIXERS } from '@idl/assembling/tree-handlers';
import { IParsed, PopulateIndex } from '@idl/parsing/syntax-tree';

/**
 * Applies problem fixers to code
 */
export function ApplyFixers(parsed: IParsed) {
  ASSEMBLER_PROBLEM_FIXERS.run(parsed, (token, meta) => meta);

  // fix any index values in the tree
  PopulateIndex(parsed.tree);
}
