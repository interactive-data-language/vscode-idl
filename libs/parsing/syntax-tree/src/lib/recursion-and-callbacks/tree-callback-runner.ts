import { CancellationToken } from '@idl/cancellation-tokens';

import { IParsed } from '../parsed.interface';
import { TreeCallbackHandler } from './tree-callback-handler.class';
import { IHandlerCallbackMetadata } from './tree-callback-handler.interface';
import { TreeRecurser } from './tree-recurser';

/**
 * Applies our pre-processor to our syntax tree
 */
export function TreeCallbackRunner<TMeta extends IHandlerCallbackMetadata>(
  handler: TreeCallbackHandler<TMeta>,
  parsed: IParsed,
  cancel: CancellationToken,
  meta: TMeta
) {
  // use our tree recurser to process what we parsed
  TreeRecurser(
    parsed.tree,
    cancel,
    Object.assign(handler.recursionOptions, {
      onBasicToken: (token, current) => {
        handler.processBasicToken(token, parsed, current, meta);
      },
      onBranchToken: (token, current) => {
        handler.processBranchToken(token, parsed, current, meta);
      },
    })
  );

  // pre-process the tree
  handler.processTree(parsed.tree, parsed, meta);
}
