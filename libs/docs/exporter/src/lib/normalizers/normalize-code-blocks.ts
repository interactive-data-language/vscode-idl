import { IDLIndex, ResolveHoverHelpLinks } from '@idl/parsing/index';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';

import { FormatDocsCode } from '../helpers/format-docs-code';

/**
 * For a given docs file, normalizes the code blocks for consistent syntax
 */
export async function NormalizeCodeBlocks(index: IDLIndex, docs: string) {
  /** Make array of strings */
  const split = ResolveHoverHelpLinks(docs, DEFAULT_IDL_EXTENSION_CONFIG).split(
    /\n/gim
  );

  // init start index
  let start: number;

  // check all lines
  for (let i = 0; i < split.length; i++) {
    // check for start
    if (
      split[i].trim().toLowerCase().startsWith('```idl') &&
      i !== split.length - 1
    ) {
      start = i + 1;
    }

    // if we have a start, look for finish
    if (start !== undefined) {
      if (split[i].trim() === '```') {
        // get the code to format
        const code = split.slice(start, i);

        // format the code
        const formatted = (await FormatDocsCode(index, code.join('\n'))).split(
          /\n/g
        );

        // replace
        for (let j = 0; j < code.length; j++) {
          split[start + j] = formatted[j];
        }

        // reset
        start = undefined;
      }
    }
  }

  return split.join('\n');
}
