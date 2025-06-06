import { AdjustCase } from '@idl/assembling/shared';
import { IDLFileHelper } from '@idl/shared/extension';

import { TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/tokenizer';
import {
  ExecutiveCommandCompletion,
  IExecutiveCommandCompletionOptions,
} from '@idl/types/auto-complete';
import { basename } from 'path';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * All executive commands
 */
const EXECUTIVE_COMMANDS = [
  '.compile',
  '.continue',
  '.edit',
  '.full_reset_session',
  '.go',
  '.out',
  '.reset_session',
  '.return',
  // '.rnew',
  // '.run',
  '.skip',
  '.step',
  '.stepover',
  '.trace',
];

/**
 * Get options for executive command auto-complete
 */
export function GetExecutiveCommandCompletionOptions(
  token: TreeToken<TokenName>
): IExecutiveCommandCompletionOptions {
  /**
   * Do we add files
   */
  let addFiles = false;

  /**
   * If we have a compile command
   */
  let isCompile = false;

  /**
   * If we have a space, then skip auto-complete
   */
  if (token.match[0].split(/\s/).length > 1) {
    isCompile = true;
    /**
     * If we have a compile statement, lets do auto-complete for files on path
     */
    if (
      token.match[0].toLowerCase().startsWith(`.com`) &&
      token.match[0].endsWith(' ')
    ) {
      addFiles = true;
    }
  }

  return { isCompile, addFiles };
}

/**
 * Build auto-complete from options
 */
export function BuildExecutiveCommandCompletionItems(
  arg: BuildCompletionItemsArg<ExecutiveCommandCompletion>
) {
  switch (true) {
    case arg.options.addFiles: {
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
      break;
    }
    case arg.options.isCompile:
      // do nothing
      break;
    default:
      // add all executive commands
      for (let i = 0; i < EXECUTIVE_COMMANDS.length; i++) {
        // properly case the executive command
        const cased = AdjustCase(
          EXECUTIVE_COMMANDS[i],
          arg.formatting.style.control
        );

        // save completion item
        arg.complete.push({
          label: cased,
          kind: CompletionItemKind.Constructor,
          sortText: COMPLETION_SORT_PRIORITY.EXECUTIVE_COMMANDS,
          insertText: cased.substring(1),
        });
      }
      break;
  }
}
