import { ProcedureMethodCompletion } from '@idl/types/auto-complete';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

export interface IProcedureMethodCompletionArg
  extends BuildCompletionItemsArg<ProcedureMethodCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
