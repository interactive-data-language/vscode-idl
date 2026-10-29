import type { ProcedureMethodCompletion } from '@idl/types/auto-complete';

import type { BuildCompletionItemsArg } from '../build-completion-items.interface';

export interface IProcedureMethodCompletionArg
  extends BuildCompletionItemsArg<ProcedureMethodCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
