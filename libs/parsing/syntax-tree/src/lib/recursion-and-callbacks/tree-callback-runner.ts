import { CancellationToken } from '@idl/cancellation-tokens';
import { TokenName } from '@idl/parsing/tokenizer';

import { TreeToken } from '../branches.interface';
import { IParsed } from '../parsed.interface';
import { TreeCallbackHandler } from './tree-callback-handler.class';
import { IHandlerCallbackMetadata } from './tree-callback-handler.interface';
import { TreeRecurser } from './tree-recurser';
import { DEFAULT_CURRENT } from './tree-recurser.interface';

/**
 * Applies our pre-processor to our syntax tree
 */
export function TreeCallbackRunner<TMeta extends IHandlerCallbackMetadata>(
  handler: TreeCallbackHandler<TMeta>,
  parsed: IParsed,
  cancel: CancellationToken,
  metaResolver: (
    token: TreeToken<TokenName>,
    meta: IHandlerCallbackMetadata
  ) => TMeta
) {
  // use our tree recurser to process what we parsed
  TreeRecurser(
    parsed,
    cancel,
    Object.assign(handler.recursionOptions, {
      onBasicToken: (token, current) => {
        handler.processBasicToken(token, parsed, () =>
          metaResolver(token, current)
        );
      },
      onBranchToken: (token, current) => {
        handler.processBranchToken(token, parsed, () =>
          metaResolver(token, current)
        );
      },
    })
  );

  // pre-process the tree
  handler.processTree(
    parsed.tree,
    parsed,
    metaResolver(undefined, DEFAULT_CURRENT)
  );
}
