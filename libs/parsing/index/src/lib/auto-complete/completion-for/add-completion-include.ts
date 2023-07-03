import { basename } from 'path';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';

/**
 * Adds completion items for include
 */
export function AddCompletionInclude(
  complete: CompletionItem[],
  index: IDLIndex
) {
  /**
   * Get all files
   */
  const files = Object.keys(index.knownFiles);

  // process all files
  for (let i = 0; i < files.length; i++) {
    // skip if not PRO file
    if (!index.isPROCode(files[i])) {
      continue;
    }

    /**
     * Get the base name
     */
    const base = basename(files[i]);

    // add in our completion item
    complete.push({
      label: base,
      insertText: base.toLowerCase().replace('.pro', ''),
      kind: CompletionItemKind.File,
    });
  }
}
