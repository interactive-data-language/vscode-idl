import { FunctionMethodCompletion } from '@idl/types/auto-complete';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

export interface IFunctionMethodCompletionArg
  extends BuildCompletionItemsArg<FunctionMethodCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
