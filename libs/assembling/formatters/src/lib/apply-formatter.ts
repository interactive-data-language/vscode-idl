import {
  ASSEMBLER_FORMATTER_LOOKUP,
  FormatterType,
} from '@idl/assembling/config';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed, TreeRecurser } from '@idl/parsing/syntax-tree';

import { DefaultFormatter } from './default-formatter';
import { BranchSnap } from './fiddle/formatters/branch-snap';
import { FIDDLE_FORMATTERS } from './fiddle/rule-set.interface';
import { FormatterRuleSet } from './formatter-rule-set.interface';

/**
 * Applies formatter rule sets to code
 */
export function ApplyFormatter(
  parsed: IParsed,
  cancel: CancellationToken,
  formatter: FormatterType
) {
  // init value of rule set
  let ruleSet: FormatterRuleSet;

  // determine which rule set to use
  switch (formatter) {
    case ASSEMBLER_FORMATTER_LOOKUP.FIDDLE:
      ruleSet = FIDDLE_FORMATTERS;
      break;
    default:
      throw new Error(`Unknown ruleset of ${formatter}`);
  }

  // use our tree recurser to process what we parsed
  TreeRecurser(parsed, cancel, {
    onBasicToken: (token, current) => {
      if (token.name in ruleSet) {
        // not sure why, but we need any here to have it work
        ruleSet[token.name](token as any, current);
      } else {
        DefaultFormatter(token);
      }
    },
    onBranchToken: (token, current) => {
      if (token.name in ruleSet) {
        // not sure why, but we need any here to have it work
        ruleSet[token.name](token as any, current);
      } else {
        DefaultFormatter(token);
      }

      // snap!
      BranchSnap(token, parsed.tree);
    },
  });
}
