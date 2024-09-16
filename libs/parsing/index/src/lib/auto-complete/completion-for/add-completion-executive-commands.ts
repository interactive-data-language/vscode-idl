import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { TreeToken } from '@idl/parsing/syntax-tree';
import { IDLFileHelper } from '@idl/shared';
import { TokenName } from '@idl/tokenizer';
import { basename } from 'path';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { SORT_PRIORITY } from '../sort-priority.interface';
import { IExecutiveCommandCompletionOptions } from './add-completion-executive-commands.interface';

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
  complete: CompletionItem[],
  options: IExecutiveCommandCompletionOptions,
  formatting: IAssemblerOptions<FormatterType>,
  index: IDLIndex
) {
  switch (true) {
    case options.addFiles: {
      /**
       * Get all files
       */
      const files = Object.keys(index.knownFiles);

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
        complete.push({
          label: base,
          insertText: base.toLowerCase().replace('.pro', ''),
          kind: CompletionItemKind.File,
        });
      }
      break;
    }
    case options.isCompile:
      // do nothing
      break;
    default:
      // add all executive commands
      for (let i = 0; i < EXECUTIVE_COMMANDS.length; i++) {
        // properly case the executive command
        const cased = AdjustCase(
          EXECUTIVE_COMMANDS[i],
          formatting.style.control
        );

        // save completion item
        complete.push({
          label: cased,
          kind: CompletionItemKind.Constructor,
          sortText: SORT_PRIORITY.EXECUTIVE_COMMANDS,
          insertText: cased.substring(1),
        });
      }
      break;
  }
}

/**
 * Adds completion for executive commands
 */
export function AddCompletionExecutiveCommands(
  complete: CompletionItem[],
  token: TreeToken<TokenName>,
  formatting: IAssemblerOptions<FormatterType>,
  index: IDLIndex
) {
  BuildExecutiveCommandCompletionItems(
    complete,
    GetExecutiveCommandCompletionOptions(token),
    formatting,
    index
  );
}
