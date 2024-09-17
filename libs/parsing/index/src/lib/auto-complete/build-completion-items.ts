import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AutoCompleteRecipe, AutoCompleteType } from '@idl/types/auto-complete';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { CompletionItem, MarkupKind } from 'vscode-languageserver';

import { ResolveHoverHelpLinks } from '../helpers/resolve-hover-help-links';
import { IDLIndex } from '../idl-index.class';
import { ALL_COMPLETION_ITEM_BUILDERS } from './build-completion-items.interface';

/**
 * Builds auto-complete items from our recipes
 */
export function BuildCompletionItems(
  index: IDLIndex,
  recipes: AutoCompleteRecipe<AutoCompleteType>[],
  config: IDLExtensionConfig,
  formatting: IAssemblerOptions<FormatterType>
) {
  /** initial list of completion items */
  const complete: CompletionItem[] = [];

  // process each item
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].type in ALL_COMPLETION_ITEM_BUILDERS) {
      ALL_COMPLETION_ITEM_BUILDERS[recipes[i].type]({
        complete,
        // overload with any because the types arent smart enough to figure it out...
        options: recipes[i].options as any,
        formatting,
        index,
      });
    }
  }

  // resolve links in any completion items and indicate that
  // we have markdown to present
  for (let i = 0; i < complete.length; i++) {
    if (complete[i].documentation) {
      complete[i].documentation = {
        kind: MarkupKind.Markdown,
        value: ResolveHoverHelpLinks(
          complete[i].documentation as string,
          config
        ),
      };
    }
  }

  return complete;
}
