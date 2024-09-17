import { IDLFileHelper } from '@idl/shared';
import { basename } from 'path';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { IncludeCompletion } from './completion-include.interface';

/**
 * Adds completion items for include
 */
export function BuildIncludeCompletionItems(
  arg: BuildCompletionItemsArg<IncludeCompletion>
) {
  /**
   * Get all files
   */
  const files = Object.keys(arg.index.knownFiles);

  // process all files
  for (let i = 0; i < files.length; i++) {
    // skip if not PRO file
    if (!IDLFileHelper.isPROCode(files[i])) {
      continue;
    }

    /**
     * Get the base name
     */
    const base = basename(files[i]);

    // add in our completion item
    arg.complete.push({
      label: base,
      insertText: base.toLowerCase().replace('.pro', ''),
      kind: CompletionItemKind.File,
    });
  }
}
