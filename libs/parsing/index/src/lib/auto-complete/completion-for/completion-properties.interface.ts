import { PropertyCompletion } from '@idl/types/auto-complete';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';

export interface IPropertyCompletionArg
  extends BuildCompletionItemsArg<PropertyCompletion> {
  /** Current methods that we have found */
  found?: { [key: string]: any };
}
